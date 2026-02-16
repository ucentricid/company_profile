"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone, Send, Smartphone } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { Button } from "@/components/ui/Button"
import { Heading, Text } from "@/components/ui/Typography"

export default function ContactPageClient() {
  return (
    <main className="min-h-screen pt-24 pb-12 bg-background selection:bg-primary/20 selection:text-primary relative">
       {/* Background Pattern - Subtle */}
       <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      <Section className="py-0">
         <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
               
               {/* Left: Content & Info */}
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-10"
               >
                  <div>
                     <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary mb-8 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-3 animate-pulse" />
                        Let's Talk
                     </div>
                     <Heading variant="h1" className="mb-6 leading-tight">
                        Got a Vision? <br />
                        Let's <span className="text-primary">Build It.</span>
                     </Heading>
                     <Text variant="muted" className="text-lg md:text-xl max-w-lg leading-relaxed">
                        From disruptive startups to enterprise transformation, we engineer digital solutions that drive real growth.
                     </Text>
                  </div>

                  <div className="grid gap-4">
                     <ContactItem 
                        icon={<Mail className="w-5 h-5" />}
                        label="Email Us"
                        value="hello@ucentric.co.id"
                        href="mailto:hello@ucentric.co.id"
                     />
                     <ContactItem 
                        icon={<Smartphone className="w-5 h-5" />}
                        label="Call Us"
                        value="+62 21 5555 8888"
                        href="tel:+622155558888"
                     />
                     <ContactItem 
                        icon={<MapPin className="w-5 h-5" />}
                        label="Visit HQ"
                        value="Menara Ucentric, SCBD Lot 28, Jakarta Selatan"
                        href="#"
                     />
                  </div>
               </motion.div>

               {/* Right: The Form */}
               <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
               >
                  <div className="relative rounded-3xl p-8 md:p-10 bg-card border border-border shadow-xl">
                     <div className="mb-8">
                        <h3 className="text-2xl font-bold text-foreground">Send a Message</h3>
                        <p className="text-muted-foreground mt-2 text-sm">We usually respond within 24 hours.</p>
                     </div>

                     <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <FormInput label="First Name" id="firstName" />
                           <FormInput label="Last Name" id="lastName" />
                        </div>

                        <FormInput label="Email Address" id="email" type="email" />
                        <FormInput label="Subject" id="subject" />
                        
                        <div className="relative group">
                           <textarea 
                              id="message"
                              className="w-full min-h-[160px] rounded-xl border border-input bg-background/50 px-4 py-4 text-base text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all duration-200 resize-none"
                              placeholder="Tell us about your project..."
                           />
                        </div>

                        <Button 
                           size="lg" 
                           className="w-full h-14 rounded-xl text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
                        >
                           Send Message <Send className="ml-2 w-5 h-5" />
                        </Button>
                     </form>
                  </div>
               </motion.div>

            </div>
         </div>
      </Section>
    </main>
  )
}

function ContactItem({ icon, label, value, href }: { icon: any, label: string, value: string, href: string }) {
   return (
      <a href={href} className="flex items-center gap-4 group p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all duration-300">
         <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
            {icon}
         </div>
         <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{value}</div>
         </div>
      </a>
   )
}

function FormInput({ label, id, type = "text" }: { label: string, id: string, type?: string }) {
   return (
      <div className="space-y-2">
         <label htmlFor={id} className="text-sm font-medium text-foreground ml-1">
            {label}
         </label>
         <input
            type={type}
            id={id}
            className="w-full h-12 rounded-xl border border-input bg-background/50 px-4 text-base text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all duration-200"
            placeholder={label}
         />
      </div>
   )
}
