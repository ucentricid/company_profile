"use server"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const testimonialSchema = z.object({
    clientName: z.string().min(1, "Client Name is required"),
    clientRole: z.string().min(1, "Client Role is required"),
    company: z.string().optional().nullable(),
    content: z.string().min(1, "Content is required"),
    image: z.string().optional().nullable(),
    rating: z.number().int().min(1).max(5).default(5),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true)
})

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const isActiveStr = searchParams.get("isActive")

        const where: any = {}
        if (isActiveStr === "true") where.isActive = true
        if (isActiveStr === "false") where.isActive = false

        const testimonials = await db.testimonial.findMany({
            where,
            orderBy: { order: "asc" }
        })

        return NextResponse.json(testimonials)
    } catch (error) {
        console.error("[GET] Failed to fetch testimonials:", error)
        return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validated = testimonialSchema.parse(body)

        const testimonial = await db.testimonial.create({
            data: validated
        })

        return NextResponse.json(testimonial, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
        }
        console.error("[POST] Failed to create testimonial:", error)
        return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { id, ...data } = body

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        const testimonial = await db.testimonial.update({
            where: { id },
            data
        })

        return NextResponse.json(testimonial)
    } catch (error) {
        console.error("[PUT] Failed to update testimonial:", error)
        return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        await db.testimonial.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[DELETE] Failed to delete testimonial:", error)
        return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
    }
}
