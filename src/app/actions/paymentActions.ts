'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import midtransClient from 'midtrans-client';

export async function createMidtransTransaction(bookingId: string) {
  try {
    // 1. Fetch booking details from database
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      console.error('Failed to fetch booking in payment action:', { bookingId, error });
      throw new Error(`Booking not found. ID: ${bookingId}. Error: ${error?.message || 'Unknown'}`);
    }

    // 2. Initialize Midtrans Snap
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY
    });

    // 3. Set transaction parameters
    const amount = Math.round(booking.deposit || booking.price);
    const orderId = `${bookingId}-${Date.now().toString(36)}`;
    const description = booking.session_type === 'custom'
      ? 'Initial consultation deposit'
      : 'Initial tattoo deposit';
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: booking.name,
        email: booking.email || 'no-email@example.com',
        phone: booking.whatsapp
      },
      item_details: [{
        id: 'TATOO-DP',
        price: amount,
        quantity: 1,
        name: description,
      }]
    };

    // 4. Create transaction token
    const transaction = await snap.createTransaction(parameter);

    const { error: paymentError } = await supabaseAdmin.from('payments').insert([{
      booking_id: bookingId,
      description,
      amount,
      status: 'PENDING',
      source: 'INITIAL_BOOKING',
      midtrans_order_id: orderId,
      payment_link: transaction.redirect_url,
    }]);

    if (paymentError) {
      console.error('Could not save initial payment record:', paymentError);
    }
    
    return { token: transaction.token, redirect_url: transaction.redirect_url };
  } catch (error: unknown) {
    console.error('Midtrans Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create payment transaction');
  }
}
