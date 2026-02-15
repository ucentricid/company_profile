"use client"

import * as React from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { Smartphone, Palette, Code2, Globe, Rocket, Database } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Card, CardContent } from "@/components/ui/Card"

const services = [
  {
    title: "Web Development",
    description: "High-performance websites built with Next.js and modern technologies for maximum speed and SEO.",
    icon: Globe,
  },
  {
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications that provide seamless user experiences.",
    icon: Smartphone,
  },
  {
    title: "UI/UX Design",
    description: "Intuitive and beautiful interfaces designed with a user-centric approach.",
    icon: Palette,
  },
  {
    title: "Custom Software",
    description: "Tailored software solutions to automate business processes and improve efficiency.",
    icon: Code2,
  },
  {
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure setup and management using AWS, GCP, or Azure.",
    icon: Database,
  },
  {
    title: "Digital Growth",
    description: "Data-driven strategies to boost your digital presence and drive conversions.",
    icon: Rocket,
  },
]

function ServiceCard({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        variant="glass" 
        className="group relative overflow-hidden h-full border-white/5 bg-white/5 hover:bg-white/10 transition-colors duration-500"
        onMouseMove={handleMouseMove}
      >
        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(239, 80, 39, 0.1),
                transparent 80%
              )
            `,
          }}
        />
        
        <CardContent className="relative flex flex-col gap-6 p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/25">
            <Icon className="h-7 w-7" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <Text variant="muted" className="text-base">
              {description}
            </Text>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function Services() {
  return (
    <Section id="services" className="bg-background">
       {/* Decorative Background */}
       <div className="absolute top-1/2 left-0 -z-10 h-[600px] w-[600px] -translate-y-1/2 bg-primary/5 blur-[120px] rounded-full opacity-50" />
       
       <div className="mb-16 flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Our Expertise
            </div>
            <Heading variant="h2" className="mb-4">
               Comprehensive <span className="text-primary">Digital Services</span>
            </Heading>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Text variant="muted" className="max-w-[700px] md:text-lg">
               We provide end-to-end digital solutions designed to scale your business, from concept to execution.
            </Text>
          </motion.div>
       </div>

       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
         {services.map((service, index) => (
           <ServiceCard key={index} {...service} />
         ))}
       </div>
    </Section>
  )
}
