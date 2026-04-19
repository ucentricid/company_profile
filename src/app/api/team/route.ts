"use server"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const teamMemberSchema = z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    image: z.string().optional().nullable(),
    linkedinUrl: z.string().optional().nullable(),
    twitterUrl: z.string().optional().nullable(),
    githubUrl: z.string().optional().nullable(),
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

        const team = await db.teamMember.findMany({
            where,
            orderBy: { order: "asc" }
        })

        return NextResponse.json(team)
    } catch (error) {
        console.error("[GET] Failed to fetch team members:", error)
        return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validated = teamMemberSchema.parse(body)

        const member = await db.teamMember.create({
            data: validated
        })

        return NextResponse.json(member, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
        }
        console.error("[POST] Failed to create team member:", error)
        return NextResponse.json({ error: "Failed to create team member" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { id, ...data } = body

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        const member = await db.teamMember.update({
            where: { id },
            data
        })

        return NextResponse.json(member)
    } catch (error) {
        console.error("[PUT] Failed to update team member:", error)
        return NextResponse.json({ error: "Failed to update team member" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        await db.teamMember.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[DELETE] Failed to delete team member:", error)
        return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 })
    }
}
