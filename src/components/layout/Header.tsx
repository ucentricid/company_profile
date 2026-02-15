"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react" // Added ArrowRight
import { SITE_CONFIG } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed left-0 right-0 z-50 flex justify-center transition-all duration-300",
          isScrolled ? "top-4" : "top-0"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-500 ease-in-out",
            isScrolled 
              ? "h-16 w-[95%] md:w-auto md:min-w-[700px] lg:min-w-[800px] max-w-7xl rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xl px-4" 
              : "h-28 w-full max-w-7xl px-6 bg-transparent"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group h-full">
            <div className={cn(
               "relative flex items-center justify-center rounded-full transition-transform group-hover:scale-105",
               isScrolled ? "w-10 h-10 md:w-12 md:h-12" : "w-14 h-14 md:w-20 md:h-20"
            )}>
               <img 
                 src="/images/logo-ucentric-nobg.png" 
                 alt={SITE_CONFIG.name} 
                 className="w-full h-full object-contain" 
               />
            </div>
          </Link>

          {/* Desktop Nav - Centered in Island or Right-aligned in Hero */}
          <nav className="hidden md:flex items-center gap-1">
            {SITE_CONFIG.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  isScrolled ? "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" : "text-muted-foreground hover:text-primary"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 px-1">
            <Link href="/contact">
               {isScrolled ? (
                  <Button size="sm" className="rounded-full h-9 px-4 text-xs">
                     Contact
                  </Button>
               ) : (
                  <Button className="hidden md:inline-flex rounded-full h-10 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                     Contact Us <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
               )}
            </Link>

            <button
              className="p-2 text-muted-foreground hover:text-primary transition-colors md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle Menu</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay - Unchanged */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 300 }}
               className="absolute right-0 top-0 bottom-0 w-[300px] bg-background border-l border-border p-6 shadow-2xl"
               onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-xl text-primary">{SITE_CONFIG.name}</span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-muted rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <nav className="flex flex-col space-y-2">
                {SITE_CONFIG.mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl text-base font-medium text-muted-foreground transition-all hover:bg-muted hover:text-primary hover:pl-4"
                  >
                    {item.title}
                    <span className="text-primary/0 transition-colors group-hover:text-primary/100">→</span>
                  </Link>
                ))}
                <div className="pt-6 mt-4 border-t border-border">
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                  >
                     <Button className="w-full rounded-xl">Contact Us</Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
