"use server"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const settings = await db.siteSetting.findMany()
        
        // Convert array of {key, value} to a single object {key: value} for easier frontend use
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value
            return acc
        }, {} as Record<string, string>)

        return NextResponse.json(settingsMap)
    } catch (error) {
        console.error("[GET] Failed to fetch settings:", error)
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { settings } = body // Expecting { targetKey1: "value1", targetKey2: "value2" }

        if (!settings || typeof settings !== 'object') {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
        }

        // Upsert all settings sequentially
        for (const [key, value] of Object.entries(settings)) {
            if (typeof value === 'string') {
                await db.siteSetting.upsert({
                    where: { key },
                    update: { value },
                    create: { key, value }
                })
            }
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error("[POST] Failed to update settings:", error)
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }
}
