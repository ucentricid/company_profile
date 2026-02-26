"use server"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const roleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    department: z.string().min(1, "Department is required"),
    type: z.string().min(1, "Type is required"),
    location: z.string().min(1, "Location is required"),
    isActive: z.boolean().optional(),
    requirements: z.array(z.string()).default([]),
    responsibilities: z.array(z.string()).default([])
})

export async function GET() {
    try {
        const roles = await db.internshipRole.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { InternshipApplication: true }
                }
            }
        })
        const mappedRoles = roles.map((role: any) => ({
            ...role,
            _count: {
                applications: role._count?.InternshipApplication || 0
            }
        }))
        return NextResponse.json(mappedRoles)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 })
    }
}

// Helper to ensure unique slug
async function ensureUniqueSlug(baseSlug: string) {
    let slug = baseSlug
    let counter = 1

    while (true) {
        const existing = await db.internshipRole.findUnique({
            where: { slug }
        })

        if (!existing) return slug

        slug = `${baseSlug}-${counter}`
        counter++
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validated = roleSchema.parse(body)

        // Ensure unique slug
        const finalSlug = await ensureUniqueSlug(validated.slug)

        const role = await db.internshipRole.create({
            data: {
                ...validated,
                id: crypto.randomUUID(),
                slug: finalSlug, // Use the unique slug
                isActive: true,
                updatedAt: new Date()
            }
        })

        return NextResponse.json(role, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to create role" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { id, ...data } = body

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        const role = await db.internshipRole.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        })

        return NextResponse.json(role)
    } catch (error) {
        console.error("[PUT] Failed to update role:", error)
        return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        // Check if applications exist
        const role = await db.internshipRole.findUnique({
            where: { id },
            include: { _count: { select: { InternshipApplication: true } } }
        })

        if (role && role._count.InternshipApplication > 0) {
            // Soft delete or block
            return NextResponse.json({ error: "Cannot delete role with existing applications" }, { status: 400 })
        }

        await db.internshipRole.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[DELETE] Failed to delete role:", error)
        return NextResponse.json({ error: "Failed to delete role" }, { status: 500 })
    }
}
