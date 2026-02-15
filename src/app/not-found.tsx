import Link from 'next/link'
import { Button } from "@/components/ui/Button"
import { FileQuestion, ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center space-y-6">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6 animate-pulse">
         <FileQuestion className="w-12 h-12 text-muted-foreground" />
      </div>
      
      <div className="space-y-2">
         <h1 className="text-7xl font-extrabold text-primary/20">404</h1>
         <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
         <p className="text-muted-foreground max-w-[400px]">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
         </p>
      </div>

      <div className="flex items-center gap-4 pt-4">
         <Button asChild variant="default">
            <Link href="/" className="gap-2">
               <Home className="w-4 h-4" />
               Return Home
            </Link>
         </Button>
         <Button asChild variant="outline">
            <Link href="/portfolio" className="gap-2">
               <ArrowLeft className="w-4 h-4" />
               Go Back
            </Link>
         </Button>
      </div>
    </div>
  )
}
