import { MetadataRoute } from "next"
import { db } from "@/lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ucentric.id"

    // Static routes
    const staticRoutes = [
        "",
        "/about",
        "/products",
        "/products/ukasir",
        "/products/u-cademic",
        "/portfolio",
        "/articles",
        "/career",
        "/contact",
        "/login",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.8,
    }))

    // Dynamic routes - Articles
    const articles = await db.article.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
    })

    const articleRoutes = articles.map((article) => ({
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }))

    // Dynamic routes - Portfolio Posts
    const portfolioPosts = await db.portfolioPost.findMany({
        where: { status: "APPROVED" },
        select: { slug: true, updatedAt: true },
    })

    const portfolioRoutes = portfolioPosts.map((post) => ({
        url: `${baseUrl}/portfolio/p/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }))

    // Dynamic routes - Company Projects
    const companyProjects = await db.companyProject.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true },
    })

    const projectRoutes = companyProjects.map((project) => ({
        url: `${baseUrl}/portfolio/company/${project.id}`,
        lastModified: project.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }))

    return [...staticRoutes, ...articleRoutes, ...portfolioRoutes, ...projectRoutes]
}
