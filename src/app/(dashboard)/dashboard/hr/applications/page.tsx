"use client"

import { useState, useEffect } from "react"
import { Heading, Text } from "@/components/ui/Typography"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
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
import Swal from "sweetalert2"
import { 
    Search, Filter, CheckCircle, XCircle, FileText, Plus, Upload, Code, 
    PenTool, Video, Server, ArrowRight, Clock, AlertCircle, CheckCircle2,
    ChevronLeft, ChevronRight, Eye 
} from "lucide-react"

// Types
type ApplicationStatus = "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED"

interface Application {
  id: string
  firstName: string
  lastName: string
  email: string
  role: { title: string }
  university: { name: string }
  major: { name: string }
  status: ApplicationStatus
  createdAt: string
  portfolioUrl?: string | null
}

interface MasterData {
  roles: { id: string; title: string }[]
  universities: { id: string; name: string }[]
  majors: { id: string; name: string }[]
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [masterData, setMasterData] = useState<MasterData>({ roles: [], universities: [], majors: [] })
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [stats, setStats] = useState({ PENDING: 0, REVIEWING: 0, ACCEPTED: 0, REJECTED: 0, TOTAL: 0 })

  // Pagination State
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  // Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    university: "",
    major: "",
    roleId: "",
    semester: "",
    notes: "",
    portfolioUrl: ""
  })

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchApplications(page, false)
    }, 500)
    return () => clearTimeout(timer)
  }, [page, searchQuery, statusFilter])

  useEffect(() => {
    fetchApplications(1, true)
    fetchMasterData()
  }, [])

  const fetchApplications = async (pageNumber = 1, fetchStats = false) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
          page: pageNumber.toString(),
          limit: limit.toString(),
          search: searchQuery,
          status: statusFilter === "ALL" ? "" : statusFilter,
          includeStats: fetchStats.toString()
      })
      const res = await fetch(`/api/applications?${queryParams}`)
      if (res.ok) {
        const result = await res.json()
        setApplications(result.data)
        setTotalPages(result.meta.totalPages)
        setTotalRecords(result.meta.total)
        if (result.stats) {
            setStats(result.stats)
        }
      }
    } catch (error) {
        console.error("Failed to fetch applications", error)
    } finally {
        setLoading(false)
    }
  }

  const fetchMasterData = async () => {
    try {
      const res = await fetch("/api/master-data")
      if (res.ok) {
        const data = await res.json()
        setMasterData(data)
      }
    } catch (error) {
        console.error("Failed to fetch master data", error)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
        const res = await fetch("/api/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                universityName: formData.university,
                majorName: formData.major,
                motivation: formData.notes
            })
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || "Failed to submit")
        }

        // Refresh list AND stats
        await fetchApplications(page, true)
        
        // Reset and close
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            university: "",
            major: "",
            roleId: "",
            semester: "",
            notes: "",
            portfolioUrl: ""
        })
        setIsAddModalOpen(false)
        
        // Success Toast
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: "Application submitted successfully"
        });

    } catch (error) {
        console.error("Submission failed", error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error instanceof Error ? error.message : 'An unexpected error occurred',
            confirmButtonColor: '#f97316'
        })
    } finally {
        setIsSubmitting(false)
    }
  }

  // Details Modal State
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  
  const handleViewDetails = (app: Application) => {
    setSelectedApplication(app)
    setIsDetailsModalOpen(true)
  }

  const handleUpdateStatus = async (status: ApplicationStatus) => {
    if (!selectedApplication) return
    
    try {
        const res = await fetch("/api/applications", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedApplication.id, status })
        })

        if (res.ok) {
            fetchApplications(page, true) // Refresh stats
            setIsDetailsModalOpen(false)
            setSelectedApplication(null)

            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "Status updated successfully"
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update status',
                confirmButtonColor: '#f97316'
            });
        }
    } catch (error) {
        console.error("Failed to update status", error)
    }
  }

  const handleDeleteApplication = async () => {
    if (!selectedApplication) return

    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this! This application will be permanently deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f97316",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    })

    if (!result.isConfirmed) return

    try {
        const res = await fetch(`/api/applications?id=${selectedApplication.id}`, {
            method: "DELETE"
        })

        if (res.ok) {
            fetchApplications(page, true) // Refresh stats
            setIsDetailsModalOpen(false)
            setSelectedApplication(null)
            Swal.fire({
                title: "Deleted!",
                text: "The application has been deleted.",
                icon: "success",
                confirmButtonColor: "#f97316"
            })
        } else {
            Swal.fire({
                title: "Error!",
                text: "Failed to delete application.",
                icon: "error",
                confirmButtonColor: "#f97316"
            })
        }
    } catch (error) {
        console.error("Failed to delete application", error)
    }
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <Heading variant="h2">Applications</Heading>
                <Text variant="muted">Manage and review incoming internship applications.</Text>
            </div>
            <Button 
                className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-orange-500/20"
                onClick={() => setIsAddModalOpen(true)}
            >
                <Plus className="w-4 h-4 mr-2" /> Add Manual
            </Button>
        </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: "Pending", value: stats.PENDING, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100" },
            { label: "Reviewing", value: stats.REVIEWING, icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
            { label: "Accepted", value: stats.ACCEPTED, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
            { label: "Rejected", value: stats.REJECTED, icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
        ].map((stat, idx) => (
            <Card key={idx} className={`border ${stat.border} shadow-sm`}>
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <Text variant="muted" className="text-xs font-semibold uppercase tracking-wider">{stat.label}</Text>
                        <Heading variant="h3" className="mt-1">{stat.value}</Heading>
                    </div>
                    <div className={`w-10 h-10 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-5 h-5" />
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        
        {/* Filters & Search */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
             <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                    placeholder="Search applicants..." 
                    className="pl-9" 
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setPage(1) // Reset page on search
                    }}
                />
             </div>
             <div className="w-full md:w-48">
                <Select
                    options={[
                        { label: "All Status", value: "ALL" },
                        { label: "Pending", value: "PENDING" },
                        { label: "Reviewing", value: "REVIEWING" },
                        { label: "Accepted", value: "ACCEPTED" },
                        { label: "Rejected", value: "REJECTED" }
                    ]}
                    placeholder="Filter Status"
                    value={statusFilter}
                    onChange={(val) => {
                        setStatusFilter(val)
                        setPage(1) // Reset page on filter
                    }}
                />
             </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Applicant</TableHead>
                <TableHead className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Role</TableHead>
                <TableHead className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">University & Major</TableHead>
                <TableHead className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Status</TableHead>
                <TableHead className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Date</TableHead>
                <TableHead className="px-6 py-4 font-bold text-gray-500 uppercase text-xs text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading applications...</TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">No applications found.</TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                            {app.firstName[0]}{app.lastName[0]}
                         </div>
                         <div>
                            <div className="font-semibold text-gray-900">{app.firstName} {app.lastName}</div>
                            <div className="text-xs text-gray-400">{app.email}</div>
                         </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-700">{app.role.title}</TableCell>
                    <TableCell className="px-6 py-4">
                        <div className="text-sm text-gray-900">{app.university.name}</div>
                        <div className="text-xs text-gray-500">{app.major.name}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                        <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:bg-indigo-50" onClick={() => handleViewDetails(app)}>
                            <Eye className="w-4 h-4" />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
            {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : applications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No applications found.</div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {applications.map((app) => (
                        <div key={app.id} className="p-4 flex flex-col gap-3 active:bg-gray-50 transition-colors" onClick={() => handleViewDetails(app)}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                        {app.firstName[0]}{app.lastName[0]}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{app.firstName} {app.lastName}</div>
                                        <div className="text-sm text-gray-500">{app.role.title}</div>
                                    </div>
                                </div>
                                <StatusBadge status={app.status} />
                            </div>
                            
                            <div className="text-sm text-gray-600 pl-[3.25rem]">
                                {app.university.name} • {app.major.name}
                            </div>
                            
                            <div className="flex items-center justify-between pl-[3.25rem] pt-1">
                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(app.createdAt).toLocaleDateString()}
                                </div>
                                <div className="text-xs font-medium text-indigo-600">
                                    View Details &rarr;
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        {/* Pagination Controls */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between">
            <div className="text-sm text-gray-500 hidden md:block">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, totalRecords)}</span> of <span className="font-medium">{totalRecords}</span> results
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(page - 1)} 
                    disabled={page === 1}
                    className="h-9"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </Button>
                <span className="text-sm font-medium text-gray-700 md:hidden">
                    Page {page} / {totalPages}
                </span>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(page + 1)} 
                    disabled={page === totalPages || totalPages === 0}
                    className="h-9"
                >
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
      </Card>

      {/* Add Application Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Application"
      >
        <form onSubmit={handleAddApplication} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <Input 
                        placeholder="e.g. John" 
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <Input 
                        placeholder="e.g. Doe" 
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                    />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">University</label>
                    <Input 
                        placeholder="e.g. Binus University" 
                        value={formData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Major</label>
                    <Input 
                        placeholder="e.g. Computer Science" 
                        value={formData.major}
                        onChange={(e) => handleInputChange('major', e.target.value)}
                        required
                    />
                </div>
             </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Position Role</label>
                <Select
                    options={masterData.roles.map(r => ({ label: r.title, value: r.id }))}
                    placeholder="Select Role"
                    value={formData.roleId}
                    onChange={(val) => handleInputChange('roleId', val)}
                    searchable
                />
             </div>

             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Semester</label>
                <Input 
                    placeholder="e.g. 6" 
                    value={formData.semester}
                    onChange={(e) => handleInputChange('semester', e.target.value)}
                    required
                />
             </div>

             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Notes / Motivation</label>
                <Input 
                    placeholder="Brief qualification..." 
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                />
             </div>

             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Portfolio URL</label>
                <Input 
                    placeholder="https://..." 
                    value={formData.portfolioUrl}
                    onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                />
             </div>

             <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                </Button>
                <Button type="submit" className="bg-primary text-white" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Add Application"}
                </Button>
             </div>
        </form>
      </Modal>

      {/* Application Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Application Details"
      >
        {selectedApplication && (
            <div className="space-y-6">
                {/* Header Profile */}
                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                        {selectedApplication.firstName[0]}{selectedApplication.lastName[0]}
                    </div>
                    <div>
                        <Heading variant="h3">{selectedApplication.firstName} {selectedApplication.lastName}</Heading>
                        <Text variant="muted">{selectedApplication.email}</Text>
                        <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {selectedApplication.role.title}
                        </div>
                    </div>
                </div>

                {/* Status Selector - Dropdown */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-900 block">Change Status</label>
                  <Select
                        options={[
                            { label: "Pending", value: "PENDING" },
                            { label: "Reviewing", value: "REVIEWING" },
                            { label: "Accepted", value: "ACCEPTED" },
                            { label: "Rejected", value: "REJECTED" }
                        ]}
                        placeholder="Select Status"
                        value={selectedApplication.status}
                        onChange={(val) => handleUpdateStatus(val as ApplicationStatus)}
                    />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6 pt-2">
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-semibold">University</label>
                        <div className="text-sm font-medium text-gray-900 mt-1">{selectedApplication.university.name}</div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-semibold">Major</label>
                        <div className="text-sm font-medium text-gray-900 mt-1">{selectedApplication.major.name}</div>
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs text-gray-500 uppercase font-semibold">Applied Date</label>
                        <div className="text-sm font-medium text-gray-900 mt-1">{new Date(selectedApplication.createdAt).toLocaleString()}</div>
                    </div>
                    {selectedApplication.portfolioUrl && (
                        <div className="col-span-2">
                            <label className="text-xs text-gray-500 uppercase font-semibold">Portfolio</label>
                            <a 
                                href={selectedApplication.portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="block text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline mt-1 truncate"
                            >
                                {selectedApplication.portfolioUrl}
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDeleteApplication}>
                        <XCircle className="w-4 h-4 mr-2" /> Delete Application
                    </Button>
                    <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                        Close
                    </Button>
                </div>
            </div>
        )}
      </Modal>

    </div>
  )
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
    const styles = {
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
        REVIEWING: "bg-blue-100 text-blue-800 border-blue-200",
        ACCEPTED: "bg-green-100 text-green-800 border-green-200",
        REJECTED: "bg-red-100 text-red-800 border-red-200"
    }

    const icons = {
        PENDING: Clock,
        REVIEWING: AlertCircle,
        ACCEPTED: CheckCircle,
        REJECTED: XCircle
    }

    const Icon = icons[status]

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            <Icon className="w-3 h-3 mr-1" />
            {status}
        </span>
    )
}
