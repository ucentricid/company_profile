import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  className?: string
  id?: string
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ children, className, id, ...props }, ref) => {
    return (
      <section 
        ref={ref}
        id={id}
        className={cn(
          "relative w-full py-20 md:py-32 overflow-hidden", // Standardized vertical padding (80px mobile, 128px desktop)
          className
        )}
        {...props}
      >
         <div className="container mx-auto px-6 md:px-12 relative z-10">
           {children}
         </div>
      </section>
    )
  }
)
Section.displayName = "Section"

export { Section }
