import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) return null;

                const valid = await bcrypt.compare(credentials.password, user.password);
                if (!valid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (user) {
                token.role = (user as any).role;
                token.userId = user.id;
            }

            if (account?.provider === "google" && profile?.email) {
                const existing = await prisma.user.findUnique({
                    where: { email: profile.email },
                });

                if (existing) {
                    token.role = existing.role;
                    token.userId = existing.id;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.userId ?? token.sub;
            }
            return session;
        },
    },
    pages: {
        signIn: "/employer/login",
    },
};
