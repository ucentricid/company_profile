"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Plus, Search, Edit2, Trash2, Shield, User, Users as UsersIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import { Heading, Text } from "@/components/ui/Typography"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Modal } from "@/components/ui/Modal"
import { Select } from "@/components/ui/Select"
import Swal from "sweetalert2"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin" | "superadmin"
  image?: string
}

export default function UsersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users")
      if (res.ok) {
        const result = await res.json()
        setUsers(result.data)
      } else {
        // Handle unauthorized or error
        if (res.status === 403) {
            router.push("/dashboard")
        }
      }
    } catch (error) {
      console.error("Failed to fetch users", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // Don't show password
        role: user.role
      })
    } else {
      setEditingUser(null)
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user"
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = "/api/users"
      const method = editingUser ? "PUT" : "POST"
      const body = editingUser 
        ? { id: editingUser.id, ...formData } 
        : formData

      // Remove empty password if editing
      if (editingUser && !formData.password) {
        delete (body as any).password
      }

      // Validate Password
      if (formData.password && formData.password.length < 8) {
          throw new Error("Password must be at least 8 characters long")
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Operation failed")
      }

      await fetchUsers()
      setIsModalOpen(false)
      
      // Use Toast for success here too if we want consistency, but user asked for "SweetAlert" for validation info maybe?
      // "validasi nya misal minimal berapa character" -> helper text.
      // "bagusan pake input form atau teksarea" -> handled.
      // "toast nya jika update di role, terus kalau setelah add juga ada toastnya.. kamu harusnya tau kapan pake yang sweetalert kapan pake yang toast"
      // User implies toasts for success/non-intrusive updates, and SweetAlert (modal) for errors or major confirmations (like delete).
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      })

      Toast.fire({
        icon: 'success',
        title: `User ${editingUser ? 'updated' : 'created'} successfully`
      })

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Something went wrong',
        confirmButtonColor: '#f97316'
      })
    }
  }

  const handleDelete = async (user: User) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Delete user ${user.name}? This cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
        try {
            const res = await fetch(`/api/users?id=${user.id}`, { method: "DELETE" })
            
            if (res.ok) {
                fetchUsers()
                Swal.fire('Deleted!', 'User has been deleted.', 'success')
            } else {
                const error = await res.json()
                throw new Error(error.message)
            }
        } catch (error) {
            Swal.fire('Error', error instanceof Error ? error.message : 'Failed to delete', 'error')
        }
    }
  }

  const getInitials = (name: string) => {
      return name
          .split(' ')
          .map(n => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination Logic
  const currentPageVal = 1; // Default
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5) // Adjust size

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage)
    }
  }

  if (loading) return <div className="p-8">Loading users...</div>

  // Basic client-side protection for UI (API is also protected)
  if (session?.user?.role !== "admin" && session?.user?.role !== "superadmin") {
      return <div className="p-8 text-red-500">Access Denied</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Heading variant="h2">User Management</Heading>
          <Text variant="muted">Manage system users, admins, and roles.</Text>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5 mr-2" /> Add New User
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
             <div className="relative w-full md:w-72">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <Input 
                   placeholder="Search users..." 
                   className="pl-9"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
             </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 bg-primary/10 border border-primary/10">
                              {user.image ? (
                                  <AvatarImage src={user.image} alt={user.name} />
                              ) : null}
                              <AvatarFallback className="text-primary font-medium text-xs">
                                  {getInitials(user.name)}
                              </AvatarFallback>
                          </Avatar>
                          <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={
                          user.role === 'superadmin' ? "bg-purple-100 text-purple-700 hover:bg-purple-100" :
                          user.role === 'admin' ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                          "bg-gray-100 text-gray-700 hover:bg-gray-100"
                      }>
                          {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenModal(user)}>
                              <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                              onClick={() => handleDelete(user)}
                              disabled={user.id === session?.user?.id}
                          >
                              <Trash2 className="w-4 h-4" />
                          </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
             {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No users found.</div>
             ) : (
                paginatedUsers.map((user) => (
                  <div key={user.id} className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-primary/10 border border-primary/10">
                              {user.image ? (
                                  <AvatarImage src={user.image} alt={user.name} />
                              ) : null}
                              <AvatarFallback className="text-primary font-medium text-sm">
                                  {getInitials(user.name)}
                              </AvatarFallback>
                        </Avatar>
                        <div>
                           <div className="font-medium text-gray-900">{user.name}</div>
                           <div className="text-xs text-gray-500 mb-1">{user.email}</div>
                           <Badge variant="secondary" className={
                                user.role === 'superadmin' ? "bg-purple-100 text-purple-700 hover:bg-purple-100 text-[10px] px-1.5 py-0" :
                                user.role === 'admin' ? "bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] px-1.5 py-0" :
                                "bg-gray-100 text-gray-700 hover:bg-gray-100 text-[10px] px-1.5 py-0"
                            }>
                                {user.role}
                            </Badge>
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleOpenModal(user)}>
                              <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                              onClick={() => handleDelete(user)}
                              disabled={user.id === session?.user?.id}
                          >
                              <Trash2 className="w-4 h-4" />
                          </Button>
                     </div>
                  </div>
                ))
             )}
          </div>
          
            {/* Pagination Controls */}
            {filteredUsers.length > 0 && (
                <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between">
                    <div className="text-sm text-gray-500 hidden md:block">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> results
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
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit User" : "Add New User"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!!editingUser} // Prevent changing email for simplicity
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                    options={[
                        { label: "User", value: "user", icon: User },
                        { label: "Admin", value: "admin", icon: Shield },
                        { label: "Super Admin", value: "superadmin", icon: UsersIcon }
                    ]}
                    value={formData.role}
                    onChange={(val) => setFormData({...formData, role: val})}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    {editingUser ? "New Password (leave blank to keep)" : "Password"}
                </label>
                <Input 
                    type="password" 
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder={editingUser ? "********" : "Enter password"}
                />
                <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                </Button>
                <Button type="submit">
                    {editingUser ? "Save Changes" : "Create User"}
                </Button>
            </div>
        </form>
      </Modal>
    </div>
  )
}
