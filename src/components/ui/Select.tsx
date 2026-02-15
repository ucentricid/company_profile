"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  label: string
  value: string
  icon?: any
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
}

export function Select({ options, value, onChange, placeholder = "Select an option", className, label }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className={cn("relative space-y-2", className)} ref={containerRef}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between h-12 px-4 rounded-xl border bg-gray-50 text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/20",
            isOpen ? "border-primary ring-2 ring-primary/20 bg-white" : "border-gray-200 hover:border-gray-300",
            !selectedOption && "text-muted-foreground"
          )}
        >
          <span className="flex items-center gap-2 truncate">
             {selectedOption?.icon && <selectedOption.icon className="w-4 h-4 text-primary" />}
             <span className={cn(!selectedOption && "text-gray-400")}>
               {selectedOption ? selectedOption.label : placeholder}
             </span>
          </span>
          <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors hover:bg-orange-50",
                      value === option.value ? "bg-orange-50 text-primary font-medium" : "text-gray-700"
                    )}
                  >
                    <span className="flex items-center gap-3">
                       {option.icon && <option.icon className={cn("w-4 h-4", value === option.value ? "text-primary" : "text-gray-400")} />}
                       {option.label}
                    </span>
                    {value === option.value && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
