import { ProductShowcase, type ProductData } from "@/components/sections/ProductShowcase";
import { db } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore our innovative digital solutions.",
};

export default async function ProductsPage() {
  let products: ProductData[] = []

  try {
    const dbProducts = await db.product.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        name: true,
        slug: true,
        tagline: true,
        description: true,
        iconName: true,
        features: true,
      }
    })
    products = dbProducts as ProductData[]
  } catch (error) {
    console.error("Failed to fetch products:", error)
    // ProductShowcase will use its default fallback products
  }

  return (
    <main className="min-h-screen bg-neutral-950 pt-20">
      <ProductShowcase products={products} />
    </main>
  );
}
