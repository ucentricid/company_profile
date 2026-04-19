"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Loader2, Plus, Trash2, Edit } from "lucide-react"

type TeamMember = {
    id: string
    name: string
    role: string
    image: string | null
    linkedinUrl: string | null
    order: number
    isActive: boolean
}

export default function TeamPage() {
    const [team, setTeam] = useState<TeamMember[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ name: "", role: "", image: "", linkedinUrl: "", order: 0 })

    useEffect(() => {
        fetchTeam()
    }, [])

    const fetchTeam = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/team")
            const data = await res.json()
            setTeam(data)
        } catch (error) {
            console.error("Failed to load team:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({ name: "", role: "", image: "", linkedinUrl: "", order: 0 })
        setEditingId(null)
    }

    const handleEdit = (member: TeamMember) => {
        setFormData({ name: member.name, role: member.role, image: member.image || "", linkedinUrl: member.linkedinUrl || "", order: member.order })
        setEditingId(member.id)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return
        try {
            await fetch(`/api/team?id=${id}`, { method: "DELETE" })
            fetchTeam()
        } catch (error) {
            console.error("Failed to delete", error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const url = "/api/team"
            const method = editingId ? "PUT" : "POST"
            const body = editingId ? { id: editingId, ...formData } : formData

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            if (res.ok) {
                resetForm()
                fetchTeam()
            }
        } catch (error) {
            console.error("Failed to save team member", error)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100">Team Members</h1>
                <p className="text-slate-400">Manage the team members displayed on the landing page.</p>
            </div>

            <Card className="bg-[#1E293B] border-[#334155] text-slate-100">
                <CardHeader>
                    <CardTitle>{editingId ? "Edit Team Member" : "Add New Member"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm">Name</label>
                                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-[#0F172A] border-[#334155]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm">Role</label>
                                <Input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="bg-[#0F172A] border-[#334155]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm">Image URL (Optional)</label>
                                <Input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="bg-[#0F172A] border-[#334155]" placeholder="https://..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm">LinkedIn URL (Optional)</label>
                                <Input value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} className="bg-[#0F172A] border-[#334155]" placeholder="https://linkedin.com/in/..." />
                            </div>
                        </div>
                        <div className="space-y-2 w-1/4">
                            <label className="text-sm">Order</label>
                            <Input type="number" required value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="bg-[#0F172A] border-[#334155]" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white">
                                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (editingId ? null : <Plus className="w-4 h-4 mr-2" />)}
                                {editingId ? "Update Member" : "Add Member"}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="outline" onClick={resetForm} className="border-[#334155] text-slate-300">Cancel</Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {team.map(member => (
                    <Card key={member.id} className="bg-[#1E293B] border-[#334155] text-slate-100 flex flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{member.name}</CardTitle>
                                <div className="flex gap-2 text-slate-400">
                                    <button onClick={() => handleEdit(member)} className="hover:text-primary"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(member.id)} className="hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-slate-400 mb-2">{member.role}</p>
                            {member.image && <p className="text-xs text-slate-500 truncate">Img: {member.image}</p>}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
