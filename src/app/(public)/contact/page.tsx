import type { Metadata } from 'next'
import ContactPageClient from "@/components/contact/ContactPageClient"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with us to start your digital transformation.",
}

export default function ContactPage() {
  return <ContactPageClient />
}
