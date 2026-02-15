import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { About } from "@/components/sections/About";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { Blog } from "@/components/sections/Blog";
import { CareerCTA } from "@/components/sections/CareerCTA";

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
