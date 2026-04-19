import { Metadata } from "next"
import { ForgotPasswordPageClient } from "@/components/auth/ForgotPasswordPageClient"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />
}
