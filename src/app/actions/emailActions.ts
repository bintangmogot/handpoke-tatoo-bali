import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || 'onboarding@resend.dev'; // Fallback for testing

export async function sendPaymentSuccessEmail(booking: any) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Skipping email notification.');
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #4CAF50; text-align: center;">DP Lunas! Booking Baru Masuk 🎉</h2>
      <p>Halo Bang Jerry,</p>
      <p>Klien baru saja membayar DP melalui Midtrans. Berikut adalah detail booking-nya:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Nama Klien</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${booking.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">WhatsApp</td>
          <td style="padding: 10px; border: 1px solid #ddd;">
            <a href="https://wa.me/${booking.whatsapp.replace(/\D/g, '')}" target="_blank">${booking.whatsapp}</a>
          </td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Tanggal & Waktu</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${booking.booking_date} @ ${booking.booking_time}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Tipe Sesi</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-transform: capitalize;">${booking.session_type}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Posisi Badan</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${booking.placement}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Total Harga</td>
          <td style="padding: 10px; border: 1px solid #ddd;">IDR ${booking.price.toLocaleString('id-ID')}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">DP Dibayar</td>
          <td style="padding: 10px; border: 1px solid #ddd; color: #4CAF50; font-weight: bold;">IDR ${booking.deposit ? booking.deposit.toLocaleString('id-ID') : '0'}</td>
        </tr>
      </table>

      <div style="margin-top: 30px; text-align: center;">
        <a href="https://dotlinetattu.vercel.app/admin" style="background-color: #111; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          Buka Dashboard Admin
        </a>
      </div>
      
      <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
        Sistem Otomatis Dotlinetattu
      </p>
    </div>
  `;

  try {
    const data = await resend.emails.send({
      from: 'Dotlinetattu System <onboarding@resend.dev>',
      to: adminEmail,
      subject: "🚨 [PAID] Booking Baru: " + booking.name + " (" + booking.booking_date + ")",
      html: htmlContent,
    });
    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
