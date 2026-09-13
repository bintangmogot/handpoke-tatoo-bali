import { NextResponse } from 'next/server';
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

    let bookingStatus = 'PENDING';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        bookingStatus = 'PENDING'; // need manual review
      } else if (fraudStatus === 'accept') {
        bookingStatus = 'PAID';
      }
    } else if (transactionStatus === 'settlement') {
      bookingStatus = 'PAID';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      bookingStatus = 'CANCELLED';
    } else if (transactionStatus === 'pending') {
      bookingStatus = 'PENDING';
    }

    // Order ID format is bookingId-timestamp. Since bookingId is a UUID (which contains hyphens),
    // we cannot use split('-')[0]. A UUID is exactly 36 characters long.
    const bookingId = payload.order_id.substring(0, 36);

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

    // Update the database if status changed
    if (currentBooking.status !== bookingStatus) {
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
        const { sendPaymentSuccessEmail } = await import('@/app/actions/emailActions');
        await sendPaymentSuccessEmail(currentBooking);
      }
    }

    return NextResponse.json({ success: true, status: bookingStatus });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
