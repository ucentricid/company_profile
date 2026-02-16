"use client"

import { useState, useEffect } from "react"
import { Heading, Text } from "@/components/ui/Typography"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Modal } from "@/components/ui/Modal"
import { Select } from "@/components/ui/Select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"
import { Search, Plus, Trash2, Edit2, MapPin, Briefcase, Building2, Users, ChevronLeft, ChevronRight } from "lucide-react"
import Swal from "sweetalert2"

interface InternshipRole {
    id: string
    title: string
    slug: string
    department: string
    type: string
    location: string
    isActive: boolean
    requirements?: string[]
    responsibilities?: string[]
    _count?: { applications: number }
}

export default function RolesPage() {
    const [roles, setRoles] = useState<InternshipRole[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)

    const filteredRoles = roles.filter(role => 
        role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.department.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage)
    const paginatedRoles = filteredRoles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
        }
    }
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingRole, setEditingRole] = useState<InternshipRole | null>(null)
    
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        department: "Engineering",
        type: "Internship",
        location: "Remote",
        requirements: [] as string[],
        responsibilities: [] as string[]
    })

    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = async () => {
        try {
            const res = await fetch("/api/roles")
            if (res.ok) {
                const data = await res.json()
                setRoles(data)
            }
        } catch (error) {
            console.error("Failed to fetch roles", error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value }
            // Auto-generate slug from title if adding new role
            if (field === "title" && !editingRole) {
                newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }
            return newData
        })
    }



    const openAddModal = () => {
        setEditingRole(null)
        setFormData({ 
            title: "", 
            slug: "", 
            department: "Engineering", 
            type: "Internship", 
            location: "Remote",
            requirements: [],
            responsibilities: []
        })
        setIsModalOpen(true)
    }

    const openEditModal = (role: InternshipRole) => {
        setEditingRole(role)
        setFormData({ 
            title: role.title, 
            slug: role.slug, 
            department: role.department, 
            type: role.type, 
            location: role.location,
            requirements: role.requirements || [],
            responsibilities: role.responsibilities || []
        })
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Toast Configuration
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        try {
            const url = "/api/roles"
            const method = editingRole ? "PUT" : "POST"
            // Filter out empty strings
            const cleanedData = {
                ...formData,
                requirements: formData.requirements.filter(s => s.trim()),
                responsibilities: formData.responsibilities.filter(s => s.trim())
            }
            const body = editingRole ? { id: editingRole.id, ...cleanedData } : cleanedData

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            if (!res.ok) throw new Error("Failed to save role")

            fetchRoles()
            setIsModalOpen(false)
            
            Toast.fire({
                icon: 'success',
                title: editingRole ? 'Role updated successfully' : 'New role added successfully'
            })

        } catch (error) {
            console.error(error)
            Toast.fire({
                icon: 'error',
                title: 'Failed to save role'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string, appCount: number = 0) => {
        if (appCount > 0) {
            Swal.fire({
                icon: "error",
                title: "Cannot Delete",
                text: "Cannot delete role with existing applications.",
                confirmButtonColor: "#f97316"
            })
            return
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f97316",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        })

        if (!result.isConfirmed) return

        try {
            const res = await fetch(`/api/roles?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                fetchRoles()
                Swal.fire({
                    title: "Deleted!",
                    text: "The role has been deleted.",
                    icon: "success",
                    confirmButtonColor: "#f97316"
                })
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete role.",
                    icon: "error",
                    confirmButtonColor: "#f97316"
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Heading variant="h2">Job Roles</Heading>
                    <Text variant="muted">Manage open internship positions and requirements.</Text>
                </div>
                <Button 
                    className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-orange-500/20"
                    onClick={openAddModal}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add New Role
                </Button>
            </div>

            {/* Roles Table */}
            <Card className="border-none shadow-sm bg-white overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Role Title</TableHead>
                            <TableHead className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Department</TableHead>
                            <TableHead className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Type & Location</TableHead>
                            <TableHead className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Applicants</TableHead>
                            <TableHead className="px-6 py-4 font-bold text-gray-500 uppercase text-xs text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Loading roles...</TableCell>
                            </TableRow>
                        ) : filteredRoles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">No roles found.</TableCell>
                            </TableRow>
                        ) : (
                            paginatedRoles.map((role) => (
                                <TableRow key={role.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
                                    <TableCell className="px-6 py-4">
                                        <div>
                                            <div className="font-semibold text-gray-900">{role.title}</div>
                                            <div className="text-xs text-gray-400">/{role.slug}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Building2 className="w-4 h-4 text-gray-400" />
                                            {role.department}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit">
                                                <Briefcase className="w-3 h-3" /> {role.type}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <MapPin className="w-3 h-3" /> {role.location}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="font-bold text-gray-700">{role._count?.applications || 0}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => openEditModal(role)}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50" 
                                                onClick={() => handleDelete(role.id, role._count?.applications)}
                                                disabled={(role._count?.applications || 0) > 0}
                                                title={role._count?.applications ? "Cannot delete active role" : "Delete Role"}
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

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading roles...</div>
                ) : filteredRoles.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No roles found.</div>
                ) : (
                    paginatedRoles.map((role) => (
                        <div key={role.id} className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-gray-900">{role.title}</div>
                                    <div className="text-xs text-gray-400 mb-1">/{role.slug}</div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-fit">
                                        <Briefcase className="w-3 h-3" /> {role.type}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => openEditModal(role)}>
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50" 
                                        onClick={() => handleDelete(role.id, role._count?.applications)}
                                        disabled={(role._count?.applications || 0) > 0}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                    {role.department}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                    {role.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="font-medium">{role._count?.applications || 0} Applicants</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {/* Pagination Controls */}
            {!loading && filteredRoles.length > 0 && (
                <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between">
                    <div className="text-sm text-gray-500 hidden md:block">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredRoles.length)}</span> of <span className="font-medium">{filteredRoles.length}</span> results
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="h-9"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                        </Button>
                        <span className="text-sm font-medium text-gray-700 md:hidden">
                            Page {currentPage} / {totalPages}
                        </span>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                            className="h-9"
                        >
                            Next <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            )}
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingRole ? "Edit Role" : "Add New Role"}
                description="Manage internship role details."
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Role Title</label>
                        <Input 
                            value={formData.title} 
                            onChange={(e) => handleInputChange("title", e.target.value)} 
                            placeholder="e.g. Frontend Developer Intern"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Slug (URL)</label>
                        <Input 
                            value={formData.slug} 
                            readOnly
                            placeholder="Auto-generated from title"
                            className="bg-gray-100 text-gray-500 cursor-not-allowed is-disabled"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Department</label>
                            <Select 
                                value={formData.department}
                                onChange={(val) => handleInputChange("department", val)}
                                options={[
                                    { label: "Engineering", value: "Engineering" },
                                    { label: "Design", value: "Design" },
                                    { label: "Marketing", value: "Marketing" },
                                    { label: "Product", value: "Product" },
                                    { label: "Human Resources", value: "Human Resources" },
                                ]}
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-gray-700">Location</label>
                            <Select 
                                value={formData.location}
                                onChange={(val) => handleInputChange("location", val)}
                                options={[
                                    { label: "Remote", value: "Remote" },
                                    { label: "On-site (Jakarta)", value: "Jakarta" },
                                    { label: "Hybrid", value: "Hybrid" },
                                ]}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700">Employment Type</label>
                         <Select 
                            value={formData.type}
                            onChange={(val) => handleInputChange("type", val)}
                            options={[
                                { label: "Internship", value: "Internship" },
                                { label: "Full-time", value: "Full-time" },
                                { label: "Contract", value: "Contract" },
                            ]}
                        />
                    </div>

                    {/* Requirements List - Converted to Textarea */}
                    <div className="space-y-2 pt-2 border-t">
                        <label className="text-sm font-bold text-gray-800">
                            Requirements <span className="text-xs font-normal text-gray-500">(One item per line)</span>
                        </label>
                        <Textarea 
                            value={formData.requirements.join('\n')}
                            onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value.split('\n') }))}
                            placeholder="e.g. React.js knowledge&#10;Good communication skills&#10;Problem solving mindset"
                            className="h-[150px]"
                        />
                    </div>

                    {/* Responsibilities List - Converted to Textarea */}
                    <div className="space-y-2 pt-2 border-t">
                        <label className="text-sm font-bold text-gray-800">
                            Responsibilities <span className="text-xs font-normal text-gray-500">(One item per line)</span>
                        </label>
                        <Textarea 
                            value={formData.responsibilities.join('\n')}
                            onChange={(e) => setFormData(prev => ({ ...prev, responsibilities: e.target.value.split('\n') }))}
                            placeholder="e.g. Build UI components&#10;Collaborate with design team&#10;Write unit tests"
                            className="h-[150px]"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90">
                            {isSubmitting ? "Saving..." : "Save Role"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
