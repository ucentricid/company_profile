import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
    tagline: z.string().min(1, "Tagline is required"),
    description: z.string().min(1, "Description is required"),
    iconName: z.string().default("Box"),
    features: z.array(z.string()).default([]),
    heroTitle: z.string().nullable().optional(),
    heroGradient: z.string().nullable().optional(),
    ctaText: z.string().default("Request Demo"),
    ctaLink: z.string().default("/contact"),
    content: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    isActive: z.boolean().default(true),
    order: z.number().int().default(0),
})

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const isActiveStr = searchParams.get("isActive")
        const slug = searchParams.get("slug")

        // Fetch single product by slug
        if (slug) {
            const product = await db.product.findUnique({ where: { slug } })
            if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 })
            return NextResponse.json(product)
        }

        const where: any = {}
        if (isActiveStr === "true") where.isActive = true
        if (isActiveStr === "false") where.isActive = false

        const products = await db.product.findMany({
            where,
            orderBy: { order: "asc" }
        })

        return NextResponse.json(products)
    } catch (error) {
        console.error("[GET] Failed to fetch products:", error)
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validated = productSchema.parse(body)

        const product = await db.product.create({
            data: validated
        })

        return NextResponse.json(product, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
        }
        console.error("[POST] Failed to create product:", error)
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { id, ...data } = body

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        const validated = productSchema.partial().parse(data)

        const product = await db.product.update({
            where: { id },
            data: validated
        })

        return NextResponse.json(product)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
        }
        console.error("[PUT] Failed to update product:", error)
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        await db.product.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[DELETE] Failed to delete product:", error)
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }
}
