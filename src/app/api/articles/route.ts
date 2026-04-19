"use server"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

// Helper to validate image URL
function validateImageUrl(url: string | undefined | null): string | null {
    if (!url || url.trim() === '') return null
    const trimmed = url.trim()
    // Only accept URLs starting with /, http://, or https://
    if (trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed
    }
    // Invalid URL - return null (will use default image on display)
    return null
}

const articleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    imageUrl: z.string().optional(),
    authorName: z.string().min(1, "Author name is required"),
    authorImage: z.string().optional(),
    authorRole: z.string().optional(),
    readTime: z.string().default("5 min read"),
    isFeatured: z.boolean().optional(),
    isTrending: z.boolean().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional()
})

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const status = searchParams.get("status")
        const category = searchParams.get("category")
        const featured = searchParams.get("featured")
        const trending = searchParams.get("trending")
        const search = searchParams.get("search")

        const where: any = {}

        if (status && status !== "ALL") {
            where.status = status
        }
        if (category && category !== "All") {
            where.category = category
        }
        if (featured === "true") {
            where.isFeatured = true
        }
        if (trending === "true") {
            where.isTrending = true
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { excerpt: { contains: search, mode: "insensitive" } }
            ]
        }

        const articles = await db.article.findMany({
            where,
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(articles)
    } catch (error) {
        console.error("[GET] Failed to fetch articles:", error)
        return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
    }
}

// Helper to ensure unique slug
async function ensureUniqueSlug(baseSlug: string) {
    let slug = baseSlug
    let counter = 1

    while (true) {
        const existing = await db.article.findUnique({
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
        const validated = articleSchema.parse(body)

        // Ensure unique slug
        const finalSlug = await ensureUniqueSlug(validated.slug)

        const article = await db.article.create({
            data: {
                title: validated.title,
                slug: finalSlug,
                excerpt: validated.excerpt || null,
                content: validated.content || null,
                category: validated.category,
                imageUrl: validateImageUrl(validated.imageUrl),
                authorName: validated.authorName,
                authorImage: validateImageUrl(validated.authorImage),
                authorRole: validated.authorRole || null,
                readTime: validated.readTime,
                isFeatured: validated.isFeatured || false,
                isTrending: validated.isTrending || false,
                status: validated.status || "DRAFT"
            }
        })

        return NextResponse.json(article, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
        }
        console.error("[POST] Failed to create article:", error)
        return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { id, ...data } = body

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        // Validate image URLs before saving
        const updateData = { ...data }
        if ('imageUrl' in updateData) {
            updateData.imageUrl = validateImageUrl(updateData.imageUrl)
        }
        if ('authorImage' in updateData) {
            updateData.authorImage = validateImageUrl(updateData.authorImage)
        }

        const article = await db.article.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json(article)
    } catch (error) {
        console.error("[PUT] Failed to update article:", error)
        return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        await db.article.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[DELETE] Failed to delete article:", error)
        return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
    }
}
