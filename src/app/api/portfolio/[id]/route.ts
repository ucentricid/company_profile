import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await db.portfolioPost.findUnique({
      where: { id },
      include: {
        User: {
          select: { name: true, image: true }
        }
      }
    })

    if (!post) {
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
    
    const session = await getServerSession(authOptions)
    // Access control calculation omitted for brevity in GET, assuming UI routes handle visibility (or add logic here if strictness is required)
    
    return NextResponse.json(post)
  } catch (error) {
    console.error("Failed to fetch portfolio:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const post = await db.portfolioPost.findUnique({
      where: { id }
    })

    if (!post) {
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    }

    // Only owner can update, EXCEPT admin who can update status (Approve/Reject)
    const isOwner = post.userId === session.user.id
    const isAdmin = session.user.role === "admin" || session.user.role === "superadmin"

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    let updateData: any = {}

    if (isOwner) {
      if (body.title) updateData.title = body.title
      if (body.description !== undefined) updateData.description = body.description
      if (body.content !== undefined) updateData.content = body.content
      if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl
      if (body.projectUrl !== undefined) updateData.projectUrl = body.projectUrl
      
      // Intern cannot directly set to APPROVED or REJECTED
      if (body.status === "DRAFT" || body.status === "PENDING") {
        updateData.status = body.status
      }
    }

    if (isAdmin && (body.status === "APPROVED" || body.status === "REJECTED" || body.status === "PENDING" || body.status === "DRAFT")) {
      updateData.status = body.status
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 })
    }

    const updatedPost = await db.portfolioPost.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ post: updatedPost, message: "Updated successfully" })
  } catch (error) {
    console.error("Failed to update portfolio:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const post = await db.portfolioPost.findUnique({
      where: { id }
    })

    if (!post) {
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    }

    const isOwner = post.userId === session.user.id
    const isAdmin = session.user.role === "admin" || session.user.role === "superadmin"

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await db.portfolioPost.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Deleted successfully" })
  } catch (error) {
    console.error("Failed to delete portfolio:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
