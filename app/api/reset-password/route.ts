import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } =
      await req.json();

    const resetToken =
      await prisma.passwordResetToken.findUnique(
        {
          where: {
            token,
          },
        }
      );

    if (!resetToken) {
      return NextResponse.json(
        {
          error: "Invalid token",
        },
        {
          status: 400,
        }
      );
    }

    if (
      resetToken.expiresAt < new Date()
    ) {
      return NextResponse.json(
        {
          error: "Token expired",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        email: resetToken.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
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