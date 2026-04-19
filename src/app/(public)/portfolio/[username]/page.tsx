import type { Metadata } from 'next'
import UserPortfolioClient from "@/components/portfolio/UserPortfolioClient"

export const metadata: Metadata = {
   title: "User Portfolio | Ucentric",
   description: "Lihat portofolio pengguna.",
}

export default async function UserPortfolioPage({ params }: { params: Promise<{ username: string }> }) {
   const { username } = await params
   return <UserPortfolioClient username={username} />
}
