"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, ShoppingCart, GraduationCap, Package, Zap, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { cn } from "@/lib/utils"

export function ProductShowcase() {
  return (
    <Section id="products" className="bg-background relative overflow-hidden">
       {/* Ambient Background - Consistent with Hero */}
       <div className="absolute top-1/2 right-0 -z-10 h-[800px] w-[800px] -translate-y-1/2 bg-orange-500/5 blur-[120px] rounded-full opacity-60" />
       <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] bg-blue-500/5 blur-[100px] rounded-full opacity-60" />

      <div className="mb-20 flex flex-col items-center text-center space-y-4 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           viewport={{ once: true }}
        >
           <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Our Ecosystem
           </div>
           <Heading variant="h2" className="mb-4">
              <span className="text-primary">Flagship</span> Solutions
           </Heading>
           <Text variant="muted" className="max-w-2xl mx-auto text-lg">
              Powerful platforms designed to assist your specific business needs. 
           </Text>
        </motion.div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto relative z-10 mb-16">
          {/* U-Kasir Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
             <Link href="/products/u-kasir" className="block h-full">
                <Card className="group relative h-full overflow-hidden border-border bg-white hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 rounded-[2.5rem]">
                   {/* Top Highlight Bar */}
                   <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                   
                   <CardContent className="p-10 flex flex-col h-full relative z-10">
                      <div className="flex items-start justify-between mb-8">
                         <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <ShoppingCart className="w-8 h-8" />
                         </div>
                         <div className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
                            Retail POS
                         </div>
                      </div>

                      <div className="space-y-4 mb-8">
                         <h3 className="text-3xl font-bold text-foreground group-hover:text-blue-600 transition-colors">U-Kasir</h3>
                         <p className="text-lg text-muted-foreground leading-relaxed">
                            The complete Point of Sale system for modern retail. Manage inventory, track sales, and grow your business offline & online.
                         </p>
                      </div>

                      <div className="space-y-3 mb-8 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                         {["Real-time Stock Management", "QRIS & Multi-payment", "Offline-First Architecture"].map((feat, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                               <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                               {feat}
                            </div>
                         ))}
                      </div>

                      <div className="mt-auto pt-6 flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
                         Explore Features <ArrowRight className="ml-2 w-5 h-5" />
                      </div>
                   </CardContent>
                </Card>
             </Link>
          </motion.div>

          {/* U-Cademic Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
             <Link href="/products/u-cademic" className="block h-full">
                <Card className="group relative h-full overflow-hidden border-border bg-white hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 rounded-[2.5rem]">
                   {/* Top Highlight Bar */}
                   <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 to-red-500" />
                   
                   <CardContent className="p-10 flex flex-col h-full relative z-10">
                      <div className="flex items-start justify-between mb-8">
                         <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap className="w-8 h-8" />
                         </div>
                         <div className="px-4 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider border border-orange-100">
                            Education
                         </div>
                      </div>

                      <div className="space-y-4 mb-8">
                         <h3 className="text-3xl font-bold text-foreground group-hover:text-orange-600 transition-colors">U-Cademic</h3>
                         <p className="text-lg text-muted-foreground leading-relaxed">
                            A smart campus ecosystem connecting schools, parents, and students. Digitalize academic processes effortlessly.
                         </p>
                      </div>

                      <div className="space-y-3 mb-8 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                         {["Learning Management System (LMS)", "Digital Attendance & Report", "Parent-Teacher Portal"].map((feat, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                               <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                               {feat}
                            </div>
                         ))}
                      </div>

                      <div className="mt-auto pt-6 flex items-center text-orange-600 font-bold group-hover:translate-x-2 transition-transform">
                         Learn More <ArrowRight className="ml-2 w-5 h-5" />
                      </div>
                   </CardContent>
                </Card>
             </Link>
          </motion.div>
      </div>

      {/* Enterprise / More Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 md:p-12 text-center">
             <div className="flex justify-center gap-4 mb-6">
                 <div className="p-3 bg-white rounded-xl shadow-sm border border-zinc-100"><Zap className="w-6 h-6 text-purple-500" /></div>
                 <div className="p-3 bg-white rounded-xl shadow-sm border border-zinc-100"><Package className="w-6 h-6 text-emerald-500" /></div>
             </div>
             <Heading variant="h3" className="mb-4">Need Custom Enterprise Solutions?</Heading>
             <Text variant="muted" className="mb-8 max-w-xl mx-auto">
                We also build tailored ERP, HRIS, and CRM modules specifically for your industry needs.
             </Text>
             <Button asChild size="lg" className="rounded-full px-8">
               <Link href="/contact">
                 Get in Touch
               </Link>
             </Button>
          </div>
      </motion.div>

    </Section>
  )
}
