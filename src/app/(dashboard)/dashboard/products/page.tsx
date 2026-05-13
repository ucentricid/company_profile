"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { Loader2, Plus, Trash2, Edit, ExternalLink, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

type Product = {
    id: string
    name: string
    slug: string
    tagline: string
    description: string
    iconName: string
    features: string[]
    heroTitle: string | null
    heroGradient: string | null
    ctaText: string
    ctaLink: string
    content: string | null
    imageUrl: string | null
    isActive: boolean
    order: number
}

const defaultFormData = {
    name: "", slug: "", tagline: "", description: "", iconName: "Box",
    featuresText: "", heroTitle: "", heroGradient: "", ctaText: "Request Demo",
    ctaLink: "/contact", content: "", imageUrl: "", order: 0
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState(defaultFormData)

    useEffect(() => { fetchProducts() }, [])

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/products")
            const data = await res.json()
            setProducts(data)
        } catch (error) {
            console.error("Failed to load products:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setFormData(defaultFormData)
        setEditingId(null)
    }

    const handleEdit = (product: Product) => {
        setFormData({
            name: product.name,
            slug: product.slug,
            tagline: product.tagline,
            description: product.description,
            iconName: product.iconName,
            featuresText: product.features.join("\n"),
            heroTitle: product.heroTitle || "",
            heroGradient: product.heroGradient || "",
            ctaText: product.ctaText,
            ctaLink: product.ctaLink,
            content: product.content || "",
            imageUrl: product.imageUrl || "",
            order: product.order,
        })
        setEditingId(product.id)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return
        try {
            await fetch(`/api/products?id=${id}`, { method: "DELETE" })
            fetchProducts()
        } catch (error) {
            console.error("Failed to delete", error)
        }
    }

    const handleToggleActive = async (product: Product) => {
        try {
            await fetch("/api/products", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: product.id, isActive: !product.isActive })
            })
            fetchProducts()
        } catch (error) {
            console.error("Failed to toggle", error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const payload = {
                ...(editingId ? { id: editingId } : {}),
                name: formData.name,
                slug: formData.slug,
                tagline: formData.tagline,
                description: formData.description,
                iconName: formData.iconName || "Box",
                features: formData.featuresText.split("\n").filter(f => f.trim()),
                heroTitle: formData.heroTitle || null,
                heroGradient: formData.heroGradient || null,
                ctaText: formData.ctaText || "Request Demo",
                ctaLink: formData.ctaLink || "/contact",
                content: formData.content || null,
                imageUrl: formData.imageUrl || null,
                order: formData.order,
            }

            const res = await fetch("/api/products", {
                method: editingId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                resetForm()
                fetchProducts()
            } else {
                const err = await res.json()
                alert(err.error || "Failed to save product")
            }
        } catch (error) {
            console.error("Failed to save product", error)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Products</h1>
                <p className="text-slate-400 mt-2">Manage products. Each product auto-generates a page at <code className="text-primary">/products/[slug]</code>.</p>
            </div>

            {/* Add/Edit Form */}
            <Card className="bg-[#1E293B] border-[#334155] text-slate-100">
                <CardHeader>
                    <CardTitle className="text-xl">{editingId ? "Edit Product" : "Add New Product"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Row 1: Name + Slug */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Product Name</label>
                                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. U-Kasir" className="bg-[#0F172A] border-[#334155]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Slug (URL path)</label>
                                <Input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")})} placeholder="e.g. ukasir" className="bg-[#0F172A] border-[#334155]" />
                                <p className="text-xs text-slate-500">Page URL: /products/{formData.slug || "..."}</p>
                            </div>
                        </div>

                        {/* Row 2: Tagline + Icon */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tagline</label>
                                <Input required value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} placeholder="e.g. Retail POS" className="bg-[#0F172A] border-[#334155]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Icon Name (Lucide)</label>
                                <Input value={formData.iconName} onChange={e => setFormData({...formData, iconName: e.target.value})} placeholder="e.g. ShoppingCart, GraduationCap" className="bg-[#0F172A] border-[#334155]" />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Product description for showcase cards and hero section..." className="bg-[#0F172A] border-[#334155] min-h-20" />
                        </div>

                        {/* Features (one per line) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Features (one per line)</label>
                            <Textarea value={formData.featuresText} onChange={e => setFormData({...formData, featuresText: e.target.value})} placeholder={"Real-time Stock Management\nQRIS & Multi-payment\nOffline-First Architecture"} className="bg-[#0F172A] border-[#334155] min-h-25" />
                        </div>

                        {/* Row 3: Hero Title + Hero Gradient */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hero Title (optional)</label>
                                <Input value={formData.heroTitle} onChange={e => setFormData({...formData, heroTitle: e.target.value})} placeholder="e.g. Smart Campus Ecosystem." className="bg-[#0F172A] border-[#334155]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hero Gradient (optional)</label>
                                <Input value={formData.heroGradient} onChange={e => setFormData({...formData, heroGradient: e.target.value})} placeholder="e.g. from-orange-500 to-red-600" className="bg-[#0F172A] border-[#334155]" />
                            </div>
                        </div>

                        {/* Row 4: CTA + Image URL */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">CTA Text</label>
                                <Input value={formData.ctaText} onChange={e => setFormData({...formData, ctaText: e.target.value})} placeholder="Request Demo" className="bg-[#0F172A] border-[#334155]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">CTA Link</label>
                                <Input value={formData.ctaLink} onChange={e => setFormData({...formData, ctaLink: e.target.value})} placeholder="/contact" className="bg-[#0F172A] border-[#334155]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image URL (optional)</label>
                                <Input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." className="bg-[#0F172A] border-[#334155]" />
                            </div>
                        </div>

                        {/* Content (full page HTML) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Page Content (HTML, optional)</label>
                            <Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Custom HTML content for the product landing page. Leave empty to use the default template." className="bg-[#0F172A] border-[#334155] min-h-30 font-mono text-xs" />
                        </div>

                        {/* Order */}
                        <div className="w-1/4 space-y-2">
                            <label className="text-sm font-medium">Display Order</label>
                            <Input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="bg-[#0F172A] border-[#334155]" />
                        </div>

                        {/* Submit */}
                        <div className="flex items-center gap-2">
                            <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white">
                                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (editingId ? null : <Plus className="w-4 h-4 mr-2" />)}
                                {editingId ? "Update Product" : "Add Product"}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="outline" onClick={resetForm} className="border-[#334155] text-slate-300">Cancel</Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Product Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map(product => (
                    <Card key={product.id} className={`bg-[#1E293B] border-[#334155] text-slate-100 flex flex-col ${!product.isActive ? "opacity-60" : ""}`}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{product.name}</CardTitle>
                                    <p className="text-xs text-slate-500 mt-1">/products/{product.slug}</p>
                                </div>
                                <div className="flex gap-2 text-slate-400">
                                    <Link href={`/products/${product.slug}`} target="_blank" className="hover:text-primary">
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                    <button onClick={() => handleEdit(product)} className="hover:text-primary"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleToggleActive(product)} className="hover:text-yellow-500">
                                        {product.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-primary">{product.tagline}</span>
                                {product.isActive ? (
                                    <span className="text-xs text-green-500">Active</span>
                                ) : (
                                    <span className="text-xs text-slate-500">Inactive</span>
                                )}
                            </div>
                            <p className="text-sm text-slate-400 line-clamp-2">{product.description}</p>
                            {product.features.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {product.features.slice(0, 3).map((f, i) => (
                                        <span key={i} className="text-xs bg-slate-800 px-2 py-0.5 rounded">{f}</span>
                                    ))}
                                    {product.features.length > 3 && (
                                        <span className="text-xs text-slate-500">+{product.features.length - 3} more</span>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {products.length === 0 && !isLoading && (
                <div className="text-center py-12 text-slate-500">
                    No products yet. Add your first product above.
                </div>
            )}
        </div>
    )
}
