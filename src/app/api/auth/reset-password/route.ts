import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hash } from "bcrypt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Find the reset token
    const resetToken = await db.verificationToken.findFirst({
      where: {
        token,
        identifier: {
          startsWith: "password-reset-",
        },
      },
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (resetToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      )
    }

    // Extract user ID from identifier
    const userId = resetToken.identifier.replace("password-reset-", "")

    // Hash new password
    const hashedPassword = await hash(password, 12)

    // Update user password
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    // Delete the used token
    await db.verificationToken.delete({
      where: {
        token: resetToken.token,
      },
    })

    return NextResponse.json({ 
      message: "Password has been reset successfully" 
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
