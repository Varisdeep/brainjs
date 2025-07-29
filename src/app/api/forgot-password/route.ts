import { randomBytes } from "crypto";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// Configure SendGrid for email delivery
const sendgridApiKey = process.env.SENDGRID_API_KEY;
if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
}

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ email });

  // Always respond with success to prevent email enumeration
  if (!user) {
    return NextResponse.json({ success: true });
  }

  // Generate a secure random token
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

  await db.collection("password_resets").insertOne({
    userId: user._id,
    token,
    expires,
  });

      // Manual override - uncomment the line you want to use
      const baseUrl = "http://localhost:3000"; // For local testing
      // const baseUrl = "https://fullstack-nextjs-zeta-ochre.vercel.app"; // For production
  
  const resetUrl = `${baseUrl}/reset/${token}`;
  
  console.log("Generated token:", token.substring(0, 10) + "...");
  console.log("Reset URL:", resetUrl);
  
  // Send email with SendGrid using default sender (works immediately)
  console.log("Sending email to:", email);
  const startTime = Date.now();
  
  try {
    const msg = {
    to: email,
      from: {
        email: "sahilkhatriss01@gmail.com",
        name: "Stock Market App"
      },
      replyTo: "sahilkhatriss01@gmail.com",
      subject: "Password Reset - Stock Market App",
      text: `Hello,\n\nYou requested a password reset for your Stock Market App account.\n\nClick this link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this password reset, please ignore this email.\n\nBest regards,\nStock Market App Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Stock Market App</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; margin: 0; font-size: 24px;">Stock Market App</h1>
                <p style="color: #6b7280; margin: 10px 0 0 0;">Password Reset Request</p>
              </div>
              
              <p style="color: #374151; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
                Hello,
              </p>
              
              <p style="color: #374151; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
                You requested a password reset for your Stock Market App account. Please click the button below to reset your password.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #2563eb; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
                  Reset My Password
                </a>
              </div>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 25px 0;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  <strong>Important:</strong> This password reset link will expire in 1 hour for security reasons.
                </p>
              </div>
              
              <p style="color: #374151; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>
              
              <p style="color: #6b7280; font-size: 14px; word-break: break-all; background-color: #f9fafb; padding: 15px; border-radius: 4px; margin: 20px 0;">
                ${resetUrl}
              </p>
              
              <p style="color: #374151; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
                If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <div style="text-align: center; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0 0 10px 0;">
                  This is an automated security message from Stock Market App.
                </p>
                <p style="margin: 0;">
                  Please do not reply to this email. For support, contact our team.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      categories: ['password-reset', 'security']
    };
    
    await sgMail.send(msg);
    const endTime = Date.now();
    console.log(`Email sent instantly for: ${email}`);
    console.log(`Email delivery time: ${endTime - startTime}ms`);
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 