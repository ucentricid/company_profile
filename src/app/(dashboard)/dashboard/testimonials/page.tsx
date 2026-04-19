"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { Loader2, Plus, Trash2, Edit } from "lucide-react"

type Testimonial = {
    id: string
    clientName: string
    clientRole: string
    company: string | null
    content: string
    image: string | null
    rating: number
    order: number
    isActive: boolean
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ clientName: "", clientRole: "", company: "", content: "", image: "", rating: 5, order: 0 })

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const fetchTestimonials = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/testimonials")
            const data = await res.json()
            setTestimonials(data)
        } catch (error) {
            console.error("Failed to load testimonials:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({ clientName: "", clientRole: "", company: "", content: "", image: "", rating: 5, order: 0 })
        setEditingId(null)
    }

    const handleEdit = (t: Testimonial) => {
        setFormData({ 
            clientName: t.clientName, 
            clientRole: t.clientRole, 
            company: t.company || "", 
            content: t.content,
            image: t.image || "", 
            rating: t.rating,
            order: t.order 
        })
        setEditingId(t.id)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return
        try {
            await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" })
            fetchTestimonials()
        } catch (error) {
            console.error("Failed to delete", error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const url = "/api/testimonials"
            const method = editingId ? "PUT" : "POST"
            const body = editingId ? { id: editingId, ...formData } : formData

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            if (res.ok) {
                resetForm()
                fetchTestimonials()
            }
        } catch (error) {
            console.error("Failed to save testimonial", error)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100">Testimonials</h1>
                <p className="text-slate-400">Manage the client testimonials displayed on the landing page.</p>
            </div>

            <Card className="bg-[#1E293B] border-[#334155] text-slate-100">
                <CardHeader>
                    <CardTitle>{editingId ? "Edit Testimonial" : "Add New Testimonial"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm">Client Name</label>
                                <Input required value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="bg-[#0F172A] border-[#334155]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm">Client Role</label>
                                <Input required value={formData.clientRole} onChange={e => setFormData({...formData, clientRole: e.target.value})} className="bg-[#0F172A] border-[#334155]" placeholder="e.g. CEO" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm">Company (Optional)</label>
                                <Input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="bg-[#0F172A] border-[#334155]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm">Image URL (Optional)</label>
                                <Input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="bg-[#0F172A] border-[#334155]" placeholder="https://..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm">Content</label>
                            <Textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="bg-[#0F172A] border-[#334155] min-h-[100px]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm">Rating (1-5)</label>
                                <Input type="number" min={1} max={5} required value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})} className="bg-[#0F172A] border-[#334155]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm">Order</label>
                                <Input type="number" required value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="bg-[#0F172A] border-[#334155]" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white">
                                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (editingId ? null : <Plus className="w-4 h-4 mr-2" />)}
                                {editingId ? "Update Testimonial" : "Add Testimonial"}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="outline" onClick={resetForm} className="border-[#334155] text-slate-300">Cancel</Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map(t => (
                    <Card key={t.id} className="bg-[#1E293B] border-[#334155] text-slate-100 flex flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{t.clientName}</CardTitle>
                                    <p className="text-xs text-slate-400">{t.clientRole} {t.company ? `at ${t.company}` : ''}</p>
                                </div>
                                <div className="flex gap-2 text-slate-400">
                                    <button onClick={() => handleEdit(t)} className="hover:text-primary"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(t.id)} className="hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-slate-300 italic mb-2">"{t.content}"</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
