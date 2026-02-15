"use client"

import { useState } from "react"
import { Heading, Text } from "@/components/ui/Typography"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { Select } from "@/components/ui/Select"
import { Search, Filter, Eye, CheckCircle, XCircle, FileText, Plus, Upload, Code, PenTool, Video, Server } from "lucide-react"

// Dummy Data for visualization
const APPLICATIONS = [
  { id: 1, name: "Alice Johnson", role: "Frontend Developer Intern", university: "Universitas Indonesia", status: "PENDING", date: "2 mins ago" },
  { id: 2, name: "Bob Smith", role: "UI/UX Designer Intern", university: "ITB", status: "REVIEWED", date: "1 hour ago" },
  { id: 3, name: "Charlie Brown", role: "Content Creator Intern", university: "Binus University", status: "REJECTED", date: "Yesterday" },
  { id: 4, name: "Diana Prince", role: "Frontend Developer Intern", university: "UGM", status: "ACCEPTED", date: "2 days ago" },
  { id: 5, name: "Evan Wright", role: "Backend Developer Intern", university: "ITS", status: "PENDING", date: "3 days ago" },
]

export default function ApplicationsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Heading variant="h2">Internship Applications</Heading>
          <Text variant="muted">Manage and review incoming applications.</Text>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="bg-white">
              <Filter className="w-4 h-4 mr-2" /> Filter
           </Button>
           <Button 
              className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-orange-500/20"
              onClick={() => setIsAddModalOpen(true)}
           >
              <Plus className="w-4 h-4 mr-2" /> Add Manual Application
           </Button>
        </div>
      </div>

      {/* Search & Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
         <Card className="md:col-span-1 shadow-sm border-none bg-white">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Total Applicants</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">142</div>
               <p className="text-xs text-green-500 font-medium">+12 today</p>
            </CardContent>
         </Card>
         <Card className="md:col-span-1 shadow-sm border-none bg-white">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-orange-500">28</div>
               <p className="text-xs text-muted-foreground">Action needed</p>
            </CardContent>
         </Card>
         <Card className="md:col-span-2 shadow-sm border-none bg-white flex flex-col justify-center px-6">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input 
                  placeholder="Search applicants by name, university, or role..." 
                  className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-all rounded-lg"
               />
            </div>
         </Card>
      </div>

      {/* Applications Table */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
                  <tr>
                     <th className="px-6 py-4">Applicant Name</th>
                     <th className="px-6 py-4">Role Applied</th>
                     <th className="px-6 py-4">University</th>
                     <th className="px-6 py-4">Applied Date</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {APPLICATIONS.map((app) => (
                     <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4 font-medium text-gray-900">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                 {app.name.charAt(0)}
                              </div>
                              {app.name}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{app.role}</td>
                        <td className="px-6 py-4 text-gray-500">{app.university}</td>
                        <td className="px-6 py-4 text-gray-500">{app.date}</td>
                        <td className="px-6 py-4">
                           <StatusBadge status={app.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View Details">
                                 <FileText className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors" title="Approve">
                                 <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Reject">
                                 <XCircle className="w-4 h-4" />
                              </Button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>

      {/* Manual Entry Modal */}
      <Modal 
         isOpen={isAddModalOpen} 
         onClose={() => setIsAddModalOpen(false)} 
         title="Add Manual Application"
         description="Manually enter details for an applicant (e.g. from email)."
         maxWidth="max-w-2xl"
      >
         <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <Input placeholder="John" className="bg-gray-50" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <Input placeholder="Doe" className="bg-gray-50" />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">Email Address</label>
               <Input type="email" placeholder="john.doe@example.com" className="bg-gray-50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">University</label>
                  <Input placeholder="University Name" className="bg-gray-50" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Major</label>
                  <Input placeholder="Computer Science" className="bg-gray-50" />
               </div>
            </div>

            <Select 
               label="Role Applied For"
               placeholder="Select a position..."
               value={selectedRole}
               onChange={setSelectedRole}
               options={[
                  { label: "Frontend Developer Intern", value: "frontend", icon: Code },
                  { label: "UI/UX Designer Intern", value: "uiux", icon: PenTool },
                  { label: "Content Creator Intern", value: "content", icon: Video },
                  { label: "Backend Developer Intern", value: "backend", icon: Server },
               ]}
            />

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">Motivation / Notes</label>
               <textarea className="w-full min-h-[80px] rounded-md border border-input bg-gray-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Applicant's motivation or HR notes..." />
            </div>

            <div className="space-y-4">
               <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Resume / CV <span className="text-red-500">*</span></label>
                  <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 hover:border-primary/50 transition-all cursor-pointer group">
                     <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 group-hover:text-primary transition-colors">
                        <Upload className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                     </div>
                     <p className="text-sm font-medium text-gray-700 text-center">Click to upload or drag and drop</p>
                     <p className="text-xs text-gray-400">PDF, DOCX up to 10MB</p>
                  </label>
               </div>
               
               <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Portfolio URL <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span></label>
                  <Input placeholder="https://..." className="bg-gray-50" />
               </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
               <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
               <Button type="submit" className="bg-primary text-white hover:bg-primary/90">Add Applicant</Button>
            </div>
         </form>
      </Modal>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
   const styles: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      REVIEWED: "bg-blue-100 text-blue-700 border-blue-200",
      ACCEPTED: "bg-green-100 text-green-700 border-green-200",
      REJECTED: "bg-red-100 text-red-700 border-red-200",
   }
   
   return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.PENDING}`}>
         {status}
      </span>
   )
}
