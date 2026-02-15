"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getApplications() {
  try {
    const apps = await prisma.internshipApplication.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: apps }
  } catch (error) {
    return { success: false, error: "Failed to fetch applications" }
  }
}

export async function createApplication(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const university = formData.get("university") as string
    const major = formData.get("major") as string
    const roleType = formData.get("roleType") as string
    const motivation = formData.get("motivation") as string
    const cvUrl = "https://placeholder.com/cv.pdf" // Mock for now until file upload is real
    
    // Map roleType value to a readable title
    const roleTitles: Record<string, string> = {
      frontend: "Frontend Developer Intern",
      uiux: "UI/UX Designer Intern",
      content: "Content Creator Intern",
      backend: "Backend Developer Intern"
    }
    const roleTitle = roleTitles[roleType] || roleType

    await prisma.internshipApplication.create({
      data: {
        firstName,
        lastName,
        email,
        university,
        major,
        semester: "N/A", // Default for manual entry if not asked
        roleType,
        roleTitle,
        motivation,
        cvUrl,
        portfolioUrl: formData.get("portfolioUrl") as string || null,
        status: "PENDING"
      }
    })

    revalidatePath("/dashboard/hr/applications")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to create application" }
  }
}
