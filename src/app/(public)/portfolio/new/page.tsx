import type { Metadata } from 'next'
import NewPortfolioClient from "@/components/portfolio/NewPortfolioClient"

export const metadata: Metadata = {
   title: "Tambah Portofolio | Ucentric",
   description: "Buat postingan portofolio baru.",
}

export default function NewPortfolioPage() {
   return <NewPortfolioClient />
}
