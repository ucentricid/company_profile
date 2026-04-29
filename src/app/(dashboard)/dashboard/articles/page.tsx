"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Plus, Search, Edit2, Trash2, Eye, Star, TrendingUp, FileText, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import { Heading, Text } from "@/components/ui/Typography"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Select } from "@/components/ui/Select"
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
    createdAt: string
    updatedAt: string
}

const STATUS_OPTIONS = [
    { label: "All Status", value: "ALL" },
    { label: "Draft", value: "DRAFT" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Archived", value: "ARCHIVED" }
]

export default function ArticlesCMSPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (statusFilter !== "ALL") params.append("status", statusFilter)
            if (searchQuery) params.append("search", searchQuery)

            const res = await fetch(`/api/articles?${params}`)
            if (res.ok) {
                const data = await res.json()
                setArticles(data)
            }
        } catch (error) {
            console.error("Failed to fetch articles", error)
        } finally {
            setLoading(false)
        }
    }

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchArticles()
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery, statusFilter])

    const handleDelete = async (article: Article) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Delete article "${article.title}"? This cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        })

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/articles?id=${article.id}`, { method: "DELETE" })
                if (res.ok) {
                    fetchArticles()
                    Swal.fire("Deleted!", "Article has been deleted.", "success")
                } else {
                    const error = await res.json()
                    throw new Error(error.error)
                }
            } catch (error) {
                Swal.fire("Error", error instanceof Error ? error.message : "Failed to delete", "error")
            }
        }
    }

    const getStatusBadge = (status: ArticleStatus) => {
        const styles = {
            DRAFT: "bg-gray-100 text-gray-700",
            PUBLISHED: "bg-green-100 text-green-700",
            ARCHIVED: "bg-yellow-100 text-yellow-700"
        }
        return <Badge className={styles[status]}>{status}</Badge>
    }

    // Filter and pagination
    const filteredArticles = articles
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
        }
    }

    if (loading && articles.length === 0) return <div className="p-8">Loading articles...</div>

    // Basic client-side protection
    if (session?.user?.role !== "admin" && session?.user?.role !== "superadmin") {
        return <div className="p-8 text-red-500">Access Denied</div>
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Heading variant="h2">Articles Management</Heading>
                    <Text variant="muted">Manage blog articles and content.</Text>
                </div>
                <Button onClick={() => router.push("/dashboard/articles/new")} className="shadow-lg shadow-primary/20">
                    <Plus className="w-5 h-5 mr-2" /> Add New Article
                </Button>
            </div>

            <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-center gap-4">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search articles..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <Select
                                options={STATUS_OPTIONS}
                                value={statusFilter}
                                onChange={(val) => setStatusFilter(val)}
                            />
                        </div>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Flags</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedArticles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">No articles found.</TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedArticles.map((article) => (
                                        <TableRow key={article.id}>
                                            <TableCell>
                                                <div className="max-w-xs">
                                                    <div className="font-medium truncate">{article.title}</div>
                                                    <div className="text-xs text-gray-400 truncate">/{article.slug}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{article.category}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{article.authorName}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {article.isFeatured && (
                                                        <span title="Featured"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /></span>
                                                    )}
                                                    {article.isTrending && (
                                                        <span title="Trending"><TrendingUp className="w-4 h-4 text-blue-500" /></span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(article.status)}</TableCell>
                                            <TableCell className="text-sm text-gray-500">
                                                {new Date(article.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                                                        title="View article"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/articles/${article.id}/edit`)}>
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(article)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {paginatedArticles.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No articles found.</div>
                        ) : (
                            paginatedArticles.map((article) => (
                                <div key={article.id} className="p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium">{article.title}</div>
                                            <div className="text-xs text-gray-400">/{article.slug}</div>
                                        </div>
                                        {getStatusBadge(article.status)}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                                        <span>by {article.authorName}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex gap-1">
                                            {article.isFeatured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                            {article.isTrending && <TrendingUp className="w-4 h-4 text-blue-500" />}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                                                title="View article"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/articles/${article.id}/edit`)}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(article)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredArticles.length > 0 && (
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredArticles.length)} of {filteredArticles.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                    Next <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
