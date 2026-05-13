import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { ProductShowcase, type ProductData } from "@/components/sections/ProductShowcase";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { About } from "@/components/sections/About";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { Blog } from "@/components/sections/Blog";
import type { Metadata } from 'next'
import { CareerCTA } from "@/components/sections/CareerCTA";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Home",
  description: "Your Partner in IT Digital Product Development",
}

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Fetch static settings
  const settingsDb = await db.siteSetting.findMany();
  const settings = settingsDb.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
  }, {} as Record<string, string>);

  // Fetch list data
  const servicesData = await db.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  const teamData = await db.teamMember.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  const testimonialsData = await db.testimonial.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  const productsData = await db.product.findMany({ where: { isActive: true }, orderBy: { order: "asc" }, select: { name: true, slug: true, tagline: true, description: true, iconName: true, features: true } }) as ProductData[];
  
  const featuredProjectsData = await db.companyProject.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
       <Hero settings={settings} />
       <Services data={servicesData} />
       <ProductShowcase products={productsData} />
       <PortfolioPreview data={featuredProjectsData} />
       <About settings={settings} />
       <Team data={teamData} />
       <Testimonials data={testimonialsData} />
       <Blog />
       <CareerCTA settings={settings} />
    </main>
  );
}
