"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Briefcase, ArrowRight, Upload, CheckCircle2, Users, GraduationCap, Rocket, BookOpen } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const BENEFITS = [
  { icon: Rocket, label: "Real-World Portfolio", desc: "Build a production-grade portfolio with real clients." },
  { icon: Users, label: "Expert Mentorship", desc: "Direct guidance from senior engineers and designers." },
  { icon: GraduationCap, label: "Skill Acceleration", desc: "Learn modern tech stacks (Next.js, Go) fast." },
  { icon: BookOpen, label: "Certificate", desc: "Official certification and recommendation letter." },
]

interface Role {
  id: string
  title: string
  department: string
  type: string
  location: string
  slug?: string
  requirements?: string[]
  responsibilities?: string[]
}

interface CareerPageClientProps {
  initialSlug?: string
}

export default function CareerPageClient({ initialSlug }: CareerPageClientProps) {
  const router = useRouter()
  const [roles, setRoles] = React.useState<Role[]>([])
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    university: "",
    major: "",
    semester: "",
    portfolioUrl: "",
    motivation: ""
  })

  // Fetch Master Data
  React.useEffect(() => {
    fetchMasterData()
  }, [])

  // Handle Initial Url Slug
  React.useEffect(() => {
    if (initialSlug && roles.length > 0) {
        const role = roles.find(r => r.slug === initialSlug)
        if (role) {
            setSelectedRole(role.id)
        }
    }
  }, [initialSlug, roles])

  const fetchMasterData = async () => {
    try {
      const res = await fetch("/api/master-data")
      if (res.ok) {
        const data = await res.json()
        const mappedRoles = data.roles.map((r: any) => ({
            id: r.id,
            title: r.title,
            department: r.department || "Engineering",
            type: r.type || "Internship", 
            location: r.location || "Remote",
            slug: r.slug,
            requirements: r.requirements || [],
            responsibilities: r.responsibilities || []
        }))
        setRoles(mappedRoles)
      }
    } catch (error) {
      console.error("Failed to fetch roles", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleSelect = (role: Role) => {
      // Toggle if already selected, otherwise select
      if (selectedRole === role.id) {
          // Optional: setSelectedRole(null) if we want to allow collapsing
          // But for this flow, maybe keep it selected to show the form context?
          // Let's just keep it simple: clicking always selects.
          // Actually, let's allow toggling for the "accordion" feel if they want to close it.
          // But the form on the right depends on selection. So keep it selected.
      } else {
          setSelectedRole(role.id)
          if (role.slug) {
             router.push(`/career/${role.slug}`, { scroll: false })
          }
      }
  }

  // ... (rest of the component logic: handleInputChange, handleSubmit, render)
  // I will copy the full render logic next.

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return

    setIsSubmitting(true)
    try {
        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            universityName: formData.university,
            majorName: formData.major,
            semester: formData.semester,
            roleId: selectedRole,
            motivation: formData.motivation,
            portfolioUrl: formData.portfolioUrl || "",
            cvUrl: ""
        }

        const res = await fetch("/api/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })

        if (!res.ok) {
            const error = await res.json()
            const errorDetails = error.errors ? "\n" + error.errors.map((e: any) => `- ${e.path.join('.')}: ${e.message}`).join("\n") : ""
            alert(`Error: ${error.message || "Failed to submit application"}${errorDetails}`)
            return
        }

        alert("Application submitted successfully! We will contact you soon.")
        
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            university: "",
            major: "",
            semester: "",
            portfolioUrl: "",
            motivation: ""
        })
        // Optional: Deselect role or redirect? Keeping selection is usually better.

    } catch (error) {
        console.error("Submission failed", error)
        alert("An unexpected error occurred. Please try again.")
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-12 bg-background relative selection:bg-primary/20 selection:text-primary">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[100px] -z-10" />
      <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] -z-10" />

      {/* Hero Section */}
      <Section className="pt-8 pb-10 text-center relative">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
         >
            <Badge variant="secondary" className="mb-6 px-4 py-1 text-primary bg-primary/10 hover:bg-primary/20 border-primary/20">
               Campus Hiring Program
            </Badge>
            <Heading variant="h1" className="mb-6 text-foreground text-5xl md:text-7xl">
               Start Your Career <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Before You Graduate.</span>
            </Heading>
            <Text className="text-muted-foreground text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
               Join Ucentric's Internship Program to gain real-world experience, build a standout portfolio, and learn from the best in the industry.
            </Text>
         </motion.div>
      </Section>

      {/* Benefits */}
      <Section id="culture" className="py-8 -mt-6 relative z-10">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-4">
            {BENEFITS.map((benefit, i) => (
               <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
               >
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                     <CardContent className="p-6 text-center h-full flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                           <benefit.icon className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-foreground">{benefit.label}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                     </CardContent>
                  </Card>
               </motion.div>
            ))}
         </div>
      </Section>

      {/* Roles & Application Form Split */}
      <Section className="py-12">
         <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-12">
            
            {/* Left: Open Roles List */}
            <div className="lg:col-span-5 space-y-8">
               <div>
                  <h3 className="text-3xl font-bold mb-6 flex items-center gap-3 text-foreground">
                     <Briefcase className="w-8 h-8 text-primary" /> 
                     Open Internships
                  </h3>
                  <p className="text-muted-foreground mb-8">
                     Select a role to view details and apply. Positions are limited for the upcoming batch.
                  </p>
               </div>

               <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-10 text-muted-foreground">Loading roles...</div>
                  ) : roles.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">No open positions at the moment.</div>
                  ) : (
                    roles.map((role) => (
                        <motion.div
                            key={role.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleRoleSelect(role)}
                            className={cn(
                            "cursor-pointer p-6 rounded-2xl border transition-all duration-300 group relative overflow-hidden",
                            selectedRole === role.id 
                                ? "bg-primary/5 text-foreground border-primary shadow-xl shadow-primary/20" 
                                : "bg-card border-border hover:border-primary/50 hover:bg-muted/30"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2 relative z-10">
                            <div>
                                <h4 className="font-bold text-lg">{role.title}</h4>
                                <p className={cn("text-sm mt-1", selectedRole === role.id ? "text-primary" : "text-muted-foreground")}>
                                    {role.department}
                                </p>
                            </div>
                            {selectedRole === role.id ? (
                                <CheckCircle2 className="w-6 h-6 text-primary" />
                            ) : (
                                <Badge variant="secondary" className="bg-muted text-muted-foreground">{role.location}</Badge>
                            )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-4 relative z-10">
                            <Badge variant="secondary" className={cn("backdrop-blur-md border-transparent font-normal", selectedRole === role.id ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground")}>
                                {role.type}
                            </Badge>
                            {selectedRole !== role.id && (
                                <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal">
                                    Click to View Details
                                </Badge>
                            )}
                            </div>

                            {/* Accordion Content */}
                            <motion.div
                                initial={false}
                                animate={{ height: selectedRole === role.id ? "auto" : 0, opacity: selectedRole === role.id ? 1 : 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="max-h-[350px] overflow-y-auto overflow-x-hidden pr-2 pt-6 mt-6 border-t border-border/50 space-y-6 custom-scrollbar w-full">
                                    {role.responsibilities && role.responsibilities.length > 0 && (
                                        <div className="w-full">
                                            <h5 className="font-bold text-sm mb-3 text-foreground flex items-center gap-2">
                                                <Rocket className="w-4 h-4 text-primary shrink-0" /> What You Will Do
                                            </h5>
                                            <ul className="space-y-2 w-full">
                                                {role.responsibilities.map((resp, idx) => (
                                                    <li key={idx} className="text-sm text-muted-foreground relative pl-4 break-words whitespace-normal">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50 absolute left-0 top-2 shrink-0" />
                                                        <span className="block">{resp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    {role.requirements && role.requirements.length > 0 && (
                                        <div className="w-full">
                                            <h5 className="font-bold text-sm mb-3 text-foreground flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4 text-primary shrink-0" /> Requirements
                                            </h5>
                                            <ul className="space-y-2 w-full">
                                                {role.requirements.map((req, idx) => (
                                                    <li key={idx} className="text-sm text-muted-foreground relative pl-5 break-words whitespace-normal">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 absolute left-0 top-1 shrink-0" />
                                                        <span className="block">{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    ))
                  )}
               </div>
            </div>

            {/* Right: Application Form (Sticky) */}
            <div className="lg:col-span-7">
               <div className="sticky top-32">
                  <Card className="border-border shadow-2xl bg-card relative overflow-hidden">
                     {/* Top Accents */}
                     <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-orange-500" />
                     
                     <CardContent className="p-8 md:p-10">
                        <div className="mb-8">
                           <h3 className="text-2xl font-bold mb-2 text-foreground">Internship Application</h3>
                           <p className="text-muted-foreground">
                              {selectedRole 
                                 ? `Applying for: ${roles.find(r => r.id === selectedRole)?.title}` 
                                 : "Please select a role from the list on the left to begin."}
                           </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                           <div className="grid grid-cols-2 gap-6">
                              <FormGroup 
                                label="First Name" 
                                value={formData.firstName}
                                onChange={(val) => handleInputChange("firstName", val)}
                                required
                              />
                              <FormGroup 
                                label="Last Name" 
                                value={formData.lastName}
                                onChange={(val) => handleInputChange("lastName", val)}
                                required
                              />
                           </div>
                           
                           <FormGroup 
                            label="Email Address" 
                            type="email" 
                            placeholder="student@university.edu" 
                            value={formData.email}
                            onChange={(val) => handleInputChange("email", val)}
                            required
                           />
                           <FormGroup 
                            label="University / School" 
                            placeholder="e.g. Universitas Indonesia" 
                            value={formData.university}
                            onChange={(val) => handleInputChange("university", val)}
                            required
                           />
                           
                           <div className="grid grid-cols-2 gap-6">
                              <FormGroup 
                                label="Major / Department" 
                                placeholder="e.g. Computer Science" 
                                value={formData.major}
                                onChange={(val) => handleInputChange("major", val)}
                                required
                              />
                              <FormGroup 
                                label="Current Semester" 
                                placeholder="e.g. 5th Semester" 
                                value={formData.semester}
                                onChange={(val) => handleInputChange("semester", val)}
                                required
                              />
                           </div>

                           <FormGroup 
                            label="Portfolio / GitHub URL" 
                            placeholder="https://..." 
                            value={formData.portfolioUrl}
                            onChange={(val) => handleInputChange("portfolioUrl", val)}
                           />
                           
                           <div className="space-y-3">
                              <label className="text-sm font-medium text-foreground ml-1">Why do you want to join Ucentric?</label>
                              <textarea 
                                 className="w-full min-h-[100px] rounded-xl bg-background/50 border-input p-4 text-sm focus:ring-primary/50 resize-none border focus:outline-none"
                                 placeholder="Tell us about your motivation and what you hope to learn..."
                                 value={formData.motivation}
                                 onChange={(e) => handleInputChange("motivation", e.target.value)}
                                 required
                              />
                           </div>

                           {/* Resume Upload Hidden */}

                           <div className="pt-4">
                              <Button 
                                size="lg" 
                                className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20" 
                                disabled={!selectedRole || isSubmitting}
                                type="submit"
                              >
                                 {isSubmitting ? "Submitting..." : (
                                    <>
                                        Submit Internship Application <ArrowRight className="ml-2 w-5 h-5" />
                                    </>
                                 )}
                              </Button>
                              <p className="text-xs text-muted-foreground text-center mt-4">
                                 By submitting, you agree that this is an unpaid internship focused on learning and portfolio application.
                              </p>
                           </div>
                        </form>
                     </CardContent>
                  </Card>
               </div>
            </div>

         </div>
      </Section>
    </main>
  )
}

function FormGroup({ 
    label, 
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    required 
}: { 
    label: string, 
    type?: string, 
    placeholder?: string,
    value?: string,
    onChange?: (val: string) => void,
    required?: boolean
}) {
   return (
      <div className="space-y-2">
         <label className="text-sm font-medium text-foreground ml-1">
            {label} {required && <span className="text-red-500">*</span>}
         </label>
         <Input 
            type={type} 
            placeholder={placeholder || label}
            className="h-12 rounded-xl bg-background/50 border-input focus:ring-primary/50"
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            required={required}
         />
      </div>
   )
}
