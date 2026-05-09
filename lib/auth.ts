import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";

type DemoAuthUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: "COMPANY" | "EMPLOYEE";
};

type DemoSessionUser = {
  role?: unknown;
  id?: unknown;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Demo credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || user.password !== credentials.password) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        } satisfies DemoAuthUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const demoUser = user as DemoAuthUser;
        token.role = demoUser.role;
        token.userId = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const demoSessionUser = session.user as DemoSessionUser;
        demoSessionUser.role = token.role;
        demoSessionUser.id = token.userId ?? token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/company/login",
  },
};
