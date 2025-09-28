import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await req.json();

    const chat = await prisma.chat.update({
      where: {
        id: params.chatId,
        userId: session.user.id,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error updating chat name:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
