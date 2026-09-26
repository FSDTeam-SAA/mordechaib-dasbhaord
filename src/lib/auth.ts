import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authRequest } from "./auth-api";

type LoginResponse = {
  success: boolean;
  message: string;
  data?: {
    user?: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      role: string;
      avatarUrl?: string;
    };
    refreshToken?: string;
    accessToken?: string;
  };
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/signin" },
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token-delivaryboy",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        rememberMe: { label: "Remember me", type: "checkbox" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email?.trim() || !credentials.password)
          throw new Error("Please enter your email and password.");
        const response = await authRequest<LoginResponse>("/auth/login", {
          email: credentials.email.trim(),
          password: credentials.password,
          rememberMe: credentials.rememberMe === "true",
        });
        if (response.success !== true)
          throw new Error(response.message || "Login failed.");
        const user = response.data?.user;
        const accessToken = response.data?.accessToken;
        if (!user?.id || !user.email || !user.role || !accessToken)
          throw new Error("Invalid login response from the server.");
        return {
          id: user.id,
          name:
            [user.firstName, user.lastName].filter(Boolean).join(" ") ||
            user.email.split("@")[0],
          email: user.email,
          role: user.role,
          image: user.avatarUrl || null,
          profileImage: user.avatarUrl || null,
          accessToken,
          refreshToken: response.data?.refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.profileImage = user.profileImage;
        token.accessToken = user.accessToken;
        // Keep the refresh token in NextAuth's encrypted HTTP-only JWT cookie.
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = {
        ...session.user,
        id: token.id,
        name: token.name,
        email: token.email,
        image: token.profileImage,
        role: token.role,
        profileImage: token.profileImage,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
};
