"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Heading } from "@/components/ui/Typography"
import { Select } from "@/components/ui/Select"
import RichTextEditor from "@/components/ui/RichTextEditor"
import Swal from "sweetalert2"

type ArticleStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"

const CATEGORIES = [
    { label: "Technology", value: "Technology" },
    { label: "Design", value: "Design" },
    { label: "Business", value: "Business" },
    { label: "Culture", value: "Culture" },
    { label: "Engineering", value: "Engineering" }
]

const STATUS_OPTIONS = [
    { label: "Draft", value: "DRAFT" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Archived", value: "ARCHIVED" }
]

export default function NewArticlePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "Technology",
        imageUrl: "",
        authorName: "",
        authorImage: "",
        authorRole: "",
        readTime: "5 min read",
        isFeatured: false,
        isTrending: false,
        status: "DRAFT" as ArticleStatus
    })

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value }
            // Auto-generate slug from title
            if (field === "title") {
                newData.slug = (value as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }
            return newData
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        })

        setLoading(true)
        try {
            const res = await fetch("/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Failed to create article")
            }

            Toast.fire({
                icon: "success",
                title: "Article created successfully"
            })

            router.push("/dashboard/articles")
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error instanceof Error ? error.message : "Something went wrong",
                confirmButtonColor: "#f97316"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/articles">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </Link>
                <Heading variant="h2">Add New Article</Heading>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Article Content</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title *</label>
                                    <Input
                                        required
                                        value={formData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                        placeholder="Enter article title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Slug</label>
                                    <Input
                                        value={formData.slug}
                                        readOnly
                                        className="bg-gray-50 text-gray-500"
                                        placeholder="Auto-generated from title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Excerpt</label>
                                    <Textarea
                                        value={formData.excerpt}
                                        onChange={(e) => handleInputChange("excerpt", e.target.value)}
                                        placeholder="Brief summary of the article..."
                                        className="h-24"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Content</label>
                                    <RichTextEditor
                                        content={formData.content}
                                        onChange={(html) => handleInputChange("content", html)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Image URL</label>
                                    <Input
                                        value={formData.imageUrl}
                                        onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Author Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Author Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Author Name *</label>
                                        <Input
                                            required
                                            value={formData.authorName}
                                            onChange={(e) => handleInputChange("authorName", e.target.value)}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Author Role</label>
                                        <Input
                                            value={formData.authorRole}
                                            onChange={(e) => handleInputChange("authorRole", e.target.value)}
                                            placeholder="Software Engineer"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Author Image URL</label>
                                    <Input
                                        value={formData.authorImage}
                                        onChange={(e) => handleInputChange("authorImage", e.target.value)}
                                        placeholder="https://example.com/author.jpg"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Publish Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <Select
                                        options={STATUS_OPTIONS}
                                        value={formData.status}
                                        onChange={(val) => handleInputChange("status", val)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <Select
                                        options={CATEGORIES}
                                        value={formData.category}
                                        onChange={(val) => handleInputChange("category", val)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Read Time</label>
                                    <Input
                                        value={formData.readTime}
                                        onChange={(e) => handleInputChange("readTime", e.target.value)}
                                        placeholder="5 min read"
                                    />
                                </div>

                                <div className="space-y-3 pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFeatured}
                                            onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <span className="text-sm font-medium">Featured Article</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isTrending}
                                            onChange={(e) => handleInputChange("isTrending", e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <span className="text-sm font-medium">Trending Article</span>
                                    </label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6 space-y-3">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {loading ? "Saving..." : "Save Article"}
                                </Button>
                                <Link href="/dashboard/articles" className="block">
                                    <Button type="button" variant="outline" className="w-full">
                                        Cancel
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    )
}
