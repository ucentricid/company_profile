import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  universityName: z.string().min(1, "University is required"),
  majorName: z.string().min(1, "Major is required"),
  semester: z.string().min(1, "Semester is required"),
  roleId: z.string().min(1, "Role is required"),
  motivation: z.string().min(1, "Motivation is required"),
  portfolioUrl: z.string().optional().or(z.literal("")),
  cvUrl: z.string().optional().or(z.literal("")),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      firstName, 
      lastName, 
      email, 
      universityName, 
      majorName, 
      semester, 
      roleId, 
      motivation, 
      portfolioUrl, 
      cvUrl 
    } = applicationSchema.parse(body)

    // Check for existing application for this role
    const existingApplication = await db.internshipApplication.findFirst({
        where: {
            email,
            roleId
        }
    })

    if (existingApplication) {
        return NextResponse.json(
            { message: "This email has already applied for this role." },
            { status: 409 } // Conflict
        )
    }

    const application = await db.internshipApplication.create({
      data: {
        firstName,
        lastName,
        email,
        semester,
        motivation,
        portfolioUrl: portfolioUrl || null,
        cvUrl: cvUrl || null,
        role: {
          connect: { id: roleId }
        },
        university: {
          connectOrCreate: {
            where: { name: universityName },
            create: { name: universityName }
          }
        },
        major: {
          connectOrCreate: {
            where: { name: majorName },
            create: { name: majorName }
          }
        },
        status: "PENDING"
      }
    })

    return NextResponse.json(
      { message: "Application submitted successfully", applicationId: application.id },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: (error as any).errors },
        { status: 400 }
      )
    }

    console.error("Failed to submit application:", error)
    return NextResponse.json(
      { message: "Failed to submit application" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const search = searchParams.get("search") || ""
        const status = searchParams.get("status") || ""
        const includeStats = searchParams.get("includeStats") === "true"
        const skip = (page - 1) * limit

        // Build Where Clause
        const where: any = {}
        
        if (status && status !== "ALL") {
            where.status = status
        }

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Parallel Fetch
        const queries: any[] = [
            db.internshipApplication.findMany({
                where,
                include: {
                    role: true,
                    university: true,
                    major: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            db.internshipApplication.count({ where })
        ]

        if (includeStats) {
            queries.push(
                db.internshipApplication.groupBy({
                    by: ['status'],
                    _count: {
                        status: true
                    }
                })
            )
        }

        const results = await Promise.all(queries)
        const applications = results[0]
        const total = results[1]
        const statusGroups = includeStats ? results[2] : []

        // Transform Stats
        let stats = null
        if (includeStats) {
            const statsMap = (statusGroups as any[]).reduce((acc, curr) => {
                acc[curr.status] = curr._count.status
                return acc
            }, {} as Record<string, number>)
            
            stats = {
                PENDING: statsMap["PENDING"] || 0,
                REVIEWING: statsMap["REVIEWING"] || 0,
                ACCEPTED: statsMap["ACCEPTED"] || 0,
                REJECTED: statsMap["REJECTED"] || 0,
                TOTAL: total
            }
        }

        return NextResponse.json({
            data: applications,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            ...(stats && { stats })
        })
    } catch (error) {
        console.error("Failed to fetch applications:", error)
        return NextResponse.json(
            { message: "Failed to fetch applications" },
            { status: 500 }
        )
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { id, status } = body

        if (!id || !status) {
            return NextResponse.json(
                { message: "ID and Status are required" },
                { status: 400 }
            )
        }

        const updatedApplication = await db.internshipApplication.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json(updatedApplication)
    } catch (error) {
        console.error("Failed to update application:", error)
        return NextResponse.json(
            { message: "Failed to update application" },
            { status: 500 }
        )
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { message: "ID is required" },
                { status: 400 }
            )
        }

        await db.internshipApplication.delete({
            where: { id }
        })

        return NextResponse.json({ message: "Application deleted successfully" })
    } catch (error) {
        console.error("Failed to delete application:", error)
        return NextResponse.json(
            { message: "Failed to delete application" },
            { status: 500 }
        )
    }
}
