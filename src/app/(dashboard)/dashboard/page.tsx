import type { Metadata } from 'next'
import { Heading } from "@/components/ui/Typography"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default function DashboardPage() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-4">
      <Heading variant="h1" className="text-5xl font-black text-indigo-950">
        Welcome to Dashboard
      </Heading>
      <p className="text-gray-500 text-lg max-w-md">
        Select an option from the sidebar to get started managing your content.
      </p>
    </div>
  )
}
