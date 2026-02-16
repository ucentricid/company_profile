import type { Metadata } from 'next'
import PortfolioPageClient from "@/components/portfolio/PortfolioPageClient"

export const metadata: Metadata = {
   title: "Portfolio",
   description: "See our showcased projects and case studies.",
}

export default function PortfolioPage() {
   return <PortfolioPageClient />
}
