import type { Metadata } from "next";
import UkasirNavbar from "@/components/ukasir/Navbar";
import UkasirFooter from "@/components/ukasir/Footer";
import "@/styles/ukasir.css";

export const metadata: Metadata = {
  title: "uKasir - Aplikasi Kasir Offline UMKM #1 di Indonesia",
  description: "Aplikasi kasir sederhana, cepat, dan stabil untuk UMKM. Tanpa biaya bulanan, cukup beli sekali pakai selamanya. Mendukung Offline Mode & Printer Thermal.",
  keywords: ["aplikasi kasir", "pos system offline", "kasir umkm", "software kasir murah", "ukasir indonesia"],
  openGraph: {
    title: "uKasir | Solusi Kasir Offline UMKM Terbaik",
    description: "Transaksi lebih cepat, laporan otomatis, dan tidak perlu biaya bulanan.",
    images: ["/images/ukasir-og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "uKasir - Aplikasi Kasir Offline UMKM",
    description: "Beli sekali, pakai selamanya. Solusi cerdas UMKM Indonesia.",
    images: ["/images/ukasir-og.png"],
  },
};

export default function UkasirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 font-[family-name:var(--font-outfit)]">
      <UkasirNavbar />
      <main className="flex-1">
        {children}
      </main>
      <UkasirFooter />
    </div>
  );
}
