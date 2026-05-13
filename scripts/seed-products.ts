// Seed script to insert the two default products (U-Kasir and U-Cademic) into the database
// Run with: npx tsx scripts/seed-products.ts

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding products...")

  // U-Kasir
  const ukasir = await prisma.product.upsert({
    where: { slug: "ukasir" },
    update: {},
    create: {
      name: "U-Kasir",
      slug: "ukasir",
      tagline: "Retail POS",
      description: "The complete Point of Sale system for modern retail. Manage inventory, track sales, and grow your business offline & online.",
      iconName: "ShoppingCart",
      features: ["Real-time Stock Management", "QRIS & Multi-payment", "Offline-First Architecture"],
      heroTitle: "Aplikasi Kasir Offline Terpercaya.",
      heroGradient: "from-blue-500 to-indigo-600",
      ctaText: "Request Demo",
      ctaLink: "/contact",
      isActive: true,
      order: 0,
    }
  })
  console.log("Created:", ukasir.name)

  // U-Cademic
  const ucademic = await prisma.product.upsert({
    where: { slug: "u-cademic" },
    update: {},
    create: {
      name: "U-Cademic",
      slug: "u-cademic",
      tagline: "Education",
      description: "A smart campus ecosystem connecting schools, parents, and students. Digitalize academic processes effortlessly.",
      iconName: "GraduationCap",
      features: ["Learning Management System (LMS)", "Digital Attendance & Report", "Parent-Teacher Portal"],
      heroTitle: "Smart Campus Ecosystem.",
      heroGradient: "from-orange-500 to-red-600",
      ctaText: "Request Demo",
      ctaLink: "/contact",
      isActive: true,
      order: 1,
    }
  })
  console.log("Created:", ucademic.name)

  console.log("Done! Products seeded.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
