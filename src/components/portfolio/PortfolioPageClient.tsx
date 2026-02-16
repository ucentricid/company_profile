"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Building2, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"

// --- Mock Data ---
const CATEGORIES = ["Company Projects", "Ucentric Academy"] as const
type Category = typeof CATEGORIES[number]

const PROJECTS = [
  {
    id: 1,
    title: "E-Commerce Super App",
    category: "Company Projects",
    client: "Retail Giant Indonesia",
    image: "bg-gradient-to-br from-blue-600 to-indigo-700", // Placeholder
    tags: ["Mobile App", "High Scale", "Flutter"],
    description: "A complete overhaul of the digital shopping experience for 5M+ users, featuring real-time inventory and AI recommendations.",
    stats: "5M+ Downloads"
  },
  {
    id: 2,
    title: "Smart Factory IoT Dashboard",
    category: "Company Projects",
    client: "Manufaktur Tbk",
    image: "bg-gradient-to-br from-emerald-600 to-teal-700", // Placeholder
    tags: ["Web Dashboard", "IoT", "Real-time"],
    description: "Monitoring 500+ machines in real-time to predict maintenance needs and optimize production output.",
    stats: "20% Efficiency"
  },
  {
    id: 3,
    title: "Fintech Core Banking",
    category: "Company Projects",
    client: "National Bank",
    image: "bg-gradient-to-br from-indigo-900 to-slate-800", // Placeholder
    tags: ["Backend", "Security", "Microservices"],
    description: "Modernizing legacy banking infrastructure to support high-frequency digital transactions with bank-grade security.",
    stats: "99.99% Uptime"
  },
  {
    id: 101,
    title: "AR Campus Tour",
    category: "Ucentric Academy",
    author: "Intern Batch #12",
    image: "bg-gradient-to-br from-orange-400 to-pink-500",
    tags: ["Augmented Reality", "Mobile", "Unity"],
    description: "An experimental AR app allowing new students to explore the campus and find classrooms using their phone camera.",
    stats: "Best Innovation"
  },
  {
    id: 102,
    title: "Sentiment Analysis Bot",
    category: "Ucentric Academy",
    author: "Intern Batch #11",
    image: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
    tags: ["AI/ML", "Python", "NLP"],
    description: "A tool that analyzes social media mentions to determine brand sentiment automatically.",
    stats: "92% Accuracy"
  },
  {
    id: 103,
    title: "Gamified Learning Platform",
    category: "Ucentric Academy",
    author: "Intern Batch #13",
    image: "bg-gradient-to-br from-cyan-400 to-blue-500",
    tags: ["Web", "Gamification", "React"],
    description: "Making learning fun for elementary students through interactive quizzes and reward systems.",
    stats: "Top Design"
  }
]

export default function PortfolioPageClient() {
  const [activeTab, setActiveTab] = React.useState<Category>("Company Projects")

  const filteredProjects = PROJECTS.filter(p => p.category === activeTab)

  return (
    <main className="min-h-screen pt-24 pb-12 bg-background relative selection:bg-primary/20 selection:text-primary">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-primary/5 blur-[150px] -z-10 opacity-60" />
      <div className="absolute top-40 right-10 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -z-10" />

      <Section className="py-0 relative z-10">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
            >
               <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-bold text-primary mb-6 backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-3 animate-pulse" />
                  Our Work
               </div>
               <Heading variant="h1" className="mb-6">
                  Building the <span className="text-primary">Future</span>, <br />
                  One Project at a Time.
               </Heading>
               <Text variant="muted" className="text-lg md:text-xl">
                  From enterprise-grade platforms to experimental innovations, explore how we transform ideas into digital reality.
               </Text>
            </motion.div>

            {/* Premium Tab Switcher */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="mt-10 inline-flex p-1.5 rounded-full bg-background/40 border border-white/10 backdrop-blur-md relative shadow-2xl shadow-black/20"
            >
               {CATEGORIES.map((tab) => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={cn(
                        "relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 z-10",
                        activeTab === tab ? "text-white" : "text-muted-foreground hover:text-primary"
                     )}
                  >
                     {activeTab === tab && (
                        <motion.div
                           layoutId="activeTab"
                           className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/25 -z-10"
                           transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                     )}
                     <span className="flex items-center gap-2">
                        {tab === "Company Projects" ? <Building2 className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                        {tab}
                     </span>
                  </button>
               ))}
            </motion.div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                   <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                   >
                      <ProjectCard project={project} />
                   </motion.div>
                ))}
            </AnimatePresence>
          </div>
          
          {/* Empty State / CTA if needed */}
          {filteredProjects.length === 0 && (
             <div className="text-center py-20">
                <Text variant="muted">No projects found in this category yet.</Text>
             </div>
          )}

        </div>
      </Section>
    </main>
  )
}

function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
   const isCompany = project.category === "Company Projects"

   return (
      <Link href={`/portfolio/${project.id}`} className="block h-full group">
         <Card variant="glass" className="h-full overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/5 bg-card/40 hover:bg-card/60">
            {/* Image Area - Placeholder Gradient */}
            <div className={`h-64 w-full ${project.image} relative overflow-hidden`}>
               <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
               
               {/* Hover Overlay */}
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                  <div className="px-6 py-2 bg-white/90 text-black font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                     View Case Study
                  </div>
               </div>

               {/* Stats / Badge */}
               <div className="absolute top-4 right-4">
                  <Badge className={cn("backdrop-blur-md shadow-sm border-none", isCompany ? "bg-white/90 text-black" : "bg-black/50 text-white")}>
                     {project.stats}
                  </Badge>
               </div>
            </div>

            <CardContent className="p-6">
               <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                     <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-secondary text-secondary-foreground border border-border/50">
                        {tag}
                     </span>
                  ))}
               </div>

               <div className="mb-2">
                  <span className="text-xs font-medium text-muted-foreground block mb-1">
                     {isCompany ? `Client: ${project.client}` : `By: ${project.author}`}
                  </span>
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                     {project.title}
                     <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                  </h3>
               </div>

               <Text variant="muted" className="line-clamp-3 text-sm leading-relaxed">
                  {project.description}
               </Text>
            </CardContent>
         </Card>
      </Link>
   )
}
