// Email service using Resend API
// This service sends booking confirmation emails to customers

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  bookingId: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalDays: number;
  roomCharges: number;
  serviceCharges: number;
  gst: number;
  grandTotal: number;
  services: string[];
}

export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  try {
    // Get Resend API key from environment variables
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    // Check if Resend is configured
    if (!resendApiKey) {
      console.log("📧 ====== RESEND EMAIL NOT CONFIGURED ======");
      console.log("📧 To enable email notifications:");
      console.log("");
      console.log("📧 Setup Instructions:");
      console.log("   1. Go to https://resend.com and sign up for a free account");
      console.log("   2. Get your API key from the dashboard");
      console.log("   3. In Supabase Dashboard → Edge Functions → Secrets, add:");
      console.log("      RESEND_API_KEY=re_xxxxxxxxxxxx");
      console.log("");
      console.log("✅ Booking saved successfully, but confirmation email was NOT sent");
      console.log("========================================");
      return false;
    }

    console.log("📧 Sending booking confirmation email via Resend...");
    console.log(`   To: ${data.customerEmail}`);
    console.log(`   Booking ID: ${data.bookingId}`);

    // Generate email content
    const emailHtml = generateBookingConfirmationHTML(data);
    const emailText = generateBookingConfirmationText(data);

    try {
      // Send email via Resend API
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "TAJ-E-NOOR Hotel <onboarding@resend.dev>", // Resend's test email
          to: [data.customerEmail],
          subject: `Booking Confirmation - ${data.bookingId}`,
          html: emailHtml,
          text: emailText,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("❌ Resend API Error:", result);
        console.log("📧 Troubleshooting:");
        console.log("   - Verify your RESEND_API_KEY is correct");
        console.log("   - Check if you've verified your domain (or use onboarding@resend.dev for testing)");
        console.log("   - Visit https://resend.com/docs for more information");
        return false;
      }

      console.log(`✅ Booking confirmation email sent successfully!`);
      console.log(`   To: ${data.customerEmail}`);
      console.log(`   Email ID: ${result.id}`);
      console.log(`   Booking: ${data.bookingId}`);
      return true;

    } catch (apiError: any) {
      console.error("❌ Resend API Error:", apiError.message);
      return false;
    }

  } catch (error: any) {
    console.error("❌ Exception in sendBookingConfirmationEmail:", error.message);
    return false;
  }
}

function generateBookingConfirmationText(data: BookingEmailData): string {
  const services = data.services.length > 0 
    ? `\nSelected Services: ${data.services.join(", ")}`
    : "";

  return `
BOOKING CONFIRMATION - TAJ-E-NOOR HOTEL

Dear ${data.customerName},

Thank you for your booking! Your reservation has been confirmed.

BOOKING REFERENCE: ${data.bookingId}

GUEST INFORMATION:
- Name: ${data.customerName}
- Email: ${data.customerEmail}

BOOKING DETAILS:
- Room Type: ${data.roomType}
- Check-in: ${data.checkInDate}
- Check-out: ${data.checkOutDate}
- Duration: ${data.totalDays} night(s)
- Guests: ${data.numberOfGuests}${services}

BILLING SUMMARY:
- Room Charges (${data.totalDays} nights): ₹${data.roomCharges.toLocaleString()}
- Additional Services: ₹${data.serviceCharges.toLocaleString()}
- GST (18%): ₹${data.gst.toLocaleString()}
- Grand Total: ₹${data.grandTotal.toLocaleString()}

IMPORTANT INFORMATION:
Please bring a valid ID proof at the time of check-in.
Check-in time: 2:00 PM
Check-out time: 11:00 AM

We look forward to welcoming you!

For any questions, contact us at:
Email: abhinavapoorva2007@gmail.com
Phone: +91 6299106880

---
TAJ-E-NOOR Hotel Management System
  `.trim();
}

