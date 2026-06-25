import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const {
      currentPassword,
      newPassword,
    } = await req.json();

    const user =
      await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

    if (!user || !user.password) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!passwordMatch) {
      return NextResponse.json(
        {
          error:
            "Current password is incorrect",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}