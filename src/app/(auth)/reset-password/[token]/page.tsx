import { Metadata } from "next"
import { ResetPasswordPageClient } from "@/components/auth/ResetPasswordPageClient"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set your new password",
}

export default function ResetPasswordPage({
  params,
}: {
  params: { token: string }
}) {
  return <ResetPasswordPageClient token={params.token} />
}
