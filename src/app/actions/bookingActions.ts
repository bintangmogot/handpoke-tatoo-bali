'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';

export async function getBookedSlots() {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('booking_date, booking_time, status')
    .in('status', ['PENDING', 'PAID', 'CONFIRMED']);
    
  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
  return data || [];
}

export async function getBlockedDates() {
  const { data, error } = await supabaseAdmin
    .from('blocked_dates')
    .select('date, start_time, end_time');
    
  if (error) {
    console.error('Error fetching blocked dates:', error);
    return [];
  }
  return data || [];
}

export async function getOpenHours() {
  const { data, error } = await supabaseAdmin
    .from('studio_settings')
    .select('value')
    .eq('key', 'open_hours')
    .single();
    
  if (error || !data) {
    return { start: '10:00', end: '18:00' }; // fallback
  }
  return data.value;
}

export async function createBooking(bookingData: any) {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert([
      {
        name: bookingData.name,
        email: bookingData.email,
        whatsapp: bookingData.whatsapp,
        booking_date: bookingData.date,
        booking_time: bookingData.time,
        session_type: bookingData.type,
        placement: bookingData.placement || 'TBD',
        description: bookingData.description || '',
        price: bookingData.totalPrice,
        status: 'PENDING',
        payment_link: 'https://mock-xendit-link.com/' + Date.now()
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw new Error(error.message);
  }

  return data;
}
