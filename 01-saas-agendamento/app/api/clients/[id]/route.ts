import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { clientSchema } from "@/lib/validators";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Params) {
  const auth = await requireSession();
  if (auth.error || !auth.session) {
    return auth.error;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = clientSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados invalidos" }, { status: 400 });
    }

    const client = await prisma.client.updateMany({
      where: { id, ownerId: auth.session.userId },
      data: {
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
        notes: parsed.data.notes || null
      }
    });

    if (client.count === 0) {
      return NextResponse.json({ error: "Cliente nao encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireSession();
  if (auth.error || !auth.session) {
    return auth.error;
  }

  try {
    const { id } = await params;
    const result = await prisma.client.deleteMany({
      where: { id, ownerId: auth.session.userId }
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Cliente nao encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

