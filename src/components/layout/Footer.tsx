"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, Waves } from "lucide-react"

import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background pt-16 pb-8">
      <div className="container mx-auto px-4">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                     <Waves className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-foreground">Ucentric</span>
               </div>
               <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  Empowering businesses through digital transformation. We build scalable, high-performance solutions for the modern world.
               </p>
               <div className="flex gap-4 pt-4">
                  <SocialLink icon={<Linkedin className="w-4 h-4" />} href="#" />
                  <SocialLink icon={<Twitter className="w-4 h-4" />} href="#" />
                  <SocialLink icon={<Instagram className="w-4 h-4" />} href="#" />
                  <SocialLink icon={<Facebook className="w-4 h-4" />} href="#" />
               </div>
            </div>

            {/* Links Column 1 */}
            <div>
               <h4 className="font-bold text-foreground mb-6">Company</h4>
               <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                  <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                  <li><Link href="/partners" className="hover:text-primary transition-colors">Partners</Link></li>
               </ul>
            </div>

            {/* Links Column 2 */}
            <div>
               <h4 className="font-bold text-foreground mb-6">Product</h4>
               <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="/u-kasir" className="hover:text-primary transition-colors">U-Kasir</Link></li>
                  <li><Link href="/u-cademic" className="hover:text-primary transition-colors">U-Academic</Link></li>
                  <li><Link href="/services" className="hover:text-primary transition-colors">Enterprise Services</Link></li>
                  <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
               </ul>
            </div>

            {/* Newsletter Column */}
            <div>
               <h4 className="font-bold text-foreground mb-6">Stay Updated</h4>
               <p className="text-sm text-muted-foreground mb-4">
                  Subscribe to our newsletter for the latest insights.
               </p>
               <div className="flex gap-2">
                  <Input 
                     type="email" 
                     placeholder="Enter your email" 
                     className="bg-white dark:bg-zinc-800 border-border"
                  />
                  <Button size="icon" className="shrink-0 bg-primary hover:bg-primary/90 text-white">
                     <ArrowIcon />
                  </Button>
               </div>
            </div>
         </div>

         {/* Bottom Bar */}
         <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Ucentric Inc. All rights reserved.</p>
            <div className="flex gap-8">
               <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
               <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
               <Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Settings</Link>
            </div>
         </div>
      </div>
    </footer>
  )
}

function SocialLink({ icon, href }: { icon: React.ReactNode, href: string }) {
   return (
      <Link 
         href={href} 
         className="h-10 w-10 rounded-full bg-secondary/50 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300"
      >
         {icon}
      </Link>
   )
}

function ArrowIcon() {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M5 12h14" />
         <path d="m12 5 7 7-7 7" />
      </svg>
   )
}
