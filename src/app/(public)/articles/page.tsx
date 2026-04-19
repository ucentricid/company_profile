import type { Metadata } from 'next'
import { db } from "@/lib/db"
import ArticlesPageClient from "@/components/articles/ArticlesPageClient"

export const metadata: Metadata = {
  title: "Articles",
  description: "Insights, trends, and thoughts from our team.",
}

export default async function ArticlesPage() {
  // Fetch all published articles
  const articles = await db.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" }
  })

  // Get unique categories
  const categories = await db.article.findMany({
    where: { status: "PUBLISHED" },
    select: { category: true },
    distinct: ['category']
  })

  const categoryList = ["All", ...categories.map(c => c.category)]

  // Serialize dates to strings for client component
  const serializedArticles = articles.map(a => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString()
  }))

  // Separate featured and trending
  const featuredArticle = serializedArticles.find(a => a.isFeatured) || serializedArticles[0] || null
  const trendingArticles = serializedArticles.filter(a => a.isTrending).slice(0, 3)
  const latestArticles = serializedArticles.filter(a => a.id !== featuredArticle?.id).slice(0, 10)

  return (
    <ArticlesPageClient 
      articles={serializedArticles}
      categories={categoryList}
      featuredArticle={featuredArticle}
      trendingArticles={trendingArticles}
      latestArticles={latestArticles}
    />
  )
}
