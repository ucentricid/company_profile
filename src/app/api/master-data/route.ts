import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const roles = await db.internshipRole.findMany({
      where: { isActive: true },
      select: { 
        id: true, 
        title: true, 
        slug: true,
        department: true,
        type: true,
        location: true,
        requirements: true,
        responsibilities: true
      }
    })

    const universities = await db.university.findMany({
      select: { id: true, name: true }
    })

    const majors = await db.major.findMany({
      select: { id: true, name: true }
    })

    return NextResponse.json({
      roles,
      universities,
      majors
    })
  } catch (error) {
    console.error("Failed to fetch master data:", error)
    return NextResponse.json(
      { message: "Failed to fetch master data" },
      { status: 500 }
    )
  }
}
