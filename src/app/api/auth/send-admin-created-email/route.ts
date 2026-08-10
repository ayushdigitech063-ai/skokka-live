import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { fullName, email, password, permissions } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Admin email and password are required." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER || "ayushdigitech49@gmail.com";
    const smtpPass = process.env.SMTP_PASS || "";

    // Configure Nodemailer Gmail Transport
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const appBaseUrl = process.env.CLIENT_URL || process.env.NEXT_PUBLIC_APP_URL || "https://skokka-website-frontend.vercel.app";
    const loginUrl = `${appBaseUrl}/admin?verify_login=true&email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Skokka Enterprise Security'}" <${smtpUser}>`,
      to: email,
      subject: "🔑 Your Skokka Admin Account Credentials & Activation",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; background-color: #050B1F; color: #ffffff; border-radius: 16px;">
          <h2 style="color: #d5639b; margin-bottom: 5px;">SKOKKA ADMIN CONTROL PANEL</h2>
          <p style="color: #94a3b8; font-size: 14px;">Super Admin Created Your Admin Account</p>
          <hr style="border-color: #1e293b; margin: 20px 0;" />
          <p>Hello <strong>${fullName || email.split("@")[0]}</strong>,</p>
          <p>Super Admin has granted you Admin Access to manage escort classified listings on Skokka India. Your login credentials are as follows:</p>
          
          <div style="background-color: #0B1437; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #1e293b;">
            <p style="margin: 5px 0; font-size: 14px;"><strong>Admin Email / User ID:</strong> <span style="color: #38bdf8;">${email}</span></p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Initial Login Password:</strong> <span style="color: #f43f5e; font-family: monospace; font-size: 16px; font-weight: bold;">${password}</span></p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Granted Permissions:</strong> <span style="color: #34d399;">${Array.isArray(permissions) ? permissions.join(", ") : "Classified Ads & Listings"}</span></p>
          </div>

          <p style="font-size: 13px; color: #cbd5e1;">Click the button below to verify your 12-digit Aadhaar Card & Selfie photo to open your Admin Dashboard:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="background: #d5639b; color: #ffffff; padding: 14px 28px; font-size: 15px; font-weight: bold; text-decoration: none; border-radius: 30px; display: inline-block;">
              🚀 VERIFY IDENTITY & OPEN DASHBOARD
            </a>
          </div>
          <p style="color: #64748b; font-size: 12px;">First-time login requires mandatory 12-digit Aadhaar Card & Human Selfie photo verification before accessing the dashboard.</p>
        </div>
      `,
    };

    let sentInfo = null;
    try {
      sentInfo = await transporter.sendMail(mailOptions);
      console.log("📧 Admin Credentials Email Dispatched via Nodemailer:", sentInfo.messageId);
    } catch (mailErr: any) {
      console.warn("⚠️ Nodemailer Warning:", mailErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Admin credentials email dispatched successfully.",
      email,
      loginUrl,
      messageId: sentInfo?.messageId || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to send admin credentials email." },
      { status: 500 }
    );
  }
}
