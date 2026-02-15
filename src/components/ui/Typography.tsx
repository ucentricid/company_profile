import * as React from "react"
import { cn } from "@/lib/utils"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  variant?: "h1" | "h2" | "h3" | "h4"
  gradient?: boolean
}

export function Heading({ 
  children, 
  className, 
  variant = "h2", 
  gradient = false,
  ...props 
}: HeadingProps) {
  const variants = {
    h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "text-3xl font-bold tracking-tight lg:text-4xl",
    h3: "text-2xl font-bold tracking-tight",
    h4: "text-xl font-semibold tracking-tight",
  }

  const Tag = variant

  return (
    <Tag 
      className={cn(
        variants[variant],
        gradient && "text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-yellow-500",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  variant?: "default" | "muted" | "large" | "small"
}

export function Text({ 
  children, 
  className, 
  variant = "default", 
  ...props 
}: TextProps) {
  const variants = {
    default: "leading-7 text-foreground/90",
    muted: "text-muted-foreground leading-relaxed",
    large: "text-lg font-medium text-foreground",
    small: "text-sm font-medium leading-none",
  }

  return (
    <p 
      className={cn(variants[variant], className)}
      {...props}
    >
      {children}
    </p>
  )
}
