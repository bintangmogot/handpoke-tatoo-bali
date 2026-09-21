'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { DEFAULT_WEEKLY_HOURS, normalizeWeeklyHours } from '@/lib/studio-hours';

type BookingInput = {
  name: string;
  email: string;
  whatsapp: string;
  placement: string;
  description?: string;
  date: string;
  time: string;
  type: 'flash' | 'custom';
  totalPrice: number;
  deposit: number;
  design_url?: string | null;
  placement_url?: string | null;
};

export async function getBookedSlots() {
  // Now queries the appointments table for all SCHEDULED appointments
  const { data, error } = await supabaseAdmin
    .from('appointments')
    .select('date, time, duration_hours, status')
    .eq('status', 'SCHEDULED');
    
  if (error) {
    console.error('Error fetching appointments:', error);
    // Fallback: try old bookings table for backwards compatibility
    const { data: fallback } = await supabaseAdmin
      .from('bookings')
      .select('booking_date, booking_time, status')
      .in('status', ['PENDING', 'PAID', 'CONFIRMED']);
    return (fallback || []).map(b => ({ 
      date: b.booking_date, 
      time: b.booking_time, 
      duration_hours: 2, 
      status: b.status 
    }));
  }
  return data || [];
}

export async function getBlockedDates() {
  const { data, error } = await supabaseAdmin
    .from('blocked_dates')
    .select('date, start_time, end_time, reason');
    
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
    return DEFAULT_WEEKLY_HOURS;
  }
  return normalizeWeeklyHours(data.value);
}

export async function createBooking(bookingData: BookingInput) {
  const isCustom = bookingData.type === 'custom';
  const stage = isCustom ? 'CONSULTATION_BOOKED' : 'SESSION_SCHEDULED';

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
        deposit: bookingData.deposit,
        status: 'PENDING',
        stage: stage,
        payment_link: null,
        design_url: bookingData.design_url || null,
        placement_url: bookingData.placement_url || null,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw new Error(error.message);
  }

  // Auto-create appointment to block the calendar slot
  const appointmentType = isCustom ? 'consultation' : 'tattoo_session';
  const defaultDuration = isCustom ? 1 : 2; // consultation = 1hr, flash tattoo = 2hr

  const { error: apptError } = await supabaseAdmin
    .from('appointments')
    .insert([
      {
        booking_id: data.id,
        type: appointmentType,
        date: bookingData.date,
        time: bookingData.time,
        duration_hours: defaultDuration,
        status: 'SCHEDULED',
        notes: isCustom ? 'Initial consultation' : 'Flash tattoo session',
      }
    ]);

  if (apptError) {
    console.error('Error creating appointment:', apptError);
    // Don't throw - booking was created successfully, appointment is supplementary
  }

  return data;
}
