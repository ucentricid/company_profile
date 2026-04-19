"use server"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
    try {
        const posts = await db.portfolioPost.findMany({
            include: {
                User: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(posts)
    } catch (error) {
        console.error("[GET] Failed to fetch portfolio posts for admin:", error)
        return NextResponse.json({ error: "Failed to fetch portfolio posts" }, { status: 500 })
    }
}
