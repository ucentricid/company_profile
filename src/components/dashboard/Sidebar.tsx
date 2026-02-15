"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Briefcase, Users, Settings, LogOut, Layers, Box, BarChart3, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_SECTIONS = [
  {
    title: "Recruitment",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Applications", href: "/dashboard/hr/applications", icon: Users },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 bg-[#0F172A] border-r border-[#1E293B] hidden md:flex flex-col h-full font-sans text-slate-300 shadow-2xl z-20">
      {/* Brand */}
      <div className="h-20 flex items-center px-8 border-b border-[#1E293B]">
        <Link href="/" className="flex items-center gap-3 group">
           <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
             U
           </div>
           <span className="text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">UCentric</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-8 no-scrollbar">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx}>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-orange-900/20" 
                        : "text-slate-400 hover:text-primary hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-primary")} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-white/50" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#1E293B] bg-[#0F172A]">
        <button className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-all group border border-transparent hover:border-red-500/20">
            <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400" />
            <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
