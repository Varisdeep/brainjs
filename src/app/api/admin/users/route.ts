import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { ObjectId } from "mongodb";

// Configure SendGrid for role update notifications
const sendgridApiKey = process.env.SENDGRID_API_KEY;
if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  type UserWithRole = { role?: string };
  if (!session || (session.user && (session.user as UserWithRole).role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const client = await clientPromise;
  const db = client.db("stockmarketDatabase");
  const users = await db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .toArray();
  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  type UserWithRole = { role?: string; name?: string; email?: string; id?: string };
  if (!session || (session.user && (session.user as UserWithRole).role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { userId, newRole } = await request.json();
  if (!userId || !["user", "admin"].includes(newRole)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  
  // Prevent admin from updating their own role
  const currentUserId = (session.user as UserWithRole).id;
  if (currentUserId === userId) {
    return NextResponse.json({ error: "Admins cannot update their own role" }, { status: 400 });
  }
  
  const client = await clientPromise;
  const db = client.db("stockmarketDatabase");
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: newRole } }
  );
  if (result.modifiedCount === 1) {
    // Send email notification using SendGrid
    try {
      const emailContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Role Update Notification</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .email-wrapper { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #ffffff; 
              border-radius: 15px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
              overflow: hidden;
              border: 2px solid #e1e5e9;
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center;
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
              opacity: 0.3;
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: 700;
              position: relative;
              z-index: 1;
            }
            .header-subtitle {
              margin: 10px 0 0 0;
              font-size: 16px;
              opacity: 0.9;
              position: relative;
              z-index: 1;
            }
            .content { 
              padding: 50px 40px; 
              background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
            }
            .greeting { 
              color: #333; 
              font-size: 20px; 
              margin-bottom: 25px;
              font-weight: 600;
            }
            .message { 
              color: #555; 
              line-height: 1.7; 
              margin-bottom: 30px;
              font-size: 16px;
            }
            .role-box { 
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              border: 2px solid #667eea;
              border-radius: 12px;
              padding: 25px; 
              margin: 30px 0;
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
              position: relative;
              overflow: hidden;
            }
            .role-box::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 100%;
              background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
            }
            .role-label { 
              color: #333; 
              font-weight: 600; 
              margin-bottom: 8px;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .role-value { 
              color: #667eea; 
              font-weight: bold; 
              text-transform: capitalize; 
              font-size: 24px;
              margin-top: 5px;
            }
            .info-box { 
              background: linear-gradient(135deg, #e8f4fd 0%, #d1ecf1 100%);
              border: 1px solid #bee5eb; 
              border-radius: 12px; 
              padding: 25px; 
              margin: 30px 0;
              box-shadow: 0 4px 15px rgba(190, 229, 235, 0.2);
            }
            .info-text { 
              color: #0c5460; 
              font-size: 15px; 
              line-height: 1.6; 
              margin: 0;
              font-weight: 500;
            }
            .footer { 
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              padding: 30px 40px; 
              text-align: center; 
              border-top: 2px solid #e1e5e9;
              position: relative;
            }
            .footer::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 2px;
              background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
            }
            .footer-text { 
              color: #666; 
              font-size: 14px; 
              margin: 0;
              line-height: 1.5;
            }
            .logo { 
              font-size: 22px; 
              font-weight: bold; 
              color: #667eea; 
              margin-bottom: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            @media only screen and (max-width: 600px) {
              body { padding: 10px; }
              .email-wrapper { width: 100% !important; }
              .content { padding: 30px 20px !important; }
              .header { padding: 30px 20px !important; }
              .footer { padding: 25px 20px !important; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <h1>Account Role Update</h1>
              <p class="header-subtitle">Your account has been updated</p>
            </div>
            <div class="content">
              <div class="greeting">Hello ${(user as UserWithRole).name || (user as UserWithRole).email}!</div>
              
              <div class="message">
                Your account role has been updated by an administrator. This change is effective immediately and will be reflected in your dashboard.
              </div>
              
              <div class="role-box">
                <div class="role-label">Your New Role</div>
                <div class="role-value">${newRole}</div>
              </div>
              
              <div class="message">
                You may need to log out and log back in to see the changes reflected in your dashboard. This ensures all permissions are properly updated.
              </div>
              
              <div class="info-box">
                <p class="info-text">
                  <strong>Need Help?</strong> If you have any questions about this role change, please contact the system administrator. We're here to help!
                </p>
              </div>
            </div>
            <div class="footer">
              <div class="logo">Stock Market App</div>
              <p class="footer-text">This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      const textContent = `Hello ${(user as UserWithRole).name || (user as UserWithRole).email}!\n\nYour account role has been updated by an administrator to: ${newRole}\n\nThis change is effective immediately. You may need to log out and log back in to see the changes reflected in your dashboard.\n\nIf you have any questions, please contact the system administrator.\n\nBest regards,\nStock Market App Team`;
      
      await sgMail.send({
        to: (user as UserWithRole).email,
        from: {
          email: "sahilkhatriss01@gmail.com",
          name: "Stock Market App"
        },
        replyTo: "sahilkhatriss01@gmail.com",
        subject: "Account Role Updated - Stock Market App",
        html: emailContent,
        text: textContent,
        categories: ['account-update', 'role-change']
      });
      
      console.log(`Role update email sent to: ${(user as UserWithRole).email}`);
    } catch (error) {
      console.error("Email sending failed:", error);
      // Don't fail the role update if email fails
    }
    
    return NextResponse.json({ success: true, message: "Role updated and email sent" });
  }
  return NextResponse.json({ error: "User not found or role unchanged" }, { status: 404 });
} 