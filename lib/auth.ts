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
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
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

    session: {
        strategy: "jwt",
    },

    secret: process.env.AUTH_SECRET,
};