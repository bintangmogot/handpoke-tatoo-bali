'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import midtransClient from 'midtrans-client';
import { Resend } from 'resend';
import { WEEK_DAYS, timeToMinutes, type WeeklyHours } from '@/lib/studio-hours';

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

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

export async function updateWeeklyHoursAction(hours: WeeklyHours) {
  for (const { key, label } of WEEK_DAYS) {
    const day = hours[key];
    if (!day || typeof day.open !== 'boolean') return { error: `${label} has invalid hours.` };
    if (day.open && (!/^\d{2}:\d{2}$/.test(day.start) || !/^\d{2}:\d{2}$/.test(day.end))) {
      return { error: `Choose valid opening and closing times for ${label}.` };
    }
    if (day.open && timeToMinutes(day.start) >= timeToMinutes(day.end)) {
      return { error: `${label}'s closing time must be after its opening time.` };
    }
  }

  const { error } = await supabaseAdmin
    .from('studio_settings')
    .upsert({ key: 'open_hours', value: hours }, { onConflict: 'key' });

  if (error) return { error: error.message };
  revalidatePath('/admin');
  revalidatePath('/booking');
  return { success: true };
}

type AppointmentInput = {
  type: 'consultation' | 'design_review' | 'tattoo_session';
  date: string;
  time: string;
  duration_hours: number;
  notes?: string;
};

async function appointmentConflict(input: AppointmentInput, excludeId?: string) {
  let query = supabaseAdmin
    .from('appointments')
    .select('id, time, duration_hours')
    .eq('date', input.date)
    .eq('status', 'SCHEDULED');

  if (excludeId) query = query.neq('id', excludeId);

  const [{ data: appointments, error }, { data: blocks }] = await Promise.all([
    query,
    supabaseAdmin
      .from('blocked_dates')
      .select('start_time, end_time')
      .eq('date', input.date),
  ]);

  if (error) return 'Could not check calendar availability.';

  const start = timeToMinutes(input.time);
  const end = start + (Number(input.duration_hours) * 60);
  const overlaps = (itemStart: number, itemEnd: number) => start < itemEnd && end > itemStart;

  if ((appointments || []).some((appointment) => {
    const appointmentStart = timeToMinutes(appointment.time);
    return overlaps(appointmentStart, appointmentStart + (Number(appointment.duration_hours || 1) * 60));
  })) {
    return 'That time overlaps another appointment.';
  }

  if ((blocks || []).some((block) => {
    if (!block.start_time || !block.end_time) return true;
    return overlaps(timeToMinutes(block.start_time), timeToMinutes(block.end_time));
  })) {
    return 'That time is blocked in studio availability.';
  }

  return null;
}

function validateAppointment(input: AppointmentInput) {
  if (!input.date || !input.time) return 'Date and time are required.';
  if (!Number.isFinite(Number(input.duration_hours)) || Number(input.duration_hours) <= 0) {
    return 'Choose a valid appointment duration.';
  }
  return null;
}

export async function addAppointment(bookingId: string, input: AppointmentInput) {
  const validationError = validateAppointment(input);
  if (validationError) return { error: validationError };

  const conflict = await appointmentConflict(input);
  if (conflict) return { error: conflict };

  const { error } = await supabaseAdmin.from('appointments').insert([{
    booking_id: bookingId,
    type: input.type,
    date: input.date,
    time: input.time,
    duration_hours: Number(input.duration_hours),
    status: 'SCHEDULED',
    notes: input.notes?.trim() || null,
  }]);

  if (error) return { error: error.message };
  revalidatePath('/admin');
  return { success: true };
}

export async function rescheduleAppointment(appointmentId: string, input: AppointmentInput) {
  const validationError = validateAppointment(input);
  if (validationError) return { error: validationError };

  const conflict = await appointmentConflict(input, appointmentId);
  if (conflict) return { error: conflict };

  const { error } = await supabaseAdmin
    .from('appointments')
    .update({
      type: input.type,
      date: input.date,
      time: input.time,
      duration_hours: Number(input.duration_hours),
      notes: input.notes?.trim() || null,
    })
    .eq('id', appointmentId);

  if (error) return { error: error.message };
  revalidatePath('/admin');
  return { success: true };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] || character);
}

