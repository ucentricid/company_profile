import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { About } from "@/components/sections/About";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { Blog } from "@/components/sections/Blog";
import type { Metadata } from 'next'
import { CareerCTA } from "@/components/sections/CareerCTA";

export const metadata: Metadata = {
  title: "Home",
  description: "Your Partner in IT Digital Product Development",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
       <Hero />
       <Services />
       <ProductShowcase />
       <PortfolioPreview />
       <About />
       <Team />
       <Testimonials />
       <Blog />
       <CareerCTA />
    </main>
  );
}
