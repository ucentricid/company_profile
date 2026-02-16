import CareerPageClient from "@/components/career/CareerPageClient"

export default async function CareerRolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <CareerPageClient initialSlug={slug} />
}