export async function createPaymentRequest(
  bookingId: string,
  input: { description: string; amount: number; sendEmail?: boolean }
) {
  const amount = Math.round(Number(input.amount));
  const description = input.description?.trim();
  if (!description) return { error: 'Payment description is required.' };
  if (!Number.isFinite(amount) || amount < 1000) return { error: 'Enter an amount of at least IDR 1,000.' };

  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (error || !booking) {
    return { error: 'Booking not found' };
  }

  try {
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const orderId = `${bookingId}-${Date.now().toString(36)}`;
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: booking.name,
        email: booking.email || 'no-email@example.com',
        phone: booking.whatsapp,
      },
      item_details: [{
        id: 'DLT-PAYMENT',
        price: amount,
        quantity: 1,
        name: description.substring(0, 50),
      }],
    };

    const transaction = await snap.createTransaction(parameter);

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert([{
        booking_id: bookingId,
        description,
        amount,
        status: 'PENDING',
        source: 'ADMIN_REQUEST',
        midtrans_order_id: orderId,
        payment_link: transaction.redirect_url,
      }])
      .select()
      .single();

    if (paymentError) {
      return { error: `Payment link was created, but could not be saved: ${paymentError.message}` };
    }

    let emailSent = false;
    let emailError: string | undefined;
    if (input.sendEmail && !process.env.RESEND_API_KEY) emailError = 'Email could not be sent because RESEND_API_KEY is not configured.';
    if (input.sendEmail && !booking.email) emailError = 'Email could not be sent because this client has no email address.';
    if (input.sendEmail && process.env.RESEND_API_KEY && booking.email) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Dotlinetattu <onboarding@resend.dev>';

        const emailResult = await resend.emails.send({
          from: fromEmail,
          to: booking.email,
          subject: `Dotlinetattu - ${description}`,
          html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #111111; color: #ffffff; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #333333;">
              <h1 style="margin: 0; font-size: 24px; font-weight: normal; letter-spacing: 2px; text-transform: uppercase;">Dotlinetattu</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #888888; letter-spacing: 1px;">Payment Request</p>
            </div>
            <p style="font-size: 16px; line-height: 1.5; color: #cccccc;">Hello ${escapeHtml(booking.name)},</p>
            <p style="font-size: 16px; line-height: 1.5; color: #cccccc;">Jerry has sent you a payment request for <strong style="color:#ffffff">${escapeHtml(description)}</strong>.</p>
            <div style="background-color: #1a1a1a; border-radius: 6px; padding: 20px; margin-top: 30px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #888888; font-size: 14px; width: 35%;">Order ID</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #ffffff; font-size: 15px; font-weight: 500; font-family: monospace;">#DLT-${payment.id.substring(0, 8).toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #888888; font-size: 14px;">Amount</td>
                  <td style="padding: 12px 0; color: #d67b55; font-size: 15px; font-weight: bold;">IDR ${amount.toLocaleString('id-ID')}</td>
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
        emailSent = !emailResult.error;
        if (emailResult.error) emailError = emailResult.error.message || 'Resend rejected the email.';
      } catch (emailException) {
        console.error('Payment link email failed:', emailException);
        emailError = emailException instanceof Error ? emailException.message : 'Email delivery failed.';
      }
    }

    revalidatePath('/admin');
    return { success: true, payment, redirect_url: transaction.redirect_url, emailSent, emailError };
  } catch (err: unknown) {
    console.error('Failed to create payment link:', err);
    return { error: errorMessage(err, 'Failed to create payment link') };
  }
}

