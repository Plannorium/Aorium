import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiry },
    });

    await resend.emails.send({
      from: "Aorium <onboarding@resend.dev>",
      to: [email],
      subject: "Your Aorium OTP",
      html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("SEND_OTP_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
