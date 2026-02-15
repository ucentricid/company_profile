"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, CheckCircle2, Trophy, Users, Zap } from "lucide-react"
import Link from "next/link"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { cn } from "@/lib/utils"

export function About() {
  const containerRef = React.useRef(null)
  
  return (
    <Section ref={containerRef} id="about" className="bg-background relative">
       {/* Ambient Elements */}
       <div className="absolute top-0 left-1/4 -z-10 h-[600px] w-[600px] bg-primary/5 blur-[120px] rounded-full opacity-40 mix-blend-screen" />
       
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Left Column - Headline & Story */}
            <div className="space-y-8 relative z-10">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
               >
                   <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
                      <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                      About Ucentric
                   </div>
                   <Heading variant="h1" className="mb-6 leading-tight">
                      We don't just build.<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
                        We engineer impact.
                      </span>
                   </Heading>
                   <Text variant="muted" className="text-lg md:text-xl max-w-xl">
                      Born from a passion for precision and a drive for innovation, Ucentric is a technology partner that transforms complex challenges into elegant digital solutions.
                   </Text>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="space-y-4"
               >
                  {[
                    "Human-Centric Design Philosophy",
                    "Enterprise-Grade Engineering",
                    "Agile & Scalable Architecture"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground/80">{item}</span>
                    </div>
                  ))}
               </motion.div>


            </div>

            {/* Right Column - Bento Grid Visuals */}
            <div className="relative">
               {/* Abstract decorative blobs behind grid */}
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-blue-500/10 rounded-full blur-3xl opacity-50 -z-10" />

               <div className="grid grid-cols-2 gap-4">
                  {/* Card 1: Projects */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="col-span-2 md:col-span-1"
                  >
                     <Card className="h-full border-border bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-300">
                        <CardContent className="p-6 flex flex-col items-center text-center justify-center h-full">
                           <div className="mb-3 p-3 bg-orange-500/10 rounded-2xl text-orange-500">
                              <Trophy className="w-8 h-8" />
                           </div>
                           <h4 className="text-4xl font-bold text-orange-500">100+</h4>
                           <p className="text-sm font-medium text-muted-foreground dark:text-zinc-200 mt-1">Projects Delivered</p>
                        </CardContent>
                     </Card>
                  </motion.div>

                  {/* Card 2: Satisfaction */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="col-span-2 md:col-span-1"
                  >
                     <Card className="h-full border-border bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-300">
                        <CardContent className="p-6 flex flex-col items-center text-center justify-center h-full">
                           <div className="mb-3 p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                              <Users className="w-8 h-8" />
                           </div>
                           <h4 className="text-4xl font-bold text-orange-500">98%</h4>
                           <p className="text-sm font-medium text-muted-foreground dark:text-zinc-200 mt-1">Client Satisfaction</p>
                        </CardContent>
                     </Card>
                  </motion.div>

                  {/* Card 3: Experience (Wide) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="col-span-2"
                  >
                     <Card className="overflow-hidden border-orange-500/10 bg-gradient-to-br from-orange-500/5 to-primary/5">
                        <CardContent className="p-8 flex items-center justify-between">
                            <div className="space-y-1">
                               <p className="text-sm font-bold uppercase tracking-wider text-orange-600">Experience</p>
                               <h4 className="text-3xl font-bold text-foreground">5+ Years</h4>
                               <p className="text-muted-foreground text-sm">Of defining digital excellence</p>
                            </div>
                            <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/25 animate-pulse">
                               <Zap className="w-8 h-8 text-white" />
                            </div>
                        </CardContent>
                     </Card>
                  </motion.div>
               </div>
            </div>

      </div>
    </Section>
  )
}
