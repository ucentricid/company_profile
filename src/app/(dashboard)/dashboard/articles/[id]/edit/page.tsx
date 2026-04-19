"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
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

interface Article {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string | null
    category: string
    imageUrl: string | null
    authorName: string
    authorImage: string | null
    authorRole: string | null
    readTime: string
    isFeatured: boolean
    isTrending: boolean
    status: ArticleStatus
}

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

export default function EditArticlePage() {
    const router = useRouter()
    const params = useParams()
    const articleId = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
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

    useEffect(() => {
        fetchArticle()
    }, [articleId])

    const fetchArticle = async () => {
        try {
            const res = await fetch(`/api/articles?status=ALL`)
            if (res.ok) {
                const articles = await res.json()
                const article = articles.find((a: Article) => a.id === articleId)
                if (article) {
                    setFormData({
                        title: article.title,
                        slug: article.slug,
                        excerpt: article.excerpt || "",
                        content: article.content || "",
                        category: article.category,
                        imageUrl: article.imageUrl || "",
                        authorName: article.authorName,
                        authorImage: article.authorImage || "",
                        authorRole: article.authorRole || "",
                        readTime: article.readTime,
                        isFeatured: article.isFeatured,
                        isTrending: article.isTrending,
                        status: article.status
                    })
                } else {
                    Swal.fire("Error", "Article not found", "error")
                    router.push("/dashboard/articles")
                }
            }
        } catch (error) {
            console.error("Failed to fetch article", error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
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

        setSaving(true)
        try {
            const res = await fetch("/api/articles", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: articleId, ...formData })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Failed to update article")
            }

            Toast.fire({
                icon: "success",
                title: "Article updated successfully"
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
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Delete Article?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        })

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/articles?id=${articleId}`, { method: "DELETE" })
                if (res.ok) {
                    Swal.fire("Deleted!", "Article has been deleted.", "success")
                    router.push("/dashboard/articles")
                }
            } catch (error) {
                Swal.fire("Error", "Failed to delete article", "error")
            }
        }
    }

    if (loading) {
        return <div className="p-8">Loading article...</div>
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/articles">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                    </Link>
                    <Heading variant="h2">Edit Article</Heading>
                </div>
                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
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
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Author Role</label>
                                        <Input
                                            value={formData.authorRole}
                                            onChange={(e) => handleInputChange("authorRole", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Author Image URL</label>
                                    <Input
                                        value={formData.authorImage}
                                        onChange={(e) => handleInputChange("authorImage", e.target.value)}
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
                                <Button type="submit" className="w-full" disabled={saving}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {saving ? "Saving..." : "Save Changes"}
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
