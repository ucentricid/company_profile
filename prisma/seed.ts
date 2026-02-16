import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const INITIAL_ROLES = [
  {
    title: "Frontend Developer Intern",
    department: "Engineering",
    type: "Internship (3 Months)",
    location: "Jakarta / Remote",
    isActive: true,
  },
  {
    title: "UI/UX Designer Intern",
    department: "Product Design",
    type: "Internship (3 Months)",
    location: "Hybrid",
    isActive: true,
  },
  {
    title: "Content Creator Intern",
    department: "Marketing",
    type: "Internship (3 Months)",
    location: "Remote",
    isActive: true,
  }
]

async function main() {
  console.log('Start seeding...')
  
  for (const role of INITIAL_ROLES) {
    const createdRole = await prisma.internshipRole.create({
      data: role,
    })
    console.log(`Created role with id: ${createdRole.id}`)
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
