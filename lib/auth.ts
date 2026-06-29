import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.username },
                })

                if (!user) return null

                const valid = await bcrypt.compare(credentials.password, user.password)
                if (!valid) return null

                return { id: user.id, email: user.email, role: user.role }
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}