import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hash } from "bcrypt"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
    })

    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      return NextResponse.json({ 
        message: "If an account exists with this email, a reset link has been sent." 
      })
    }

    // Hash default password
    const defaultPassword = "Passw0rdDefault"
    const hashedPassword = await hash(defaultPassword, 12)

    // Update user password to default
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    // Create reset link for login
    const loginLink = `${process.env.NEXTAUTH_URL}/login`

    // Send email
    // Note: Configure your email provider in production
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@ucentric.com",
      to: email,
      subject: "Your Password Has Been Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Successful</h2>
          <p style="color: #666; line-height: 1.6;">
            Hi ${user.name || "there"},
          </p>
          <p style="color: #666; line-height: 1.6;">
            Your password has been reset to the default password. Please use the credentials below to login:
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> <code style="background-color: #fff; padding: 5px 10px; border-radius: 3px;">Passw0rdDefault</code></p>
          </div>
          <div style="margin: 30px 0;">
            <a href="${loginLink}" 
               style="background-color: #0070f3; 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;">
              Login Now
            </a>
          </div>
          <p style="color: #ff6b6b; line-height: 1.6; font-weight: bold;">
            ⚠️ Important: Please change your password immediately after logging in for security reasons.
          </p>
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If you didn't request this password reset, please contact our support team immediately.
          </p>
        </div>
      `,
    }

    // Only send email if SMTP is configured
    if (process.env.SMTP_HOST) {
      await transporter.sendMail(mailOptions)
      console.log("Reset email sent to:", email)
    } else {
      // Development mode: log the credentials
      console.log("=== PASSWORD RESET (Development Mode) ===")
      console.log("Email:", email)
      console.log("New Password: Passw0rdDefault")
      console.log("Login URL:", loginLink)
      console.log("==========================================")
    }

    return NextResponse.json({ 
      message: "If an account exists with this email, a reset link has been sent." 
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
