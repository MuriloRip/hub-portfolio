import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { clientSchema } from "@/lib/validators";

export async function GET() {
  const auth = await requireSession();
  if (auth.error || !auth.session) {
    return auth.error;
  }

  const clients = await prisma.client.findMany({
    where: { ownerId: auth.session.userId },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ clients });
}

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth.error || !auth.session) {
    return auth.error;
  }

  try {
    const body = await request.json();
    const parsed = clientSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados invalidos" }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
        notes: parsed.data.notes || null,
        ownerId: auth.session.userId
      }
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
