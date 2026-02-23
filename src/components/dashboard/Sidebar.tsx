"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LayoutDashboard, Users, LogOut, ChevronRight, ChevronDown, X, Briefcase, Shield, CreditCard, Activity, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"

interface NavItem {
    label: string
    href: string
    icon: any
    subItems?: { label: string; href: string }[]
    roles?: string[]
}

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
    {
        title: "Overview",
        items: [
            { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ]
    },
    {
        title: "Recruitment",
        items: [
            {
                label: "Applications",
                icon: Briefcase,
                href: "#",
                subItems: [
                    { label: "All Applicants", href: "/dashboard/hr/applications" },
                    { label: "Job Roles", href: "/dashboard/hr/roles" }
                ]
            },
        ]
    },
    {
        title: "Mitra",
        items: [
            {
                label: "Transactions",
                href: "/dashboard/transactions",
                icon: CreditCard,
            },
            {
                label: "Mitra Aktif",
                href: "/dashboard/mitra",
                icon: Activity,
            }
        ]
    },
    {
        title: "Affiliate",
        items: [
            {
                label: "Withdrawals",
                href: "/dashboard/withdrawals",
                icon: Wallet,
            }
        ]
    },
    {
        title: "System",
        items: [
            {
                label: "User Management",
                href: "/dashboard/users",
                icon: Users,
                roles: ["admin", "superadmin"]
            }
        ]
    }
]

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [openMenus, setOpenMenus] = useState<string[]>(["Applications"])
    const userRole = session?.user?.role || "user"

    const toggleMenu = (label: string) => {
        setOpenMenus(prev =>
            prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
        )
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                "w-72 bg-[#0F172A] border-r border-[#1E293B] flex-col h-full font-sans text-slate-300 shadow-2xl z-50",
                "fixed inset-y-0 left-0 transition-transform duration-300 ease-in-out",
                "md:translate-x-0 md:static md:flex",
                isOpen ? "translate-x-0 flex" : "-translate-x-full hidden"
            )}>
                {/* Header / Brand */}
                <div className="h-20 flex items-center px-8 border-b border-[#1E293B] justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                            U
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">UCentric</span>
                    </Link>
                    {/* Close Button Mobile */}
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-8 no-scrollbar">
                    {NAV_SECTIONS.map((section, idx) => {
                        // Filter items based on role
                        const visibleItems = section.items.filter(item =>
                            !item.roles || item.roles.includes(userRole)
                        )

                        if (visibleItems.length === 0) return null

                        return (
                            <div key={idx}>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">
                                    {section.title}
                                </div>
                                <div className="space-y-1">
                                    {visibleItems.map((item) => {
                                        const isParentActive = item.subItems?.some(sub => pathname === sub.href)
                                        const isOpenMenu = openMenus.includes(item.label)

                                        if (item.subItems) {
                                            return (
                                                <div key={item.label} className="space-y-1">
                                                    <button
                                                        onClick={() => toggleMenu(item.label)}
                                                        className={cn(
                                                            "w-full group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                                            isParentActive ? "text-white" : "text-slate-400 hover:text-primary hover:bg-white/5"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className={cn("w-5 h-5 transition-colors", isParentActive ? "text-primary" : "text-slate-500 group-hover:text-primary")} />
                                                            <span>{item.label}</span>
                                                        </div>
                                                        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpenMenu ? "rotate-180" : "")} />
                                                    </button>

                                                    <AnimatePresence>
                                                        {isOpenMenu && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="pl-12 pr-4 space-y-1 py-1">
                                                                    {item.subItems.map((sub: { label: string; href: string }) => {
                                                                        const isSubActive = pathname === sub.href
                                                                        return (
                                                                            <Link
                                                                                key={sub.href}
                                                                                href={sub.href}
                                                                                className={cn(
                                                                                    "block py-2 px-3 rounded-lg text-sm transition-colors",
                                                                                    isSubActive ? "bg-primary/10 text-primary font-medium" : "text-slate-500 hover:text-slate-300"
                                                                                )}
                                                                            >
                                                                                {sub.label}
                                                                            </Link>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )
                                        }

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
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-[#1E293B] bg-[#0F172A]">
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-all group border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
