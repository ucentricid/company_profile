"use server"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { id, status } = body

        if (!id || !status) {
            return NextResponse.json({ error: "ID and status are required" }, { status: 400 })
        }

        // Validate status enum
        if (!["APPROVED", "REJECTED", "PENDING", "DRAFT"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 })
        }

        const post = await db.portfolioPost.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error("[PUT] Failed to update portfolio status:", error)
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
    }
}
