"use client"

import { usePathname } from "next/navigation"
import { Bell, Search, Menu, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Input } from "@/components/ui/Input"

import { useSession } from "next-auth/react"

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { data: session } = useSession()
  const user = session?.user

  // Initials generator
  const initials = user?.name
      ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
      : "U"

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      
      {/* Left Area: Toggle (Mobile Only) */}
      <div className="flex items-center gap-6 flex-1">
         <button 
            className="text-gray-500 hover:text-indigo-600 transition-colors md:hidden"
            onClick={onMenuClick}
         >
            <Menu className="w-6 h-6" />
         </button>
      </div>

      {/* Right Area: Actions */}
      <div className="flex items-center gap-4">
         {/* Notifications */}
         <Button variant="ghost" size="icon" className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full h-10 w-10 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white pointer-events-none" />
         </Button>

         {/* Profile */}
         <div className="pl-4 border-l border-gray-100 flex items-center gap-3">
             <div className="text-right hidden md:block">
                 <div className="text-sm font-medium text-gray-900">{user?.name || "Guest"}</div>
                 <div className="text-xs text-gray-500 capitalize">{user?.role || "Visitor"}</div>
             </div>
             <Avatar className="h-10 w-10 border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-indigo-100 transition-all bg-indigo-50">
                {/* Dynamically could load user image here if available */}
                <AvatarFallback className="text-indigo-600 font-bold bg-indigo-50 text-sm">
                    {initials}
                </AvatarFallback>
             </Avatar>
         </div>
      </div>
    </header>
  )
}
