"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"
import { SITE_CONFIG } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { useSession } from "next-auth/react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Logic: If on homepage ('/') and link is a hash link ('/#...'), handle scroll manually
    if (pathname === "/" && href.startsWith("/#")) {
        e.preventDefault()
        const targetId = href.replace("/#", "")
        const elem = document.getElementById(targetId)
        
        if (elem) {
            // Close mobile menu if open
            setIsMenuOpen(false)
            
            // Smooth scroll
            elem.scrollIntoView({ behavior: "smooth" })
            
            // Update URL hash without reload
            window.history.pushState(null, "", href)
        }
    } else if (href.startsWith("/#") && pathname !== "/") {
        // If not on homepage, let Next.js handle it (it will navigate to '/' then scroll)
        setIsMenuOpen(false)
    } else {
        // Normal navigation
        setIsMenuOpen(false)
    }
  }

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
              ? "h-16 w-[95%] md:w-auto md:min-w-175 lg:min-w-200 max-w-7xl rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 shadow-xl px-4" 
              : "h-28 w-full max-w-7xl px-6 bg-transparent"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group h-full" onClick={(e) => handleNavClick(e, "/")}>
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
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  "relative px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  isScrolled ? "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" : "text-muted-foreground hover:text-primary"
                )}
              >
                {item.title}
              </Link>
            ))}
            {session?.user && (session.user.role === "admin" || session.user.role === "superadmin") && (
              <Link
                href="/dashboard"
                className={cn(
                  "relative px-4 py-1.5 text-[10px] font-black tracking-widest uppercase transition-all duration-300 rounded-full",
                  isScrolled 
                    ? "text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" 
                    : "text-zinc-400 hover:text-indigo-600 hover:bg-white/50 backdrop-blur-sm shadow-sm border border-transparent hover:border-indigo-100 px-5"
                )}
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2 px-1">
            {session?.user ? (
               <div className="flex items-center gap-2">
                 <Link href={`/portfolio/${encodeURIComponent(session.user.name || "")}`} onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className={cn(
                      "rounded-2xl transition-all duration-300 font-extrabold tracking-tighter shadow-none",
                      isScrolled 
                        ? "h-11 px-7 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30" 
                        : "hidden md:inline-flex h-12 px-9 text-xs bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xl shadow-indigo-600/30"
                    )}>
                      MY PORTFOLIO
                    </Button>
                 </Link>
               </div>
            ) : (
               <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className={cn(
                    "rounded-2xl transition-all duration-300 font-extrabold tracking-tighter uppercase group shadow-none",
                    isScrolled 
                      ? "h-11 px-8 text-[11px] bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/30" 
                      : "hidden md:inline-flex h-12 px-10 text-xs bg-zinc-900 text-white hover:bg-black hover:scale-[1.02] shadow-2xl shadow-zinc-900/20"
                  )}>
                    LET'S TALK <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
               </Link>
            )}

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
            className="fixed inset-0 z-60 bg-black/40 backdrop-blur-[2px] md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 300 }}
               className="absolute right-0 top-0 bottom-0 w-75 bg-background border-l border-border p-6 shadow-2xl"
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
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="flex items-center justify-between p-3 rounded-xl text-base font-medium text-muted-foreground transition-all hover:bg-muted hover:text-primary hover:pl-4"
                  >
                    {item.title}
                    <span className="text-primary/0 transition-colors group-hover:text-primary">→</span>
                  </Link>
                ))}
                <div className="pt-6 mt-4 border-t border-border flex flex-col gap-3">
                  {session?.user && (session.user.role === "admin" || session.user.role === "superadmin") && (
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                       <Button variant="outline" className="w-full rounded-xl justify-between group">
                         Admin Dashboard <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                       </Button>
                    </Link>
                  )}
                  {session?.user ? (
                    <Link
                      href={`/portfolio/${encodeURIComponent(session.user.name || "")}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                       <Button className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20">
                         My Portfolio
                       </Button>
                    </Link>
                  ) : (
                    <Link
                      href="/contact"
                      onClick={() => setIsMenuOpen(false)}
                    >
                       <Button className="w-full rounded-xl">Contact Us</Button>
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
