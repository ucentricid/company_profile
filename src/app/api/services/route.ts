"use server"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const serviceSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    iconName: z.string().min(1, "Icon name is required"),
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

        const services = await db.service.findMany({
            where,
            orderBy: { order: "asc" }
        })

        return NextResponse.json(services)
    } catch (error) {
        console.error("[GET] Failed to fetch services:", error)
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validated = serviceSchema.parse(body)

        const service = await db.service.create({
            data: validated
        })

        return NextResponse.json(service, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
        }
        console.error("[POST] Failed to create service:", error)
        return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { id, ...data } = body

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        const service = await db.service.update({
            where: { id },
            data
        })

        return NextResponse.json(service)
    } catch (error) {
        console.error("[PUT] Failed to update service:", error)
        return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        await db.service.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[DELETE] Failed to delete service:", error)
        return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
    }
}
