import { Metadata } from "next"
import PortfolioCMSClient from "@/components/dashboard/PortfolioCMSClient"

export const metadata: Metadata = {
  title: "Kelola Portofolio | Ucentric Dashboard",
  description: "Manajemen dan review portofolio pengguna",
}

export default function PortfolioCMSPage() {
  return <PortfolioCMSClient />
}
