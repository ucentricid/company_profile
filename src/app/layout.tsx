import type { Metadata } from "next";
import { Poppins, Red_Hat_Display } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

import { SITE_CONFIG } from "@/lib/constants";

// Configure Poppins Font (Body/General)
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Load necessary weights
  display: "swap",
});

// Configure Red Hat Display (Headings/Logo)
const redHatDisplay = Red_Hat_Display({
  variable: "--font-red-hat-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  icons: {
    icon: "/images/logo-ucentric-nobg.png", // Using the logo as favicon
    shortcut: "/images/logo-ucentric-nobg.png",
    apple: "/images/logo-ucentric-nobg.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${poppins.variable} ${redHatDisplay.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <AuthProvider>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
