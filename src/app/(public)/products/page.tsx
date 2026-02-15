import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore our innovative digital solutions.",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 pt-20">
      <ProductShowcase />
      {/* 
        In a real scenario, this page would likely have a different layout 
        or a full grid of all products, but for now re-using the immersive 
        showcase ensures consistency and meets the "immersive" requirement.
        We can expand this later.
      */}
      <div className="container mx-auto px-4 py-24 text-center text-white">
          <p className="text-neutral-400">More products coming soon...</p>
      </div>
    </main>
  );
}
