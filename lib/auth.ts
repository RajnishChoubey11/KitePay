import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import Company from "@/models/Company";
import Employee from "@/models/Employee";

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

        // Handle demo users
        if (credentials.email === "company@kitepay.demo" && credentials.password === "demo123") {
          return {
            id: "demo-company-id",
            name: "KitePay Demo Company",
            email: "company@kitepay.demo",
            role: "COMPANY",
          } satisfies DemoAuthUser;
        }

        if (credentials.email === "employee@kitepay.demo" && credentials.password === "demo123") {
          return {
            id: "demo-employee-id",
            name: "Demo Employee",
            email: "employee@kitepay.demo",
            role: "EMPLOYEE",
          } satisfies DemoAuthUser;
        }

        await connectDB();

        // Try to find user in Company collection
        let user = await Company.findOne({ email: credentials.email });

        if (user && user.password === credentials.password) {
          return {
            id: user._id.toString(),
            name: user.companyName,
            email: user.email,
            role: "COMPANY",
          } satisfies DemoAuthUser;
        }

        // Try to find user in Employee collection
        user = await Employee.findOne({ email: credentials.email });

        if (user && user.password === credentials.password) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: "EMPLOYEE",
          } satisfies DemoAuthUser;
        }

        return null;
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
