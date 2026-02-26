import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { hash } from "bcrypt"
import { z } from "zod"

// Schema for Creating User
const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin", "superadmin"]).default("user")
})

// Schema for Updating User
const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["user", "admin", "superadmin"]).optional()
})

const isAdmin = async () => {
  const session = await getServerSession(authOptions)
  return session?.user?.role === "admin" || session?.user?.role === "superadmin"
}

export async function GET(req: Request) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        emailVerified: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ data: users })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { name, email, password, role } = createUserSchema.parse(body)

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    const hashedPassword = await hash(password, 10)

    const newUser = await db.user.create({
      data: {
        id: crypto.randomUUID(),
        name,
        email,
        password: hashedPassword,
        role
      }
    })

    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      message: "User created successfully",
      data: userWithoutPassword
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation failed", errors: (error as any).errors }, { status: 400 })
    }
    console.error("Failed to create user:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { id, name, email, password, role } = updateUserSchema.parse(body)

    const updateData: any = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (role) updateData.role = role
    if (password) {
      updateData.password = await hash(password, 10)
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: updateData
    })

    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      message: "User updated successfully",
      data: userWithoutPassword
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation failed", errors: (error as any).errors }, { status: 400 })
    }
    console.error("Failed to update user:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    // Prevent deleting self (optional safety)
    const session = await getServerSession(authOptions)
    if (session?.user?.id === id) {
      return NextResponse.json({ message: "Cannot delete your own account" }, { status: 400 })
    }

    await db.user.delete({
      where: { id }
    })

    return NextResponse.json({ message: "User deleted successfully" })

  } catch (error) {
    console.error("Failed to delete user:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
