import { prisma } from "@/lib/prisma";

export async function GET() {
    try{
        const users = await prisma.user.findMany();

        return Response.json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: "Database connection failed"
        })
    }
}