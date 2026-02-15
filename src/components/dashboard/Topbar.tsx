"use client"

import { usePathname } from "next/navigation"
import { Bell, Search, Menu, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Input } from "@/components/ui/Input"

export function Topbar() {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      
      {/* Left Area: Toggle (Mobile Only) */}
      <div className="flex items-center gap-6 flex-1">
         <button className="text-gray-500 hover:text-indigo-600 transition-colors md:hidden">
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
         <div className="pl-4 border-l border-gray-100">
             <Avatar className="h-9 w-9 border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-indigo-100 transition-all">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AD</AvatarFallback>
             </Avatar>
         </div>
      </div>
    </header>
  )
}
