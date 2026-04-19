"use server"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const projectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    client: z.string().min(1, "Client is required"),
    category: z.string().min(1, "Category is required"),
    tags: z.array(z.string()).default([]),
    description: z.string().min(1, "Description is required"),
    stats: z.string().min(1, "Stats is required"),
    image: z.string().nullable().optional(),
    projectUrl: z.string().nullable().optional(),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true)
})

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const isFeaturedStr = searchParams.get("isFeatured")
        const isActiveStr = searchParams.get("isActive")

        const where: any = {}
        if (isActiveStr === "true") where.isActive = true
        if (isActiveStr === "false") where.isActive = false
        if (isFeaturedStr === "true") where.isFeatured = true
        if (isFeaturedStr === "false") where.isFeatured = false

        const projects = await db.companyProject.findMany({
            where,
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(projects)
    } catch (error) {
        console.error("[GET] Failed to fetch company projects:", error)
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validated = projectSchema.parse(body)

        const project = await db.companyProject.create({
            data: validated
        })

        return NextResponse.json(project, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
        }
        console.error("[POST] Failed to create company project:", error)
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { id, ...data } = body

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        const project = await db.companyProject.update({
            where: { id },
            data
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error("[PUT] Failed to update company project:", error)
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        await db.companyProject.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[DELETE] Failed to delete company project:", error)
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
    }
}
