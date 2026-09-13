'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
const midtransClient = require('midtrans-client');

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
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY
    });

    // 3. Set transaction parameters
    let parameter = {
      transaction_details: {
        order_id: bookingId + '-' + Date.now(), // Append timestamp to avoid duplicate order_id issues during testing
        gross_amount: Math.round(booking.deposit || booking.price), // In Midtrans, gross_amount must be integer
      },
      customer_details: {
        first_name: booking.name,
        email: booking.email || 'no-email@example.com',
        phone: booking.whatsapp
      },
      item_details: [{
        id: 'TATOO-DP',
        price: Math.round(booking.deposit || booking.price),
        quantity: 1,
        name: 'Tattoo Session Deposit: ' + booking.session_type
      }]
    };

    // 4. Create transaction token
    const transaction = await snap.createTransaction(parameter);
    
    return { token: transaction.token, redirect_url: transaction.redirect_url };
  } catch (error: any) {
    console.error('Midtrans Error:', error);
    throw new Error(error.message || 'Failed to create payment transaction');
  }
}
