import { Metadata } from "next"
import { LoginPageClient } from "@/components/auth/LoginPageClient"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  return <LoginPageClient />
}
