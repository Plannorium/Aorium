import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";
import { PasswordResetEmail } from "../../../../../emails/password-reset";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal that the user doesn't exist
      return NextResponse.json({
        message:
          "If a user with that email exists, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { email },
      data: { passwordResetToken, passwordResetExpires },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/password/reset/${resetToken}`;

    await resend.emails.send({
      from: "Aorium <onboarding@resend.dev>",
      to: [email],
      subject: "Your Aorium Password Reset Request",
      react: PasswordResetEmail({ resetUrl }) as React.ReactElement,
    });

    return NextResponse.json({
      message:
        "If a user with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("REQUEST_PASSWORD_RESET_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
