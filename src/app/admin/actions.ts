'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

// ────────────────────────────────────────────────
// Blocked Dates Management (existing)
// ────────────────────────────────────────────────

export async function blockDateAction(formData: FormData) {
  const date = formData.get('date') as string;
  const reason = formData.get('reason') as string;
  const start_time = formData.get('start_time') as string || null;
  const end_time = formData.get('end_time') as string || null;

  if (!date) return { error: 'Date is required' };

  const { error } = await supabaseAdmin
    .from('blocked_dates')
    .insert([{ date, reason, start_time, end_time }]);

  if (error) {
    if (error.code === '23505') {
      return { error: 'Date is already blocked' };
    }
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function unblockDateAction(id: string) {
  const { error } = await supabaseAdmin
    .from('blocked_dates')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

// ────────────────────────────────────────────────
// Stage Management (new)
// ────────────────────────────────────────────────

const STAGE_ORDER = [
  'CONSULTATION_BOOKED',
  'DESIGN_IN_PROGRESS',
  'DEAL_CONFIRMED',
  'SESSION_SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
] as const;

export type Stage = typeof STAGE_ORDER[number];

const STAGE_LABELS: Record<string, string> = {
  CONSULTATION_BOOKED: 'Consultation Booked',
  DESIGN_IN_PROGRESS: 'Design in Progress',
  DEAL_CONFIRMED: 'Deal Confirmed',
  SESSION_SCHEDULED: 'Session Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export async function getStageLabels() {
  return STAGE_LABELS;
}

export async function advanceStage(
  bookingId: string,
  newStage: string,
  appointmentData?: {
    date: string;
    time: string;
    duration_hours: number;
    type: 'consultation' | 'design_review' | 'tattoo_session';
    notes?: string;
  },
  priceUpdate?: {
    price: number;
  }
) {
  // 1. Update the booking stage
  const updateData: any = { stage: newStage };
  
  // If price is being set (Deal Confirmed stage)
  if (priceUpdate) {
    updateData.price = priceUpdate.price;
    updateData.deposit = Math.round(priceUpdate.price * 0.5); // 50% DP for tattoo session
  }

  const { error: bookingError } = await supabaseAdmin
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId);

  if (bookingError) {
    return { error: bookingError.message };
  }

  // 2. Create new appointment if date/time provided
  if (appointmentData) {
    const { error: apptError } = await supabaseAdmin
      .from('appointments')
      .insert([{
        booking_id: bookingId,
        type: appointmentData.type,
        date: appointmentData.date,
        time: appointmentData.time,
        duration_hours: appointmentData.duration_hours,
        status: 'SCHEDULED',
        notes: appointmentData.notes || `Stage: ${STAGE_LABELS[newStage] || newStage}`,
      }]);

    if (apptError) {
      console.error('Error creating appointment:', apptError);
      return { error: 'Stage updated but failed to create appointment: ' + apptError.message };
    }
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function updateBookingPrice(bookingId: string, price: number) {
  const deposit = Math.round(price * 0.5); // 50% deposit

  const { error } = await supabaseAdmin
    .from('bookings')
    .update({ price, deposit })
    .eq('id', bookingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function getBookingWithAppointments(bookingId: string) {
  const { data: booking, error: bookingError } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (bookingError || !booking) {
    return { error: bookingError?.message || 'Booking not found' };
  }

  const { data: appointments, error: apptError } = await supabaseAdmin
    .from('appointments')
    .select('*')
    .eq('booking_id', bookingId)
    .order('date', { ascending: true });

  return {
    booking,
    appointments: appointments || [],
  };
}

export async function sendPaymentLinkToCustomer(bookingId: string) {
  // Fetch booking details
  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (error || !booking) {
    return { error: 'Booking not found' };
  }

  if (!booking.price || booking.price <= 0) {
    return { error: 'Please set the price before sending payment link' };
  }

  try {
    const midtransClient = require('midtrans-client');
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const deposit = Math.round(booking.price * 0.5);
    const parameter = {
      transaction_details: {
        order_id: bookingId.substring(0, 36) + '-' + Date.now().toString(36),
        gross_amount: deposit,
      },
      customer_details: {
        first_name: booking.name,
        email: booking.email || 'no-email@example.com',
        phone: booking.whatsapp,
      },
      item_details: [{
        id: 'TATOO-DP-50',
        price: deposit,
        quantity: 1,
        name: 'Tattoo Session Deposit (50%): ' + booking.session_type,
      }],
    };

    const transaction = await snap.createTransaction(parameter);

    // Update booking with payment link
    await supabaseAdmin
      .from('bookings')
      .update({ 
        deposit: deposit,
        payment_link: transaction.redirect_url 
      })
      .eq('id', bookingId);

    // Send payment link via email if Resend is configured
    if (process.env.RESEND_API_KEY && booking.email) {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Dotlinetattu <onboarding@resend.dev>';

      await resend.emails.send({
        from: fromEmail,
        to: booking.email,
        subject: 'Dotlinetattu - Deposit Payment for Your Tattoo Session',
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #111111; color: #ffffff; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #333333;">
              <h1 style="margin: 0; font-size: 24px; font-weight: normal; letter-spacing: 2px; text-transform: uppercase;">Dotlinetattu</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #888888; letter-spacing: 1px;">Payment Request</p>
            </div>
            <p style="font-size: 16px; line-height: 1.5; color: #cccccc;">Hello ${booking.name},</p>
            <p style="font-size: 16px; line-height: 1.5; color: #cccccc;">Your tattoo design has been finalized. Please complete the deposit payment below to confirm your session.</p>
            <div style="background-color: #1a1a1a; border-radius: 6px; padding: 20px; margin-top: 30px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #888888; font-size: 14px; width: 35%;">Order ID</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #ffffff; font-size: 15px; font-weight: 500; font-family: monospace;">#DLT-${booking.id.substring(0, 8).toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #888888; font-size: 14px;">Total Price</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #ffffff; font-size: 15px;">IDR ${booking.price.toLocaleString('id-ID')}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #888888; font-size: 14px;">Deposit (50%)</td>
                  <td style="padding: 12px 0; color: #4CAF50; font-size: 15px; font-weight: bold;">IDR ${deposit.toLocaleString('id-ID')}</td>
                </tr>
              </table>
            </div>
            <div style="margin-top: 40px; text-align: center;">
              <a href="${transaction.redirect_url}" style="background-color: #ffffff; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; letter-spacing: 1px; display: inline-block;">
                PAY DEPOSIT NOW
              </a>
            </div>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333333; text-align: center;">
              <p style="font-size: 11px; color: #666666; letter-spacing: 0.5px; text-transform: uppercase;">
                Dotlinetattu Studio — Bali, Indonesia
              </p>
            </div>
          </div>
        `,
      });
    }

    revalidatePath('/admin');
    return { success: true, redirect_url: transaction.redirect_url };
  } catch (err: any) {
    console.error('Failed to create payment link:', err);
    return { error: err.message || 'Failed to create payment link' };
  }
}

export async function cancelAppointment(appointmentId: string) {
  // 1. Get the appointment to find its booking
  const { data: appointment, error: fetchError } = await supabaseAdmin
    .from('appointments')
    .select('*, bookings(stage)')
    .eq('id', appointmentId)
    .single();

  if (fetchError || !appointment) {
    return { error: fetchError?.message || 'Appointment not found' };
  }

  // 2. Cancel the appointment
  const { error } = await supabaseAdmin
    .from('appointments')
    .update({ status: 'CANCELLED' })
    .eq('id', appointmentId);

  if (error) {
    return { error: error.message };
  }

  // 3. Revert booking stage to previous stage
  const STAGE_REVERT: Record<string, string> = {
    DESIGN_IN_PROGRESS: 'CONSULTATION_BOOKED',
    SESSION_SCHEDULED: 'DEAL_CONFIRMED',
    IN_PROGRESS: 'SESSION_SCHEDULED',
  };

  const currentStage = (appointment as any).bookings?.stage;
  const previousStage = currentStage ? STAGE_REVERT[currentStage] : null;

  if (previousStage && appointment.booking_id) {
    await supabaseAdmin
      .from('bookings')
      .update({ stage: previousStage })
      .eq('id', appointment.booking_id);
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function completeAppointment(appointmentId: string) {
  const { error } = await supabaseAdmin
    .from('appointments')
    .update({ status: 'COMPLETED' })
    .eq('id', appointmentId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}
