import type { Metadata } from 'next'
import ArticlesPageClient from "@/components/articles/ArticlesPageClient"

export const metadata: Metadata = {
  title: "Articles",
  description: "Insights, trends, and thoughts from our team.",
}

export default function ArticlesPage() {
  return <ArticlesPageClient />
}
