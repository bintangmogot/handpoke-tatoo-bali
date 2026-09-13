import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || 'onboarding@resend.dev'; // Fallback for testing

export async function sendPaymentSuccessEmail(booking: any) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Skipping email notification.');
    return;
  }

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #111111; color: #ffffff; border-radius: 8px;">
      
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #333333;">
        <h1 style="margin: 0; font-size: 24px; font-weight: normal; letter-spacing: 2px; text-transform: uppercase;">Dotlinetattu</h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #888888; letter-spacing: 1px;">Booking Confirmation</p>
      </div>

      <p style="font-size: 16px; line-height: 1.5; color: #cccccc;">Hello Jerry,</p>
      <p style="font-size: 16px; line-height: 1.5; color: #cccccc;">A new deposit payment has been successfully processed. The client's booking is now confirmed.</p>
      
      <div style="background-color: #1a1a1a; border-radius: 6px; padding: 20px; margin-top: 30px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #888888; font-size: 14px; width: 35%;">Client Name</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #ffffff; font-size: 15px; font-weight: 500;">${booking.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #888888; font-size: 14px;">WhatsApp</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #ffffff; font-size: 15px;">
              <a href="https://wa.me/${booking.whatsapp.replace(/\D/g, '')}" style="color: #ffffff; text-decoration: underline;" target="_blank">${booking.whatsapp}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #888888; font-size: 14px;">Date & Time</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #ffffff; font-size: 15px;">${booking.booking_date} @ ${booking.booking_time}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #888888; font-size: 14px;">Session Type</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #ffffff; font-size: 15px; text-transform: capitalize;">${booking.session_type}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #888888; font-size: 14px;">Placement</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #ffffff; font-size: 15px;">${booking.placement}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #888888; font-size: 14px;">Total Price</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #ffffff; font-size: 15px;">IDR ${booking.price.toLocaleString('id-ID')}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #888888; font-size: 14px;">Deposit Paid</td>
            <td style="padding: 12px 0; color: #4CAF50; font-size: 15px; font-weight: bold;">IDR ${booking.deposit ? booking.deposit.toLocaleString('id-ID') : '0'}</td>
          </tr>
        </table>
      </div>

      <div style="margin-top: 40px; text-align: center;">
        <a href="https://dotlinetattu.vercel.app/admin" style="background-color: #ffffff; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; letter-spacing: 1px; display: inline-block;">
          VIEW IN DASHBOARD
        </a>
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333333; text-align: center;">
        <p style="font-size: 11px; color: #666666; letter-spacing: 0.5px; text-transform: uppercase;">
          This is an automated message from Dotlinetattu Booking Engine.
        </p>
      </div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Dotlinetattu System <onboarding@resend.dev>',
      to: adminEmail,
      subject: "🚨 [Dotlinetattu] DP Lunas: " + booking.name + " (" + booking.booking_date + ")",
      html: htmlContent,
    });
    
    if (error) {
      console.error('Resend API Error:', error);
      return null;
    }
    
    console.log('Email sent successfully:', data);
    return data;
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}
