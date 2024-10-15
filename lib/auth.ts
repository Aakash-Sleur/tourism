import { connectDB } from "./mongodb";
import User from "@/models/user.model";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email }).select(
          "+password"
        );

        if (!user) throw new Error("Wrong Email");

        const passwordMath = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!passwordMath) throw new Error("Wrong Password");

        // Add isAdmin to the returned user object
        return { id: user._id.toString(), isAdmin: user.isAdmin || false };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // Add isAdmin to the JWT token
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      // Add isAdmin to the session
      session.user.id = token.id as string;
      session.user.isAdmin = token.isAdmin as boolean;
      return session;
    },
  },
};
