import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

import GithubProvider from "next-auth/providers/github";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),

        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {
                console.log("LOGIN ATTEMPT:", credentials);
                if(!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid Credentials");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if(!user || !user.password) {
                    throw new Error("User not found");
                }

                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.password,
                );

                if (!passwordMatch) {
                    throw new Error("Wrong password");
                }

                console.log("LOGIN SUCCESS:", user.email);
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            },
        }),
    ],

    pages: {
        signIn: "/login",
        error: "/login",
    },

    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours in seconds
        updateAge: 60 * 60,   // Refresh token age every 1 hour of active use
    },

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                if (user.name) token.name = user.name;
                if (user.image) token.picture = user.image;
            }
            if (trigger === "update" && session) {
                const updatedName = session.name ?? session.user?.name;
                const updatedImage = session.image ?? session.user?.image;
                if (updatedName !== undefined) token.name = updatedName;
                if (updatedImage !== undefined) token.picture = updatedImage;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                if (token.name) session.user.name = token.name;
                if (token.picture) session.user.image = token.picture;
            }

            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "builder-os-fallback-secret-key-2026",
};