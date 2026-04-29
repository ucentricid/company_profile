"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Linkedin, Twitter, User } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

const defaultTeam = [
  {
    name: "Riand",
    role: "CEO",
    linkedinUrl: null,
    image: null, // Placeholder
  },
  {
    name: "Yoga",
    role: "COO",
    linkedinUrl: null,
    image: null,
  },
  {
    name: "Fadly",
    role: "CRO",
    linkedinUrl: null,
    image: null,
  },
  {
    name: "Aby",
    role: "CTO",
    linkedinUrl: null,
    image: null,
  },
  {
    name: "Dedi",
    role: "CIO",
    linkedinUrl: null,
    image: null,
  },
]

export function Team({ data }: { data?: any[] }) {
  const teamToRender = data && data.length > 0 ? data : defaultTeam;
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft + container.clientWidth / 2;
    
    let closestIndex = 0;
    let closestDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const childElement = child as HTMLElement;
      // Calculate the center of the child relative to the container
      const childCenter = childElement.offsetLeft + childElement.offsetWidth / 2;
      const distance = Math.abs(childCenter - scrollPosition);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (activeIndex !== closestIndex) {
      setActiveIndex(closestIndex);
    }
  };

  return (
    <Section id="team" className="bg-[#FFF8F5] relative overflow-hidden">
      {/* Decorative Background - Simplified */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-orange-100/30 blur-[100px] rounded-full opacity-30 -z-10" />

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
              The experts behind Ucentric&apos;s mission to engineer digital impact.
           </Text>
        </motion.div>
      </div>

      <style>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div 
        className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto relative z-10 px-4 overflow-x-auto snap-x snap-mandatory hide-scroll pb-4 pt-2"
        onScroll={handleScroll}
      >
        {teamToRender.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="w-[85vw] sm:w-auto shrink-0 snap-center"
          >
            {/* Black Card with White Text */}
            <Card className="h-full border-none bg-zinc-900 shadow-xl shadow-orange-500/5 hover:bg-zinc-800 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 group overflow-hidden">
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-800 mb-0">
                 {member.image ? (
                   <img src={member.image} alt={member.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-zinc-600 group-hover:scale-105 transition-transform duration-500">
                      <User className="w-32 h-32" />
                   </div>
                 )}
                 
                 {/* Social Overlay */}
                 <div className="absolute inset-0 bg-orange-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                    {member.linkedinUrl && (
                      <Button size="icon" variant="glass" className="rounded-full hover:bg-white hover:text-orange-600 border-none bg-white/20 text-white" asChild>
                         <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer"><Linkedin className="w-5 h-5" /></a>
                      </Button>
                    )}
                 </div>
              </div>
              
              <CardContent className="p-6 text-center relative">
                 <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-500 transition-colors">{member.name}</h3>
                 <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-3">{member.role}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Mobile Pagination Dots */}
      <div className="flex justify-center gap-2 mt-4 sm:hidden relative z-10 w-full">
        {teamToRender.map((_, index) => (
          <div 
            key={index} 
            className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index ? "w-6 bg-orange-600" : "w-2 bg-orange-200"}`}
          />
        ))}
      </div>
    </Section>
  )
}
