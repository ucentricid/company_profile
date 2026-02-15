"use client"

import { Section } from "@/components/ui/Section"
import { Button } from "@/components/ui/Button"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function CareerCTA() {
  return (
    <Section id="career" className="py-32 relative overflow-hidden bg-zinc-950 text-white">
      {/* Background - Clean & Deep */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-0 opacity-40" />

      <div className="container mx-auto px-4 relative z-10">
         <div className="max-w-4xl mx-auto text-center">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
               viewport={{ once: true }}
            >
               <div className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white mb-8 backdrop-blur-sm shadow-xl">
                  <Sparkles className="w-4 h-4 mr-2 text-primary fill-primary" />
                  We are hiring
               </div>
               
               <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                  Become a <br className="hidden md:block" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                     Digital Pioneer
                  </span>
               </h2>
               
               <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Join a team where your code impacts millions. We offer a culture of freedom, mastery, and purpose.
               </p>
               
                  <Button asChild size="xl" className="rounded-full px-10 h-14 text-lg bg-white text-zinc-950 hover:bg-zinc-200 font-bold w-full sm:w-auto shadow-2xl shadow-white/10">
                     <a href="/career">View Open Roles</a>
                  </Button>
            </motion.div>
         </div>

         {/* Bottom Stats Clean Layout */}
         <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12 max-w-5xl mx-auto"
         >
            {[
               { label: "Open Positions", value: "12+" },
               { label: "Team Members", value: "50+" },
               { label: "Glassdoor Rating", value: "4.9" },
               { label: "Remote Friendly", value: "100%" },
            ].map((stat, i) => (
               <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-zinc-500 uppercase tracking-widest">{stat.label}</div>
               </div>
            ))}
         </motion.div>
      </div>
    </Section>
  )
}
