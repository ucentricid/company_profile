import type { Metadata } from "next";
import { Poppins, Red_Hat_Display } from "next/font/google"; // Import Fonts
import "./globals.css";

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
  metadataBase: new URL("https://ucentric.id"), 
  title: {
    default: "UCentric - Digital Transformation Partner",
    template: `%s | UCentric`,
  },
  description: "Leading software house specializing in enterprise digital transformation, AI solutions, and custom software development. We build the future of your business.",
  keywords: [
    "Software House", 
    "Digital Transformation", 
    "AI Solutions", 
    "Web Development", 
    "Mobile App Development", 
    "Enterprise Software", 
    "IT Consultant", 
    "Indonesia Technology"
  ],
  authors: [
    {
      name: "UCentric Team",
      url: "https://ucentric.id",
    },
  ],
  creator: "UCentric",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ucentric.id",
    title: "UCentric - Digital Transformation Partner",
    description: "Accelerating business growth through innovative technology solutions. From AI to Enterprise Systems.",
    siteName: "UCentric",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "UCentric - Digital Future",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UCentric - Digital Transformation Partner",
    description: "Building the future of digital enterprise. Explore our solutions.",
    images: ["/og-image.jpg"],
    creator: "@ucentric_id",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
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
        {children}
      </body>
    </html>
  );
}
