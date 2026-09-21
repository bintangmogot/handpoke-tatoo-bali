import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || 'onboarding@resend.dev'; // Fallback for testing
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Dotlinetattu <onboarding@resend.dev>';

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

  const textContent = `Deposit paid for ${booking.name}. Date: ${booking.booking_date} at ${booking.booking_time}. WhatsApp: ${booking.whatsapp}. Total: IDR ${Number(booking.price || 0).toLocaleString('id-ID')}. Deposit: IDR ${Number(booking.deposit || 0).toLocaleString('id-ID')}.`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: "[Dotlinetattu] Deposit Paid: " + booking.name + " (" + booking.booking_date + ")",
      html: htmlContent,
      text: textContent,
    });
    
    if (error) {
      console.error('Resend API Error (Admin Email):', error);
      return null;
    }
    
    console.log('Admin Email sent successfully:', data);
    return data;
  } catch (err) {
    console.error('Failed to send admin email:', err);
  }
}

export async function sendCustomerReceiptEmail(booking: any) {
  if (!process.env.RESEND_API_KEY || !booking.email) {
    return;
  }

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #111111; color: #ffffff; border-radius: 8px;">
      
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #333333;">
        <h1 style="margin: 0; font-size: 24px; font-weight: normal; letter-spacing: 2px; text-transform: uppercase;">Dotlinetattu</h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #888888; letter-spacing: 1px;">Booking Receipt</p>
      </div>

      <p style="font-size: 16px; line-height: 1.5; color: #cccccc;">Hello ${booking.name},</p>
      <p style="font-size: 16px; line-height: 1.5; color: #cccccc;">Thank you for choosing Dotlinetattu. We have successfully received your deposit payment. Your session is now confirmed.</p>
      
      <div style="background-color: #1a1a1a; border-radius: 6px; padding: 20px; margin-top: 30px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #888888; font-size: 14px; width: 35%;">Order ID</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #ffffff; font-size: 15px; font-weight: 500; font-family: monospace;">#DLT-${booking.id.substring(0, 8).toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #888888; font-size: 14px;">Date & Time</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #333333; color: #ffffff; font-size: 15px; font-weight: 500;">${booking.booking_date} @ ${booking.booking_time}</td>
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
      
      <p style="font-size: 15px; line-height: 1.6; color: #aaaaaa; margin-top: 30px;">
        If you haven't already, please reach out to Silver Jerry on WhatsApp to confirm your design details prior to your session.
      </p>

      <div style="margin-top: 40px; text-align: center;">
        <a href="https://wa.me/6282339760624" style="background-color: #ffffff; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; letter-spacing: 1px; display: inline-block;">
          CONTACT VIA WHATSAPP
        </a>
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333333; text-align: center;">
        <p style="font-size: 11px; color: #666666; letter-spacing: 0.5px; text-transform: uppercase;">
          Dotlinetattu Studio • Bali, Indonesia
        </p>
      </div>
    </div>
  `;

  const textContent = `Your Dotlinetattu deposit was received. Booking date: ${booking.booking_date} at ${booking.booking_time}. Session: ${booking.session_type}. Placement: ${booking.placement}. Deposit paid: IDR ${Number(booking.deposit || 0).toLocaleString('id-ID')}.`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: booking.email,
      subject: "Dotlinetattu - Booking Confirmed",
      html: htmlContent,
      text: textContent,
    });
    
    if (error) {
      console.error('Resend API Error (Customer Email):', error);
      return null;
    }
    
    console.log('Customer Email sent successfully:', data);
    return data;
  } catch (err) {
    console.error('Failed to send customer email:', err);
  }
}
