"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Package, Zap, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import * as LucideIcons from "lucide-react"

// Color palettes for product cards, cycled by index
const CARD_PALETTES = [
  { border: "hover:border-blue-500/50 hover:shadow-blue-500/10", bar: "from-blue-500 to-indigo-600", iconBg: "bg-blue-50 text-blue-600", badgeBg: "bg-blue-50 text-blue-700 border-blue-100", hoverText: "group-hover:text-blue-600", checkColor: "text-blue-500", accentText: "text-blue-600" },
  { border: "hover:border-orange-500/50 hover:shadow-orange-500/10", bar: "from-orange-500 to-red-500", iconBg: "bg-orange-50 text-orange-600", badgeBg: "bg-orange-50 text-orange-700 border-orange-100", hoverText: "group-hover:text-orange-600", checkColor: "text-orange-500", accentText: "text-orange-600" },
  { border: "hover:border-emerald-500/50 hover:shadow-emerald-500/10", bar: "from-emerald-500 to-teal-600", iconBg: "bg-emerald-50 text-emerald-600", badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100", hoverText: "group-hover:text-emerald-600", checkColor: "text-emerald-500", accentText: "text-emerald-600" },
  { border: "hover:border-purple-500/50 hover:shadow-purple-500/10", bar: "from-purple-500 to-violet-600", iconBg: "bg-purple-50 text-purple-600", badgeBg: "bg-purple-50 text-purple-700 border-purple-100", hoverText: "group-hover:text-purple-600", checkColor: "text-purple-500", accentText: "text-purple-600" },
]

export interface ProductData {
  name: string
  slug: string
  tagline: string
  description: string
  iconName: string
  features: string[]
}

interface ProductShowcaseProps {
  products?: ProductData[]
}

// Default fallback products if DB is empty
const defaultProducts: ProductData[] = [
  {
    name: "U-Kasir",
    slug: "ukasir",
    tagline: "Retail POS",
    description: "The complete Point of Sale system for modern retail. Manage inventory, track sales, and grow your business offline & online.",
    iconName: "ShoppingCart",
    features: ["Real-time Stock Management", "QRIS & Multi-payment", "Offline-First Architecture"],
  },
  {
    name: "U-Cademic",
    slug: "u-cademic",
    tagline: "Education",
    description: "A smart campus ecosystem connecting schools, parents, and students. Digitalize academic processes effortlessly.",
    iconName: "GraduationCap",
    features: ["Learning Management System (LMS)", "Digital Attendance & Report", "Parent-Teacher Portal"],
  },
]

export function ProductShowcase({ products }: ProductShowcaseProps) {
  const productsToRender = products && products.length > 0 ? products : defaultProducts

  return (
    <Section id="products" className="bg-background relative overflow-hidden">
       {/* Ambient Background */}
       <div className="absolute top-1/2 right-0 -z-10 h-200 w-200 -translate-y-1/2 bg-orange-500/5 blur-[120px] rounded-full opacity-60" />
       <div className="absolute bottom-0 left-0 -z-10 h-150 w-150 bg-blue-500/5 blur-[100px] rounded-full opacity-60" />

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

      <div className={`grid gap-8 max-w-6xl mx-auto relative z-10 mb-16 ${productsToRender.length === 1 ? "max-w-xl" : "lg:grid-cols-2"}`}>
          {productsToRender.map((product, index) => {
            const palette = CARD_PALETTES[index % CARD_PALETTES.length]
            // @ts-ignore - dynamic icon loading
            const Icon = (LucideIcons as any)[product.iconName] || LucideIcons.Box

            return (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                 <Link 
                   href={product.slug === 'ukasir' ? 'https://www.ukasir.id/' : `/products/${product.slug}`} 
                   className="block h-full"
                 >
                    <Card className={`group relative h-full overflow-hidden border-border bg-white ${palette.border} transition-all duration-500 rounded-[2.5rem]`}>
                       {/* Top Highlight Bar */}
                       <div className={`absolute top-0 inset-x-0 h-1 bg-linear-to-r ${palette.bar}`} />
                       
                       <CardContent className="p-10 flex flex-col h-full relative z-10">
                          <div className="flex items-start justify-between mb-8">
                             <div className={`h-16 w-16 rounded-2xl ${palette.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="w-8 h-8" />
                             </div>
                             <div className={`px-4 py-1.5 rounded-full ${palette.badgeBg} text-xs font-bold uppercase tracking-wider border`}>
                                {product.tagline}
                             </div>
                          </div>

                          <div className="space-y-4 mb-8">
                             <h3 className={`text-3xl font-bold text-foreground ${palette.hoverText} transition-colors`}>{product.name}</h3>
                             <p className="text-lg text-muted-foreground leading-relaxed">
                                {product.description}
                             </p>
                          </div>

                          {product.features.length > 0 && (
                            <div className="space-y-3 mb-8 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                               {product.features.map((feat, i) => (
                                  <div key={i} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                                     <CheckCircle2 className={`w-5 h-5 ${palette.checkColor} shrink-0`} />
                                     {feat}
                                  </div>
                               ))}
                            </div>
                          )}

                          <div className={`mt-auto pt-6 flex items-center ${palette.accentText} font-bold group-hover:translate-x-2 transition-transform`}>
                             Learn More <ArrowRight className="ml-2 w-5 h-5" />
                          </div>
                       </CardContent>
                    </Card>
                 </Link>
              </motion.div>
            )
          })}
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
