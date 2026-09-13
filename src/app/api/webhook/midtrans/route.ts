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

    // Order ID format is bookingId-timestamp
    const bookingId = payload.order_id.split('-')[0];

    // Update the database
    const { error } = await supabaseAdmin
      .from('bookings')
      .update({ status: bookingStatus })
      .eq('id', bookingId);

    if (error) {
      console.error('Failed to update booking status:', error);
      return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, status: bookingStatus });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
