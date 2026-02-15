'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import { AlertTriangle, RefreshCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4 animate-in fade-in zoom-in duration-300">
         <AlertTriangle className="w-10 h-10 text-destructive" />
      </div>
      
      <div className="space-y-2">
         <h2 className="text-3xl font-bold tracking-tight">Something went wrong!</h2>
         <p className="text-muted-foreground max-w-[500px]">
            We apologize for the inconvenience. An unexpected error has occurred. 
            The specific page you were trying to view has encountered an issue.
         </p>
         {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-left text-xs font-mono max-w-lg mx-auto overflow-auto border border-border">
               <p className="text-destructive font-bold mb-2">{error.name}: {error.message}</p>
               <p className="opacity-70">{error.digest && `Digest: ${error.digest}`}</p>
            </div>
         )}
      </div>

      <div className="flex gap-4 pt-4">
         <Button
            onClick={
               // Attempt to recover by trying to re-render the segment
               () => reset()
            }
            className="gap-2"
         >
            <RefreshCcw className="w-4 h-4" />
            Try again
         </Button>
         <Button variant="outline" onClick={() => window.location.href = '/'}>
            Return Home
         </Button>
      </div>
    </div>
  )
}
