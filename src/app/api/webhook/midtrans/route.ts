import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Validate signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const hash = crypto.createHash('sha512')
      .update(payload.order_id + payload.status_code + payload.gross_amount + serverKey)
      .digest('hex');

    if (hash !== payload.signature_key) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const transactionStatus = payload.transaction_status;
    const fraudStatus = payload.fraud_status;

    let paymentStatus = 'PENDING';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        paymentStatus = 'PENDING'; // needs manual review
      } else if (fraudStatus === 'accept') {
        paymentStatus = 'PAID';
      }
    } else if (transactionStatus === 'settlement') {
      paymentStatus = 'PAID';
    } else if (transactionStatus === 'expire') {
      paymentStatus = 'EXPIRED';
    } else if (transactionStatus === 'cancel') {
      paymentStatus = 'CANCELLED';
    } else if (transactionStatus === 'deny') {
      paymentStatus = 'FAILED';
    } else if (transactionStatus === 'pending') {
      paymentStatus = 'PENDING';
    }

    let { data: payment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('midtrans_order_id', payload.order_id)
      .maybeSingle();

    const bookingId = payload.order_id.substring(0, 36);

    // Older payment rows may have a slightly different order-id suffix. Once
    // the booking UUID is known, safely fall back to its initial payment row.
    if (!payment) {
      const { data: fallbackPayment } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('booking_id', bookingId)
        .eq('source', 'INITIAL_BOOKING')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      payment = fallbackPayment;
    }

    // Fetch current booking to check status and get details for email
    const { data: currentBooking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !currentBooking) {
      console.error('Failed to fetch booking for webhook:', fetchError);
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (payment) {
      const paymentUpdate: Record<string, string | null> = {
        status: paymentStatus,
        updated_at: new Date().toISOString(),
        paid_at: paymentStatus === 'PAID' ? new Date().toISOString() : null,
      };

      const { error: paymentUpdateError } = await supabaseAdmin
        .from('payments')
        .update(paymentUpdate)
        .eq('id', payment.id);

      if (paymentUpdateError) {
        console.error('Failed to update payment:', paymentUpdateError);
        return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
      }
    }

    // The booking-level status is retained for the public booking confirmation flow.
    // Later admin payment requests have their own independent status.
    const isInitialPayment = !payment || payment.source === 'INITIAL_BOOKING' || payment.source === 'LEGACY';
    const bookingStatus = paymentStatus === 'PAID'
      ? 'PAID'
      : ['FAILED', 'EXPIRED', 'CANCELLED'].includes(paymentStatus)
        ? 'CANCELLED'
        : 'PENDING';

    if (isInitialPayment && currentBooking.status !== bookingStatus) {
      const { error: updateError } = await supabaseAdmin
        .from('bookings')
        .update({ status: bookingStatus })
        .eq('id', bookingId);

      if (updateError) {
        console.error('Failed to update booking status:', updateError);
        return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
      }

      // Send email if it just became PAID
      if (bookingStatus === 'PAID') {
        const { sendPaymentSuccessEmail, sendCustomerReceiptEmail } = await import('@/app/actions/emailActions');
        await sendPaymentSuccessEmail(currentBooking);
        await sendCustomerReceiptEmail(currentBooking);
      }
    }

    revalidatePath('/admin');
    return NextResponse.json({ success: true, status: paymentStatus });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Webhook processing failed' }, { status: 500 });
  }
}
