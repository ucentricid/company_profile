"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Briefcase, SwitchCamera, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import Swal from "sweetalert2"
import { Badge } from "@/components/ui/Badge"

export default function CompanyProjectsPage() {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<any>(null)
    const [formData, setFormData] = useState({
        title: "",
        client: "",
        category: "",
        tags: "", // Comma-separated
        description: "",
        stats: "",
        image: "",
        projectUrl: "",
        isFeatured: false,
        isActive: true
    })

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/company-projects")
            const data = await res.json()
            setProjects(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const method = editingProject ? "PUT" : "POST"
            const payload = {
                ...formData,
                id: editingProject?.id,
                tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
            }

            const res = await fetch("/api/company-projects", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                Swal.fire({ icon: "success", title: "Saved!", timer: 1500, showConfirmButton: false })
                setIsModalOpen(false)
                fetchProjects()
            } else {
                throw new Error("Failed to save")
            }
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error saving project" })
        }
    }

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the project.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        })

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/company-projects?id=${id}`, { method: "DELETE" })
                if (res.ok) {
                    Swal.fire("Deleted!", "Project has been deleted.", "success")
                    fetchProjects()
                } else {
                    throw new Error("Failed to delete")
                }
            } catch (error) {
                Swal.fire("Error!", "Could not delete project.", "error")
            }
        }
    }

    const openModal = (project: any = null) => {
        if (project) {
            setEditingProject(project)
            setFormData({
                title: project.title,
                client: project.client,
                category: project.category,
                tags: project.tags.join(", "),
                description: project.description,
                stats: project.stats,
                image: project.image || "",
                projectUrl: project.projectUrl || "",
                isFeatured: project.isFeatured,
                isActive: project.isActive
            })
        } else {
            setEditingProject(null)
            setFormData({
                title: "", client: "", category: "", tags: "", description: "", stats: "", image: "", projectUrl: "", isFeatured: false, isActive: true
            })
        }
        setIsModalOpen(true)
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Company Projects</h1>
                    <p className="text-muted-foreground">Manage official Ucentric portfolio projects.</p>
                </div>
                <Button onClick={() => openModal()} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Project
                </Button>
            </div>

            {loading ? (
                <div>Loading projects...</div>
            ) : (
                <div className="grid gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="flex gap-4 items-center">
                                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                                    {project.image ? <img src={project.image} alt={project.title} className="w-full h-full object-cover" /> : <Briefcase className="w-6 h-6 text-muted-foreground" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{project.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">Client: {project.client} • {project.category}</p>
                                    <div className="flex gap-2 text-xs">
                                        <Badge variant={project.isActive ? "default" : "secondary"}>{project.isActive ? "Active" : "Hidden"}</Badge>
                                        {project.isFeatured && <Badge variant="secondary" className="bg-primary/20 text-primary">Featured</Badge>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => openModal(project)}><Edit2 className="w-4 h-4" /></Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && <div className="text-center py-12 text-muted-foreground border border-dashed rounded-2xl">No company projects found.</div>}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                            <h2 className="text-xl font-bold">{editingProject ? "Edit Project" : "Add Project"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground"><XCircle className="w-6 h-6" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Title</label>
                                        <Input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Smart Dashboard" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Client Name</label>
                                        <Input required value={formData.client} onChange={(e) => setFormData({...formData, client: e.target.value})} placeholder="e.g. Retail Corp" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Category</label>
                                        <Input required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Finance" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Core Stat / Metric</label>
                                        <Input required value={formData.stats} onChange={(e) => setFormData({...formData, stats: e.target.value})} placeholder="e.g. 5M+ Users" />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tags (comma-separated)</label>
                                    <Input value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} placeholder="e.g. Mobile App, React, Backend" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea required rows={3} className="w-full flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Brief project description..." />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Image URL</label>
                                        <Input value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Live URL (Optional)</label>
                                        <Input value={formData.projectUrl} onChange={(e) => setFormData({...formData, projectUrl: e.target.value})} placeholder="https://..." />
                                    </div>
                                </div>

                                <div className="flex gap-6 mt-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} className="rounded border-input text-primary focus:ring-primary" />
                                        <span className="text-sm">Highlight in Landing Page?</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="rounded border-input text-primary focus:ring-primary" />
                                        <span className="text-sm">Active (Visible)</span>
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/30">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" form="project-form">Save Project</Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
