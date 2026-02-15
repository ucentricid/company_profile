"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Linkedin, Twitter, User } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

const team = [
  {
    name: "Riand",
    role: "CEO",
    bio: "Visionary leader with 15+ years in tech innovation.",
    image: null, // Placeholder
  },
  {
    name: "Yoga",
    role: "COO",
    bio: "Operational excellence and strategic growth expert.",
    image: null,
  },
  {
    name: "Fadly",
    role: "CRO",
    bio: "Driving revenue streams and business partnerships.",
    image: null,
  },
  {
    name: "Aby",
    role: "CTO",
    bio: "Architecting scalable and robust technical solutions.",
    image: null,
  },
  {
    name: "Dedi",
    role: "CIO",
    bio: "Ensuring information security and data integrity.",
    image: null,
  },
]

export function Team() {
  return (
    <Section id="team" className="bg-[#FFF8F5] relative overflow-hidden">
      {/* Decorative Background - Simplified */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/30 blur-[100px] rounded-full opacity-30 -z-10" />

      <div className="mb-16 flex flex-col items-center text-center space-y-4 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           viewport={{ once: true }}
        >
           <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-600 mb-4 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-orange-600 mr-2 animate-pulse" />
              Our Leadership
           </div>
           <Heading variant="h2" className="mb-4 text-zinc-900">
              Meet the <span className="text-orange-600">Minds</span>
           </Heading>
           <Text variant="muted" className="max-w-2xl mx-auto text-lg text-zinc-600">
              The experts behind Ucentric's mission to engineer digital impact.
           </Text>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10 px-4">
        {team.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="w-full"
          >
            {/* Black Card with White Text */}
            <Card className="h-full border-none bg-zinc-900 shadow-xl shadow-orange-500/5 hover:bg-zinc-800 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 group overflow-hidden">
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-800 mb-0">
                 {/* Image Placeholder - Replace with actual Image component */}
                 <div className="absolute inset-0 flex items-center justify-center text-zinc-600 group-hover:scale-105 transition-transform duration-500">
                    <User className="w-32 h-32" />
                 </div>
                 
                 {/* Social Overlay */}
                 <div className="absolute inset-0 bg-orange-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                    <Button size="icon" variant="glass" className="rounded-full hover:bg-white hover:text-orange-600 border-none bg-white/20 text-white">
                       <Linkedin className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="glass" className="rounded-full hover:bg-white hover:text-orange-600 border-none bg-white/20 text-white">
                       <Twitter className="w-5 h-5" />
                    </Button>
                 </div>
              </div>
              
              <CardContent className="p-6 text-center relative">
                 <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-500 transition-colors">{member.name}</h3>
                 <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-3">{member.role}</p>
                 <p className="text-zinc-400 text-sm leading-relaxed">
                    {member.bio}
                 </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
