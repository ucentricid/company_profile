import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const status = searchParams.get("status")
    const slug = searchParams.get("slug")
    const session = await getServerSession(authOptions)

    if (slug) {
      const post = await db.portfolioPost.findUnique({
        where: { slug },
        include: {
          User: {
            select: { name: true, image: true }
          }
        }
      })
      return NextResponse.json(post)
    }
    
    // Default filter
    let whereClause: any = {}

    if (username) {
      const decodedUsername = decodeURIComponent(username).trim()
      whereClause.User = { 
        name: { equals: decodedUsername, mode: 'insensitive' } 
      }
      
      const sessionUserName = session?.user?.name || ""
      const isMatch = sessionUserName.toLowerCase() === decodedUsername.toLowerCase()

      console.log(`[DEBUG] Fetching portfolio for: "${decodedUsername}"`);
      console.log(`[DEBUG] Session User: "${sessionUserName}"`);
      console.log(`[DEBUG] Is Owner: ${isMatch}`);

      if (!session || (!isMatch && session.user.role !== "admin" && session.user.role !== "superadmin")) {
        whereClause.status = "APPROVED"
      } else if (status && status !== "ALL") {
        whereClause.status = status
      }
    } else {
      // No username provided. 
      if (session?.user?.role === "admin" || session?.user?.role === "superadmin") {
         if (status) {
           whereClause.status = status
         }
      } else {
        // Public feed: only APPROVED
        whereClause.status = "APPROVED"
      }
    }

    const posts = await db.portfolioPost.findMany({
      where: whereClause,
      include: {
        User: {
          select: { name: true, image: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`[DEBUG] Found ${posts.length} posts for clause:`, JSON.stringify(whereClause));
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Failed to fetch portfolios:", error)
    return NextResponse.json(
      { message: "Failed to fetch portfolios" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, content, imageUrl, projectUrl, status } = body

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 })
    }

    // Simple slug generator
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6)

    const post = await db.portfolioPost.create({
      data: {
        title,
        slug,
        description,
        content,
        imageUrl,
        projectUrl,
        status: status || "DRAFT",
        userId: session.user.id
      }
    })

    return NextResponse.json({ post, message: "Portfolio post created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Failed to create portfolio:", error)
    return NextResponse.json(
      { message: "Failed to create portfolio post" },
      { status: 500 }
    )
  }
}
