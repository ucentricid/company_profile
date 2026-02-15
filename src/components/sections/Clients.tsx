"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Section } from "@/components/ui/Section"
import { Text } from "@/components/ui/Typography"

const partners = [
  "TechGlobal", "InnovateCorp", "FutureSystems", "CloudNine", "DataFlow", 
  "SecureNet", "AlphaWave", "NextGen", "SmartSolutions", "EcoTech"
]

export function Clients() {
  return (
    <Section className="py-12 border-b border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
           <Text variant="muted" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/80">
              Trusted by industry leaders
           </Text>
        </div>

        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
           <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
           <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
           
           <motion.div
              className="flex w-max items-center"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                 repeat: Infinity, 
                 ease: "linear", 
                 duration: 30 
              }}
           >
              {[...partners, ...partners, ...partners].map((partner, i) => (
                 <div key={i} className="mx-8 md:mx-12 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 cursor-pointer">
                    {/* Placeholder for Logos - Replacing with Stylized Text for now */}
                    <span className="text-2xl font-bold font-sans tracking-tight text-foreground/80">
                       {partner}
                    </span>
                 </div>
              ))}
           </motion.div>
        </div>
      </div>
    </Section>
  )
}
