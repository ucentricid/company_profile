"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Briefcase, MapPin, Clock, ArrowRight, Upload, CheckCircle2, Heart, Zap, Coffee, Users, GraduationCap, Rocket, BookOpen, Laptop } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"

const BENEFITS = [
  { icon: Rocket, label: "Real-World Portfolio", desc: "Build a production-grade portfolio with real clients." },
  { icon: Users, label: "Expert Mentorship", desc: "Direct guidance from senior engineers and designers." },
  { icon: GraduationCap, label: "Skill Acceleration", desc: "Learn modern tech stacks (Next.js, Go) fast." },
  { icon: BookOpen, label: "Certificate", desc: "Official certification and recommendation letter." },
]

const ROLES = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    dept: "Engineering",
    type: "Internship (3 Months)",
    location: "Jakarta / Remote",
    tags: ["React", "TypeScript", "Tailwind"]
  },
  {
    id: 2,
    title: "UI/UX Designer Intern",
    dept: "Product Design",
    type: "Internship (3 Months)",
    location: "Hybrid",
    tags: ["Figma", "User Research", "Prototyping"]
  },
  {
    id: 3,
    title: "Content Creator Intern",
    dept: "Marketing",
    type: "Internship (3 Months)",
    location: "Remote",
    tags: ["Social Media", "Copywriting", "Video"]
  }
]

export default function CareerPage() {
  const [selectedRole, setSelectedRole] = React.useState<number | null>(null)

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
                  {ROLES.map((role) => (
                     <motion.div
                        key={role.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedRole(role.id)}
                        className={cn(
                           "cursor-pointer p-6 rounded-2xl border transition-all duration-300 group relative overflow-hidden",
                           selectedRole === role.id 
                              ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20" 
                              : "bg-card border-border hover:border-primary/50 hover:bg-muted/30"
                        )}
                     >
                        <div className="flex justify-between items-start mb-2 relative z-10">
                           <div>
                              <h4 className="font-bold text-lg">{role.title}</h4>
                              <p className={cn("text-sm mt-1", selectedRole === role.id ? "text-primary-foreground/90" : "text-muted-foreground")}>
                                 {role.dept}
                              </p>
                           </div>
                           {selectedRole === role.id && <CheckCircle2 className="w-6 h-6" />}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4 relative z-10">
                           <Badge variant="secondary" className={cn("backdrop-blur-md border-transparent font-normal", selectedRole === role.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground")}>
                              {role.type}
                           </Badge>
                           <Badge variant="secondary" className={cn("backdrop-blur-md border-transparent font-normal", selectedRole === role.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground")}>
                              {role.location}
                           </Badge>
                        </div>
                     </motion.div>
                  ))}
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
                                 ? `Applying for: ${ROLES.find(r => r.id === selectedRole)?.title}` 
                                 : "Please select a role from the list on the left to begin."}
                           </p>
                        </div>

                        <form className="space-y-6">
                           <div className="grid grid-cols-2 gap-6">
                              <FormGroup label="First Name" />
                              <FormGroup label="Last Name" />
                           </div>
                           
                           <FormGroup label="Email Address" type="email" placeholder="student@university.edu" />
                           <FormGroup label="University / School" placeholder="e.g. Universitas Indonesia" />
                           
                           <div className="grid grid-cols-2 gap-6">
                              <FormGroup label="Major / Department" placeholder="e.g. Computer Science" />
                              <FormGroup label="Current Semester" placeholder="e.g. 5th Semester" />
                           </div>

                           <FormGroup label="Portfolio / GitHub URL" placeholder="https://..." />
                           
                           <div className="space-y-3">
                              <label className="text-sm font-medium text-foreground ml-1">Why do you want to join Ucentric?</label>
                              <textarea 
                                 className="w-full min-h-[100px] rounded-xl bg-background/50 border-input p-4 text-sm focus:ring-primary/50 resize-none border focus:outline-none"
                                 placeholder="Tell us about your motivation and what you hope to learn..."
                              />
                           </div>

                           <div className="space-y-3">
                              <label className="text-sm font-medium text-foreground ml-1">Resume / CV</label>
                              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer group">
                                 <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all mb-3">
                                    <Upload className="w-5 h-5" />
                                 </div>
                                 <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                                 <p className="text-xs text-muted-foreground mt-1">PDF, DOCX up to 10MB</p>
                              </div>
                           </div>

                           <div className="pt-4">
                              <Button size="lg" className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20" disabled={!selectedRole}>
                                 Submit Internship Application <ArrowRight className="ml-2 w-5 h-5" />
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

function FormGroup({ label, type = "text", placeholder }: { label: string, type?: string, placeholder?: string }) {
   return (
      <div className="space-y-2">
         <label className="text-sm font-medium text-foreground ml-1">{label}</label>
         <Input 
            type={type} 
            placeholder={placeholder || label}
            className="h-12 rounded-xl bg-background/50 border-input focus:ring-primary/50"
         />
      </div>
   )
}