export async function refreshPaymentStatus(paymentId: string) {
  const { data: payment, error } = await supabaseAdmin
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();
  if (error || !payment) return { error: 'Payment record not found.' };
  if (!payment.midtrans_order_id) return { error: 'This payment has no Midtrans order ID.' };

  try {
    const core = new midtransClient.CoreApi({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });
    const status = await core.transaction.status(payment.midtrans_order_id);
    const transactionStatus = String(status.transaction_status || 'pending');
    const fraudStatus = String(status.fraud_status || '');
    const nextStatus = transactionStatus === 'settlement' || (transactionStatus === 'capture' && fraudStatus !== 'challenge')
      ? 'PAID'
      : transactionStatus === 'expire'
        ? 'EXPIRED'
        : transactionStatus === 'cancel'
          ? 'CANCELLED'
          : transactionStatus === 'deny'
            ? 'FAILED'
            : 'PENDING';
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({ status: nextStatus, paid_at: nextStatus === 'PAID' ? new Date().toISOString() : null, updated_at: new Date().toISOString() })
      .eq('id', paymentId);
    if (updateError) return { error: updateError.message };
    revalidatePath('/admin');
    return { success: true, status: nextStatus };
  } catch (exception) {
    console.error('Failed to refresh Midtrans payment status:', exception);
    const message = exception instanceof Error ? exception.message : '';
    if (message.includes('404') || message.toLowerCase().includes("transaction doesn't exist")) {
      return { error: 'Midtrans could not find this transaction. It may be an old test link or belong to a different sandbox/production account. Create a new payment link.' };
    }
    return { error: 'Could not check Midtrans status. Please verify the payment environment and try again.' };
  }
}

export async function resendPaymentEmail(paymentId: string) {
  if (!process.env.RESEND_API_KEY) return { error: 'RESEND_API_KEY is not configured.' };
  const { data: payment, error: paymentError } = await supabaseAdmin.from('payments').select('*').eq('id', paymentId).single();
  if (paymentError || !payment) return { error: 'Payment record not found.' };
  const { data: booking, error: bookingError } = await supabaseAdmin.from('bookings').select('*').eq('id', payment.booking_id).single();
  if (bookingError || !booking?.email) return { error: 'This client has no email address.' };

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Dotlinetattu <onboarding@resend.dev>';
    const result = await resend.emails.send({
      from: fromEmail,
      to: booking.email,
      subject: `Dotlinetattu - ${payment.description}`,
      html: `<p>Hello ${escapeHtml(booking.name)},</p><p>Here is your payment link for <strong>${escapeHtml(payment.description)}</strong>.</p><p><a href="${payment.payment_link}">Open secure payment checkout</a></p><p>Amount: IDR ${Number(payment.amount).toLocaleString('id-ID')}</p>`,
      text: `Hello ${booking.name}. Payment: ${payment.description}. Amount: IDR ${Number(payment.amount).toLocaleString('id-ID')}. Open the secure checkout: ${payment.payment_link}`,
    });
    if (result.error) return { error: result.error.message || 'Resend rejected the email.' };
    return { success: true };
  } catch (exception) {
    console.error('Payment email resend failed:', exception);
    return { error: exception instanceof Error ? exception.message : 'Email delivery failed.' };
  }
}

export async function cancelAppointment(appointmentId: string) {
  const { error } = await supabaseAdmin
    .from('appointments')
    .update({ status: 'CANCELLED' })
    .eq('id', appointmentId);

  if (error) {
    return { error: error.message };
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

export async function setClientStatus(
  bookingId: string,
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
) {
  const legacyStage = status === 'COMPLETED'
    ? 'COMPLETED'
    : status === 'CANCELLED'
      ? 'CANCELLED'
      : undefined;

  const update: Record<string, string> = { admin_status: status };
  if (legacyStage) update.stage = legacyStage;

  const { error } = await supabaseAdmin
    .from('bookings')
    .update(update)
    .eq('id', bookingId);

  if (error) return { error: error.message };
  revalidatePath('/admin');
  return { success: true };
}
