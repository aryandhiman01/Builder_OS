import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try{
        const body = await req.json();

        const { name, email, password } = body;

        if(!name || !email|| !password) {
            return NextResponse.json(
                { error: "All fields are required"},
                { status: 400}
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if(existingUser) {
            return NextResponse.json(
                { error: "User already exists"},
                { status: 409}
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        const { password: _, ...safeUser } = user;

        return NextResponse.json(safeUser, {
        status: 201,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Something Went wrong" },
            { status: 500}
        );
    }
}