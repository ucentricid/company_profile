import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { db } from "@/lib/db"
import ArticleDetailClient from "@/components/articles/ArticleDetailClient"

interface ArticleDetailPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
    const { slug } = await params
    const article = await db.article.findUnique({
        where: { slug }
    })

    if (!article) {
        return {
            title: "Article Not Found"
        }
    }

    return {
        title: article.title,
        description: article.excerpt || `Read ${article.title} on Ucentric Journal`,
    }
}

export async function generateStaticParams() {
    const articles = await db.article.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true }
    })

    return articles.map((article) => ({
        slug: article.slug
    }))
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
    const { slug } = await params

    // Fetch the article by slug
    const article = await db.article.findUnique({
        where: { 
            slug,
            status: "PUBLISHED"
        }
    })

    // 404 if article not found
    if (!article) {
        notFound()
    }

    // Fetch related articles (same category, excluding current article)
    const relatedArticles = await db.article.findMany({
        where: {
            status: "PUBLISHED",
            category: article.category,
            NOT: { id: article.id }
        },
        orderBy: { createdAt: "desc" },
        take: 3
    })

    // If not enough articles in same category, get other recent articles
    if (relatedArticles.length < 3) {
        const additionalArticles = await db.article.findMany({
            where: {
                status: "PUBLISHED",
                NOT: { id: article.id }
            },
            orderBy: { createdAt: "desc" },
            take: 3 - relatedArticles.length
        })
        
        // Add additional articles that aren't already in the list
        for (const additional of additionalArticles) {
            if (!relatedArticles.find(a => a.id === additional.id)) {
                relatedArticles.push(additional)
            }
        }
    }

    // Serialize dates to strings for client component
    const serializedArticle = {
        ...article,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString()
    }

    const serializedRelatedArticles = relatedArticles.map(a => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString()
    }))

    return (
        <ArticleDetailClient 
            article={serializedArticle} 
            relatedArticles={serializedRelatedArticles}
        />
    )
}
