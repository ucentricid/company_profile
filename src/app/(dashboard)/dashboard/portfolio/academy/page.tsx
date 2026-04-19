"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { CheckCircle2, XCircle, Clock, GraduationCap, Eye } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Swal from "sweetalert2"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"

export default function AcademyApprovalsPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/portfolio/admin")
            const data = await res.json()
            setPosts(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        const result = await Swal.fire({
            title: `Mark as ${status}?`,
            text: status === 'APPROVED' ? "This will publish the post on the live website." : "This will reject the submission.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: status === 'APPROVED' ? "#10b981" : "#ef4444",
            cancelButtonColor: "#3085d6",
            confirmButtonText: `Yes, ${status.toLowerCase()} it!`
        })

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/portfolio/approve`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, status })
                })
                
                if (res.ok) {
                    Swal.fire("Success!", `Post has been ${status}.`, "success")
                    fetchPosts()
                } else {
                    throw new Error("Failed to update")
                }
            } catch (error) {
                Swal.fire("Error!", "Could not update status.", "error")
            }
        }
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Academy Submissions</h1>
                    <p className="text-muted-foreground">Review and approve portfolio items submitted by Interns.</p>
                </div>
            </div>

            {loading ? (
                <div>Loading submissions...</div>
            ) : (
                <div className="grid gap-6">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="flex gap-4 items-center">
                                <div className="w-16 h-16 rounded-xl border border-muted bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden">
                                    {post.imageUrl ? <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" /> : <GraduationCap className="w-6 h-6 text-muted-foreground" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{post.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">By: <span className="font-semibold text-foreground">{post.User?.name}</span> • {new Date(post.createdAt).toLocaleDateString()}</p>
                                    <div className="flex gap-2 items-center">
                                        <Badge variant="outline" className={
                                            post.status === 'APPROVED' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                            post.status === 'PENDING' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                            post.status === 'REJECTED' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                            "bg-muted text-muted-foreground"
                                        }>
                                            {post.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                                            {post.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                            {post.status === 'REJECTED' && <XCircle className="w-3 h-3 mr-1" />}
                                            {post.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" asChild>
                                    {/* Link to public portfolio with pending status (we assume public route handles the slug) */}
                                    <Link href={`/portfolio/${post.id}`} target="_blank"><Eye className="w-4 h-4 mr-2" /> View</Link>
                                </Button>
                                {post.status !== 'APPROVED' && (
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUpdateStatus(post.id, 'APPROVED')}>Approve</Button>
                                )}
                                {post.status !== 'REJECTED' && (
                                    <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(post.id, 'REJECTED')}>Reject</Button>
                                )}
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && <div className="text-center py-12 text-muted-foreground border border-dashed rounded-2xl">No submissions found.</div>}
                </div>
            )}
        </div>
    )
}
