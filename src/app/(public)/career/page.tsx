import type { Metadata } from 'next'
import CareerPageClient from "@/components/career/CareerPageClient"

export const metadata: Metadata = {
  title: "Career",
  description: "Join our team and help build the future.",
}

export default function CareerPage() {
  return <CareerPageClient />
}