function generateBookingConfirmationHTML(data: BookingEmailData): string {
  const servicesHtml = data.services.length > 0
    ? `
      <tr>
        <td style="padding: 15px 20px; border-bottom: 1px solid #eee;">
          <strong style="color: #666;">Selected Services:</strong><br/>
          <span style="color: #333;">${data.services.join(", ")}</span>
        </td>
      </tr>
    `
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - TAJ-E-NOOR</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F5F5DC;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5DC; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #8B0000 0%, #B22222 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #FFD700; font-size: 32px; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">TAJ-E-NOOR</h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 18px; font-weight: 600;">Booking Confirmed!</p>
                  <p style="margin: 5px 0 0 0; color: #FFD700; font-size: 14px;">Thank you for choosing our royal hospitality</p>
                </td>
              </tr>
              
              <!-- Booking ID -->
              <tr>
                <td style="padding: 30px; text-align: center; background-color: #F5F5DC;">
                  <p style="margin: 0; color: #8B0000; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Booking Reference</p>
                  <p style="margin: 8px 0 0 0; color: #8B0000; font-size: 24px; font-weight: 700;">${data.bookingId}</p>
                </td>
              </tr>
              
              <!-- Customer Details -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #8B0000; font-size: 20px; font-weight: 600; border-bottom: 2px solid #8B0000; padding-bottom: 10px;">Guest Information</h2>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 10px 0;">
                        <strong style="color: #666;">Guest Name:</strong><br/>
                        <span style="color: #333; font-size: 16px;">${data.customerName}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0;">
                        <strong style="color: #666;">Email:</strong><br/>
                        <span style="color: #333; font-size: 16px;">${data.customerEmail}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Booking Details -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #8B0000; font-size: 20px; font-weight: 600; border-bottom: 2px solid #8B0000; padding-bottom: 10px;">Booking Details</h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5DC; border-radius: 8px; overflow: hidden;">
                    <tr>
                      <td style="padding: 15px 20px; border-bottom: 1px solid #ddd;">
                        <strong style="color: #666;">Room Type:</strong><br/>
                        <span style="color: #8B0000; font-size: 16px; font-weight: 600;">${data.roomType}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 0; border-bottom: 1px solid #ddd;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="50%" style="padding-left: 20px;">
                              <strong style="color: #666;">Check-in:</strong><br/>
                              <span style="color: #333; font-size: 16px;">${data.checkInDate}</span>
                            </td>
                            <td width="50%" style="padding-right: 20px;">
                              <strong style="color: #666;">Check-out:</strong><br/>
                              <span style="color: #333; font-size: 16px;">${data.checkOutDate}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 0; border-bottom: 1px solid #ddd;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="50%" style="padding-left: 20px;">
                              <strong style="color: #666;">Duration:</strong><br/>
                              <span style="color: #333; font-size: 16px;">${data.totalDays} night(s)</span>
                            </td>
                            <td width="50%" style="padding-right: 20px;">
                              <strong style="color: #666;">Guests:</strong><br/>
                              <span style="color: #333; font-size: 16px;">${data.numberOfGuests} guest(s)</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    ${servicesHtml}
                  </table>
                </td>
              </tr>
              
              <!-- Billing Summary -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #8B0000; font-size: 20px; font-weight: 600; border-bottom: 2px solid #8B0000; padding-bottom: 10px;">Billing Summary</h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5DC; border-radius: 8px; padding: 20px;">
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #666;">Room Charges (${data.totalDays} nights)</span>
                      </td>
                      <td align="right" style="padding: 8px 0;">
                        <span style="color: #333; font-weight: 600;">₹${data.roomCharges.toLocaleString()}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #666;">Additional Services</span>
                      </td>
                      <td align="right" style="padding: 8px 0;">
                        <span style="color: #333; font-weight: 600;">₹${data.serviceCharges.toLocaleString()}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 2px solid #8B0000;">
                        <span style="color: #666;">GST (18%)</span>
                      </td>
                      <td align="right" style="padding: 8px 0; border-bottom: 2px solid #8B0000;">
                        <span style="color: #333; font-weight: 600;">₹${data.gst.toLocaleString()}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 0 0 0;">
                        <span style="color: #333; font-size: 18px; font-weight: 700;">Grand Total</span>
                      </td>
                      <td align="right" style="padding: 15px 0 0 0;">
                        <span style="color: #8B0000; font-size: 24px; font-weight: 700;">₹${data.grandTotal.toLocaleString()}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Important Information -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <div style="background-color: #FFF8DC; border-left: 4px solid #FFD700; padding: 15px; border-radius: 4px;">
                    <p style="margin: 0; color: #8B0000; font-size: 14px; line-height: 1.6;">
                      <strong>Important:</strong> Please bring a valid ID proof at the time of check-in. 
                      Check-in time is 2:00 PM and check-out time is 11:00 AM.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #F5F5DC; padding: 30px; text-align: center; border-top: 1px solid #ddd;">
                  <p style="margin: 0 0 10px 0; color: #8B0000; font-size: 16px; font-weight: 600;">We look forward to welcoming you!</p>
                  <p style="margin: 0; color: #666; font-size: 12px;">
                    If you have any questions, please contact us at abhinavapoorva2007@gmail.com or call +91 6299106880
                  </p>
                  <p style="margin: 15px 0 0 0; color: #999; font-size: 11px;">
                    © TAJ-E-NOOR Hotel Management System
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
