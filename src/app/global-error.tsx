'use client'
 
import { Button } from "@/components/ui/Button"
import { AlertTriangle, RefreshCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-6 bg-background text-foreground">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Critical Error</h2>
                <p className="text-muted-foreground max-w-[500px]">
                    A critical error occurred in the root layout. The application cannot render.
                </p>
            </div>

            <Button onClick={() => reset()} className="gap-2">
                <RefreshCcw className="w-4 h-4" />
                Try again
            </Button>
        </div>
      </body>
    </html>
  )
}
