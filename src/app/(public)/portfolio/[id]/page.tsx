"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowUpRight, Calendar, Github, Globe, Layers, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"

// --- Mock Data for Demo ---
const PROJECT = {
  id: 1,
  title: "AR Campus Tour Navigation",
  type: "Intern Project",
  author: {
    name: "Rizky Ramadhan",
    role: "Mobile Developer Intern",
    batch: "Batch #12 (Aug 2025)",
    avatar: "bg-blue-500" // Placeholder color
  },
  date: "October 12, 2025",
  excerpt: "An augmented reality application that helps new students navigate the campus complex using interactive 3D markers.",
  content: `
    <p>Finding classrooms in a large university complex can be daunting for new students. This project aims to solve that problem using Augmented Reality (AR).</p>
    <br/>
    <h3>The Challenge</h3>
    <p>Traditional 2D maps are often confusing and lack context. Students needed a way to visualize their destination in the real world.</p>
    <br/>
    <h3>The Solution</h3>
    <p>We built a mobile app using Unity and AR Foundation. The app detects specific visual markers placed around campus and overlays 3D directional arrows and room information directly onto the camera feed.</p>
    <br/>
    <img src="https://images.unsplash.com/photo-1592478411213-61535fdd861d?auto=format&fit=crop&q=80&w=1000" class="w-full rounded-2xl my-8 border border-white/10" alt="AR Interface Demo" />
    <br/>
    <h3>Key Features</h3>
    <ul>
      <li>Real-time pathfinding with 3D arrows.</li>
      <li>Interactive points of interest info cards.</li>
      <li>"Find My Class" search functionality.</li>
    </ul>
  `,
  tags: ["Unity", "C#", "AR Foundation", "Mobile"],
  links: {
    demo: "#",
    repo: "#"
  },
  images: ["bg-orange-500", "bg-blue-500", "bg-purple-500"] // Placeholders
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen pt-24 pb-12 bg-background relative selection:bg-primary/20 selection:text-primary">
      {/* Back Button */}
      <div className="container mx-auto px-4 mb-8">
        <Link 
          href="/portfolio" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
        </Link>
      </div>

      <Section className="py-0 relative z-10">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <div className="max-w-4xl mb-12">
            <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5">
              {PROJECT.type}
            </Badge>
            <Heading variant="h1" className="mb-6 text-4xl md:text-6xl">
              {PROJECT.title}
            </Heading>
            <Text variant="muted" className="text-xl max-w-2xl">
              {PROJECT.excerpt}
            </Text>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Left: Content & Gallery */}
            <div className="lg:col-span-8 space-y-12">
              {/* Hero Image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`w-full aspect-video rounded-3xl overflow-hidden ${PROJECT.images[0]} relative`}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-sm font-bold">
                  Project Screenshot 01
                </div>
              </motion.div>

              {/* Rich Text Content */}
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: PROJECT.content }}
              />

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 gap-4">
                 {PROJECT.images.slice(1).map((img, i) => (
                    <div key={i} className={`aspect-video rounded-xl ${img} relative overflow-hidden group cursor-pointer`}>
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                 ))}
              </div>
            </div>

            {/* Right: Sidebar Info */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                
                {/* Author Card */}
                <Card className="border-border bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider mb-4">Created By</h3>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${PROJECT.author.avatar}`} />
                      <div>
                        <div className="font-bold text-foreground">{PROJECT.author.name}</div>
                        <div className="text-xs text-muted-foreground">{PROJECT.author.role}</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-sm text-muted-foreground">
                       <Calendar className="w-4 h-4" /> {PROJECT.author.batch}
                    </div>
                  </CardContent>
                </Card>

                {/* Tech Stack */}
                <Card className="border-border bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider mb-4">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                       {PROJECT.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="bg-background text-foreground border border-border">
                             {tag}
                          </Badge>
                       ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="space-y-3">
                   <Button className="w-full text-lg font-bold" size="lg">
                      <Globe className="w-4 h-4 mr-2" /> View Live Demo
                   </Button>
                   <Button variant="outline" className="w-full text-lg" size="lg">
                      <Github className="w-4 h-4 mr-2" /> Source Code
                   </Button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </Section>
    </main>
  )
}
