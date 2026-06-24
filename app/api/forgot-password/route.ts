import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists, a reset link has been sent.",
        },
        {
          status: 200,
        }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(
      Date.now() + 1000 * 60 * 60
    );

    await prisma.passwordResetToken.deleteMany({
      where: {
        email,
      },
    });

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    const resetLink =
      `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your BuilderOS password",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Reset Your Password</h2>

        <p>
          Click the button below to reset your BuilderOS password.
        </p>

        <a
          href="${resetLink}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:black;
            color:white;
            text-decoration:none;
            border-radius:8px;
          "
        >
          Reset Password
        </a>

        <p style="margin-top:20px;">
          This link expires in 1 hour.
        </p>
      </div>
    `,
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