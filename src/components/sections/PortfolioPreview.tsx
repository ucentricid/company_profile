"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

const FEATURED_PROJECTS = [
  {
    title: "E-Commerce Super App",
    category: "Retail",
    image: "bg-gradient-to-br from-blue-600 to-indigo-700",
    stats: "5M+ Users"
  },
  {
    title: "Smart Factory IoT",
    category: "Manufacturing",
    image: "bg-gradient-to-br from-emerald-600 to-teal-700",
    stats: "20% Efficiency"
  },
  {
    title: "Fintech Core Banking",
    category: "Finance",
    image: "bg-gradient-to-br from-indigo-900 to-slate-800",
    stats: "Bank Grade"
  }
]

export function PortfolioPreview() {
  return (
    <Section className="bg-background py-24">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
           <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
           >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
                 <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                 Selected Work
              </div>
              <Heading variant="h2">
                 Impactful <span className="text-primary">Results</span>
              </Heading>
           </motion.div>

           <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
           >
              <Button asChild variant="outline" className="rounded-full hidden md:inline-flex">
                 <Link href="/portfolio">
                    View All Projects <ArrowRight className="ml-2 w-4 h-4" />
                 </Link>
              </Button>
           </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           {FEATURED_PROJECTS.map((project, index) => (
              <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                 <Link href="/portfolio" className="block group h-full">
                    <Card className="h-full overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 group-hover:shadow-xl bg-card">
                       {/* Image Placeholder */}
                       <div className={`h-48 w-full ${project.image} relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                          <div className="absolute top-4 right-4">
                             <Badge className="bg-white/90 text-black backdrop-blur-md shadow-sm border-none">
                                {project.stats}
                             </Badge>
                          </div>
                       </div>
                       
                       <CardContent className="p-6">
                          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                             {project.category}
                          </div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                             {project.title}
                             <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                          </h3>
                       </CardContent>
                    </Card>
                 </Link>
              </motion.div>
           ))}
        </div>

        <div className="md:hidden text-center">
           <Button asChild className="rounded-full w-full">
              <Link href="/portfolio">
                 View All Projects <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
           </Button>
        </div>

      </div>
    </Section>
  )
}
