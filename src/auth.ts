import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import type { User as AppUser } from "@/lib/types"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: 'admin' | 'user'
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    role: 'admin' | 'user'
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    role: 'admin' | 'user'
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Dynamic import to avoid Edge Runtime issues
        const { getUserByEmail, verifyPassword } = await import("@/lib/users")

        // Find user by email
        const user = await getUserByEmail(email)

        if (!user || !user.password) {
          return null
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password)

        if (!isValidPassword) {
          return null
        }

        // Return user object (password excluded)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers (Google), create user if doesn't exist
      if (account?.provider === "google" && user.email) {
        // Dynamic import to avoid Edge Runtime issues
        const { getUserByEmail, createUser } = await import("@/lib/users")
        const existingUser = await getUserByEmail(user.email)

        if (!existingUser) {
          await createUser({
            name: user.name || 'Unknown',
            email: user.email,
            image: user.image,
            role: 'user', // Default role for OAuth users
          })
        }
      }

      return true
    },
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // Update token when session is updated
      if (trigger === "update") {
        // Dynamic import to avoid Edge Runtime issues
        const { getUserById } = await import("@/lib/users")
        const dbUser = await getUserById(token.id)
        if (dbUser) {
          token.role = dbUser.role
          token.name = dbUser.name
          token.email = dbUser.email
          token.picture = dbUser.image
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
})
