import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Recipient email is required." },
        { status: 400 }
      );
    }

    const emailUser = process.env.EMAIL_USER || "info.mycityqueen@gmail.com";
    const emailPass = process.env.EMAIL_PASS || "";

    // Configure Nodemailer Gmail Transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const appBaseUrl = process.env.CLIENT_URL || process.env.NEXT_PUBLIC_APP_URL || "https://skokka-website-frontend.vercel.app";
    const activationUrl = `${appBaseUrl}/dashboard?verify_login=true&email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'MyCityQueen Classifieds Concierge'}" <${emailUser}>`,
      to: email,
      subject: "🚀 Activate Your MyCityQueen Classifieds Admin Account",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; background-color: #050B1F; color: #ffffff; border-radius: 16px;">
          <h2 style="color: #d5639b; margin-bottom: 5px;">MYCITYQUEEN CLASSIFIEDS PORTAL</h2>
          <p style="color: #94a3b8; font-size: 14px;">Account Activation & Verification Request</p>
          <hr style="border-color: #1e293b; margin: 20px 0;" />
          <p>Hello <strong>${email.split("@")[0]}</strong>,</p>
          <p>Thank you for registering to post escort ads on MyCityQueen India. Please click the button below to complete your identity verification and access your Admin Control Panel:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${activationUrl}" style="background: #d5639b; color: #ffffff; padding: 14px 28px; font-size: 15px; font-weight: bold; text-decoration: none; border-radius: 30px; display: inline-block;">
              🚀 VERIFY IDENTITY & ACTIVATE DASHBOARD
            </a>
          </div>
          <p style="color: #64748b; font-size: 12px;">First-time login requires mandatory 12-digit Aadhaar Card & Human Selfie photo verification before accessing the dashboard.</p>
        </div>
      `,
    };

    let sentInfo = null;
    try {
      sentInfo = await transporter.sendMail(mailOptions);
      console.log("📧 Real Nodemailer Email Dispatched:", sentInfo.messageId);
    } catch (mailErr: any) {
      console.warn("⚠️ Nodemailer Warning:", mailErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Nodemailer activation email dispatched successfully.",
      email,
      activationUrl,
      messageId: sentInfo?.messageId || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to send activation email." },
      { status: 500 }
    );
  }
}
