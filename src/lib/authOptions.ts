import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import type { JWT } from "next-auth/jwt";
import type { Session, User, Account } from "next-auth";

// Authentication configuration for NextAuth.js

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("Missing credentials");
        const client = await clientPromise;
        const db = client.db("stockmarketDatabase");
        const user = await db.collection("users").findOne({ email: credentials.email });

        if (!user) throw new Error("User not found");
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || "User",
          role: (user as { role?: string }).role || "user", // Include role
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt" as const,
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }) {
      // Save Google user to DB if new
      if (account && account.provider === "google" && user && user.email) {
        const client = await clientPromise;
        const db = client.db("stockmarketDatabase");
        const existingUser = await db.collection("users").findOne({ email: user.email });
        if (!existingUser) {
          await db.collection("users").insertOne({
            email: user.email,
            name: user.name || "Google User",
            image: user.image || null,
            provider: "google",
            role: "user", // Default role for Google users
            createdAt: new Date(),
          });
          token.role = "user";
        } else {
          token.role = existingUser.role || "user";
        }
      }
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as { role?: string }).role || token.role || "user";
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        (session.user as typeof token) = {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
        };
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
