import type { Metadata } from 'next'
import PortfolioPageClient from "@/components/portfolio/PortfolioPageClient"

export const metadata: Metadata = {
   title: "Portfolio",
   description: "See our showcased projects and case studies.",
}

import { db } from "@/lib/db"

export default async function PortfolioPage() {
   // Fetch Company Projects
   const companyProjectsRaw = await db.companyProject.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" }
   })

   // Fetch Approved Academy Submissions
   const academyPostsRaw = await db.portfolioPost.findMany({
      where: { status: "APPROVED" },
      include: {
         User: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
   })

   // Map DB rows to the shape expected by the frontend
   const companyProjects = companyProjectsRaw.map(p => ({
      id: p.id,
      title: p.title,
      category: "Company Projects" as const,
      client: p.client,
      image: p.image || "bg-gradient-to-br from-blue-600 to-indigo-700",
      tags: p.tags,
      description: p.description,
      stats: p.stats,
      slug: p.id // using id as slug for now, or you could add slug to CompanyProject
   }))

   const academyPosts = academyPostsRaw.map(p => ({
      id: p.id,
      title: p.title,
      category: "Ucentric Academy" as const,
      author: p.User.name || "Intern",
      image: p.imageUrl || "bg-gradient-to-br from-orange-400 to-pink-500",
      tags: [], // Intern portfolio doesn't save tags as array in schema directly, it's inside content block, we'll just leave empty or parse if needed. Or we leave it empty.
      description: p.description || "",
      stats: "Verified",
      slug: p.slug
   }))

   // Combine
   const allProjects = [...companyProjects, ...academyPosts]

   return <PortfolioPageClient initialProjects={allProjects} />
}
