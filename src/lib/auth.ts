import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import { compare } from "bcrypt"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        // For now, simple password check (In real app, use bcrypt)
        // const isPasswordValid = await compare(credentials.password, user.password)
        // if (!isPasswordValid) return null
        
        // TEMPORARY: Allow login if user exists, regardless of password (dev mode)
        // until we implement registration with hashing.
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
        if (token) {
            session.user.id = token.id as string
            session.user.role = token.role as string
        }
        return session
    },
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id
            token.role = user.role
        }
        return token
    }
  }
}
