"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Card, CardContent } from "@/components/ui/Card"

const testimonials = [
  {
    content: "Ucentric transformed our operational workflow entirely. Their U-Kasir system is intuitive and robust.",
    author: "Sarah J.",
    role: "Operational Manager",
    company: "Retail Co.",
    rating: 5
  },
  {
    content: "The best ed-tech partner we've worked with. U-Cademic made student management seamless.",
    author: "Dr. Budi Santoso",
    role: "Headmaster",
    company: "Global School",
    rating: 5
  },
  {
    content: "Their team isn't just a vendor; they are strategic partners who care about our growth.",
    author: "James L.",
    role: "CTO",
    company: "FinTech Sol",
    rating: 5
  },
  {
    content: "Fast, reliable, and visually stunning. The custom development exceeded our expectations.",
    author: "Anita W.",
    role: "Product Owner",
    company: "StartUp Inc.",
    rating: 4
  },
  {
      content: "Ucentric's attention to detail is unmatched. They truly engineer impact.",
      author: "Michael T.",
      role: "Director",
      company: "Logistics Pro",
      rating: 5
  }
]

export function Testimonials() {
  return (
    <Section id="testimonials" className="bg-background relative overflow-hidden py-24">
      {/* Header */}
      <div className="mb-16 flex flex-col items-center text-center space-y-4 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           viewport={{ once: true }}
        >
           <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Social Proof
           </div>
           <Heading variant="h2" className="mb-4">
              Trusted by <span className="text-primary">Visionaries</span>
           </Heading>
           <Text variant="muted" className="max-w-2xl mx-auto text-lg">
              Hear from the partners who are shaping the future with Ucentric.
           </Text>
        </motion.div>
      </div>

      {/* Infinite Scroll Marquee */}
      <div className="relative w-full overflow-hidden">
         {/* Gradient Masks REMOVED as requested */}

         <motion.div
            className="flex w-max" // Removed gap-8 to prevent animation glitch
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
               repeat: Infinity, 
               ease: "linear", 
               duration: 40 // Slower for smoother perception
            }}
         >
            {/* Duplicate list for seamless loop */}
            {[...testimonials, ...testimonials].map((item, index) => (
               <div key={index} className="mr-8"> 
                  <Card className="w-[350px] md:w-[400px] h-full bg-neutral-50 dark:bg-zinc-900 border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-8 flex flex-col h-full bg-white dark:bg-zinc-900 rounded-2xl">
                     <div className="mb-6 text-primary">
                        <Quote className="w-8 h-8 opacity-50" />
                     </div>
                     
                     <p className="text-lg text-zinc-900 dark:text-zinc-50 font-medium mb-6 leading-relaxed italic">
                        "{item.content}"
                     </p>

                     <div className="mt-auto flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                           {item.author.charAt(0)}
                        </div>
                        <div>
                           <div className="font-bold text-zinc-900 dark:text-white">{item.author}</div>
                           <div className="text-sm text-zinc-500 dark:text-zinc-400">{item.role}, {item.company}</div>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                           {[...Array(5)].map((_, i) => (
                              <Star 
                                 key={i} 
                                 className={`w-4 h-4 ${i < item.rating ? "fill-orange-400 text-orange-400" : "fill-neutral-200 dark:text-zinc-700"}`} 
                              />
                           ))}
                        </div>
                     </div>
                  </CardContent>
               </Card>
               </div>
            ))}
         </motion.div>
      </div>
    </Section>
  )
}
