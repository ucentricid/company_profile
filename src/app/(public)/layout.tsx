import { Header } from "@/components/layout/Header";
import { FooterServer } from "@/components/layout/FooterServer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <FooterServer />
    </div>
  );
}
