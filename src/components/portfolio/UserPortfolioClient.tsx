"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Plus, Edit2, ArrowRight, Filter, LayoutGrid, Calendar, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

type PortfolioStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED"

interface Portfolio {
   id: string
   title: string
   slug: string
   description: string
   imageUrl: string
   projectUrl: string
   status: PortfolioStatus
   createdAt: string
}

export default function UserPortfolioClient({ username }: { username: string }) {
   const router = useRouter()
   const { data: session, status: sessionStatus } = useSession()
   const [portfolios, setPortfolios] = useState<Portfolio[]>([])
   const [loading, setLoading] = useState(true)
   const [filter, setFilter] = useState<PortfolioStatus | "ALL">("ALL")
   
   const isOwner = session?.user?.name?.toLowerCase() === decodeURIComponent(username).toLowerCase()
   const isAdmin = session?.user?.role === "admin" || session?.user?.role === "superadmin"

   useEffect(() => {
      const fetchPortfolios = async () => {
         try {
            const res = await fetch(`/api/portfolio?username=${encodeURIComponent(username)}`)
            if (res.ok) {
               const data = await res.json()
               setPortfolios(data)
            }
         } catch (error) {
            console.error(error)
         } finally {
            setLoading(false)
         }
      }

      fetchPortfolios()
   }, [username])

   const filteredPortfolios = portfolios.filter(p => filter === "ALL" || p.status === filter)

   const getStatusBadge = (status: PortfolioStatus) => {
      switch (status) {
         case "DRAFT": return <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-0 font-medium px-2 py-0">Draft</Badge>
         case "PENDING": return <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-0 font-medium px-2 py-0">Pending</Badge>
         case "APPROVED": return <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-0 font-medium px-2 py-0">Approved</Badge>
         case "REJECTED": return <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border-0 font-medium px-2 py-0">Rejected</Badge>
         default: return null
      }
   }

   if (loading || sessionStatus === "loading") {
      return (
         <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-zinc-50 dark:bg-zinc-950">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-zinc-500 font-medium animate-pulse tracking-tight">Loading catalog...</p>
         </div>
      )
   }

   return (
      <div className="bg-[#FFFFFF] min-h-screen text-zinc-900">
         {/* Premium Minimal Hero */}
         <section className="pt-40 pb-20 border-b border-zinc-100 bg-[#F9FAFB]">
            <div className="container mx-auto px-6">
               <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-5xl mx-auto"
               >
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                           <div className="w-8 h-1 bg-indigo-600 rounded-full" />
                           <span className="text-[11px] font-black tracking-[0.2em] text-indigo-600 uppercase">Personal Showcase</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tight leading-[1.05]">
                           {decodeURIComponent(username)}
                        </h1>
                        <p className="text-xl text-zinc-500 mt-6 max-w-2xl font-medium leading-relaxed">
                           A curated selection of digital experiences and engineering projects.
                        </p>
                     </div>
                     
                     {isOwner && (
                        <Link href="/portfolio/new">
                           <Button size="lg" className="rounded-2xl px-10 bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl shadow-indigo-600/20 transition-all active:scale-95 flex gap-3 font-bold">
                              <Plus className="w-5 h-5" /> 
                              New Project
                           </Button>
                        </Link>
                     )}
                  </div>
               </motion.div>
            </div>
         </section>

         <section className="container mx-auto px-6 py-12 pb-40">
            {/* Filter Bar - Professional & Clean */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 sticky top-28 z-40">
               <div className="flex items-center gap-1 p-1 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-zinc-100 overflow-x-auto no-scrollbar w-full md:w-auto">
                  {["ALL", "APPROVED", "PENDING", "DRAFT"].map((s) => (
                    (isOwner || isAdmin || s === "APPROVED" || s === "ALL") && (
                      <button
                        key={s}
                        onClick={() => setFilter(s as any)}
                        className={cn(
                           "px-8 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                           filter === s 
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                        )}
                      >
                        {s === "ALL" ? "All Projects" : s === "PENDING" ? "In Review" : s.charAt(0) + s.slice(1).toLowerCase()}
                      </button>
                    )
                  ))}
               </div>

               <div className="flex items-center gap-2 text-xs font-black text-zinc-400 tracking-widest px-4">
                  <LayoutGrid className="w-4 h-4" />
                  {filteredPortfolios.length} WORKS
               </div>
            </div>

            {/* Grid - High Precision */}
            <AnimatePresence mode="popLayout">
               {filteredPortfolios.length === 0 ? (
                  <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="max-w-md mx-auto text-center py-40 bg-zinc-50/50 rounded-[3rem] border border-zinc-100"
                  >
                     <LayoutGrid className="w-12 h-12 text-zinc-200 mx-auto mb-6" />
                     <h3 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">No Items found</h3>
                     <p className="text-zinc-500 font-medium px-10 mb-8">
                        {isOwner ? "Your portfolio is currently a blank canvas. Time to add your first masterpiece." : "This user is still working on their showcase."}
                     </p>
                  </motion.div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                     {filteredPortfolios.map((post, index) => (
                        <motion.div
                           layout
                           key={post.id}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.05 }}
                           className="group flex flex-col h-full cursor-pointer"
                        >
                           {/* Card Container - Clickable Div instead of Link */}
                           <div className="flex flex-col h-full" onClick={() => router.push(`/portfolio/p/${post.slug}`)}>
                              <div className="relative aspect-[16/11] bg-white rounded-[2rem] overflow-hidden mb-8 shadow-[0_15px_45px_rgba(0,0,0,0.06)] border border-zinc-100 transition-all duration-500 group-hover:shadow-[0_25px_65px_rgba(0,0,0,0.1)] group-hover:-translate-y-2">
                                 {post.imageUrl && post.imageUrl !== "-" ? (
                                    <img 
                                       src={post.imageUrl} 
                                       alt={post.title} 
                                       className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110"
                                       onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800' }}
                                    />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                                       <LayoutGrid className="w-16 h-16 text-zinc-100" />
                                    </div>
                                 )}
                                 
                                 <div className="absolute top-6 left-6">
                                    {getStatusBadge(post.status)}
                                 </div>
                              </div>
                              
                              <div className="flex flex-col flex-1 px-2">
                                 <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase mb-4">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                 </div>

                                 <h2 className="text-3xl font-black text-zinc-900 tracking-tight leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
                                    {post.title}
                                 </h2>
                                 
                                 <p className="text-zinc-500 font-medium line-clamp-2 leading-relaxed mb-8 flex-1">
                                    {post.description || "A deep dive into technical requirements and digital execution."}
                                 </p>

                                 <div className="mt-auto pt-8 border-t border-zinc-50 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                                    {isOwner && (
                                       <Link href={`/portfolio/new?id=${post.id}`}>
                                          <Button variant="ghost" size="sm" className="rounded-xl px-4 hover:bg-zinc-50 gap-2 font-bold text-zinc-500 hover:text-indigo-600">
                                             <Edit2 className="w-4 h-4" /> Edit
                                          </Button>
                                       </Link>
                                    )}
                                    
                                    <Link href={`/portfolio/p/${post.slug}`} className="text-zinc-900 font-black text-sm inline-flex items-center gap-2 group/link">
                                       EXPLORE <ArrowRight className="w-5 h-5 transition-transform group-hover/link:translate-x-2" />
                                    </Link>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               )}
            </AnimatePresence>
         </section>
      </div>
   )
}
