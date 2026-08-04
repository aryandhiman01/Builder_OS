import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

const handler = NextAuth(authOptions);

async function authHandler(
  req: NextRequest,
  context: { params: Promise<{ nextauth?: string[] }> }
) {
  const params = await context.params;
  return handler(req, { params });
}

export { authHandler as GET, authHandler as POST };