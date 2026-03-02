import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireSession();
  if (auth.error || !auth.session) {
    return auth.error;
  }

  try {
    const { id } = await params;
    const result = await prisma.appointment.deleteMany({
      where: { id, ownerId: auth.session.userId }
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Agendamento nao encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

