"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { ArrowRight, Sparkles, Rocket, Globe, Code2 } from "lucide-react"
import { cn } from "@/lib/utils"

function FloatingElement({ children, delay = 0, duration = 4, x = 20, y = 20 }: { children: React.ReactNode, delay?: number, duration?: number, x?: number, y?: number }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -y, 0],
        x: [0, x, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: duration, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: delay 
      }}
    >
      {children}
    </motion.div>
  )
}

export function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative flex min-h-[110vh] w-full items-center justify-center overflow-hidden bg-background pt-20 md:pt-28 pb-16">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
      
      <div className="container relative z-10 mx-auto grid gap-12 px-4 md:grid-cols-2 md:items-center md:gap-8 lg:px-8">
        
        {/* Left Column: Typography & CTA */}
        <motion.div 
          className="flex flex-col justify-center space-y-8 text-center md:text-left"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex mx-auto md:mx-0 w-fit items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
          >
            <Sparkles className="mr-2 h-4 w-4 fill-primary/20" />
            <span className="tracking-wide uppercase text-xs font-semibold">Number #1 IT Consultant In Indonesia</span>
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl xl:text-7xl leading-[1.1]"
            >
              Transforming Ideas <br className="hidden lg:block"/>
              into <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-yellow-500 animate-gradient-x">Digital Reality</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-[600px] text-lg text-muted-foreground md:text-xl mx-auto md:mx-0 leading-relaxed font-light text-balance"
            >
              We craft high-performance websites, mobile apps, and digital ecosystems that drive growth and innovation for your business.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row justify-center md:justify-start pt-4"
          >
            <Link
              href="/contact"
              className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-primary px-8 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 -z-10 translate-y-[100%] bg-gradient-to-r from-orange-600 to-red-600 transition-transform duration-300 group-hover:translate-y-0" />
            </Link>
            <Link
              href="/portfolio"
              className="group inline-flex h-14 items-center justify-center rounded-full border border-input bg-background/50 px-8 text-base font-medium shadow-sm backdrop-blur-sm transition-all hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95"
            >
              View Our Work
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-6 pt-6 justify-center md:justify-start border-t border-border/50 mt-8"
          >
             <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">100+</span>
                <span className="text-sm text-muted-foreground">Projects Delivered</span>
             </div>
             <div className="h-10 w-px bg-border" />
             <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">98%</span>
                <span className="text-sm text-muted-foreground">Client Satisfaction</span>
             </div>
          </motion.div>
        </motion.div>

        {/* Right Column: 3D/Glass Visuals */}
        <motion.div 
           style={{ y: y2 }}
           className="relative hidden items-center justify-center md:flex md:h-[600px] perspective-1000"
        >
           <div className="relative h-full w-full max-w-[600px]">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-purple-500/20 to-blue-500/20 blur-[80px] rounded-full animate-pulse-slow" />
              
              {/* Main Card - Glassmorphism */}
              <FloatingElement delay={0} duration={6} x={10} y={15}>
                <div className="relative z-10 w-full aspect-[4/3] rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl dark:bg-black/20 dark:border-white/10 overflow-hidden">
                   {/* Fake Browser UI */}
                   <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 p-4">
                      <div className="flex gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-400" />
                        <div className="h-3 w-3 rounded-full bg-yellow-400" />
                        <div className="h-3 w-3 rounded-full bg-green-400" />
                      </div>
                      <div className="mx-auto h-6 w-1/2 rounded-full bg-white/5" />
                   </div>
                   
                   {/* Content Area */}
                   <div className="p-6 grid gap-4 grid-cols-2 h-full">
                      <div className="col-span-2 h-24 rounded-xl bg-gradient-to-r from-primary/20 to-purple-500/20 border border-white/10" />
                      <div className="h-32 rounded-xl bg-white/5 border border-white/10" />
                      <div className="h-32 rounded-xl bg-white/5 border border-white/10" />
                   </div>
                   
                   {/* Shine Effect */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-50" />
                </div>
              </FloatingElement>

              {/* Floating Element 1 - Code Icon */}
              <div className="absolute -top-12 -right-2 z-20">
                <FloatingElement delay={1} duration={4} x={-10} y={20}>
                   <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl dark:bg-black/40">
                      <Code2 className="h-10 w-10 text-primary" />
                   </div>
                </FloatingElement>
              </div>

              {/* Floating Element 2 - Rocket Icon */}
              <div className="absolute bottom-20 -left-2 z-20">
                <FloatingElement delay={2} duration={5} x={15} y={-15}>
                   <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl dark:bg-black/40">
                      <Rocket className="h-8 w-8 text-blue-500" />
                   </div>
                </FloatingElement>
              </div>

               {/* Floating Element 3 - Globe Icon */}
               <div className="absolute top-1/2 -right-8 z-0">
                <FloatingElement delay={1.5} duration={7} x={-5} y={-20}>
                   <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md shadow-lg">
                      <Globe className="h-7 w-7 text-purple-500" />
                   </div>
                </FloatingElement>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  )
}
