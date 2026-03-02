import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { appointmentSchema } from "@/lib/validators";

export async function GET() {
  const auth = await requireSession();
  if (auth.error || !auth.session) {
    return auth.error;
  }

  const appointments = await prisma.appointment.findMany({
    where: { ownerId: auth.session.userId },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          phone: true
        }
      }
    },
    orderBy: { startAt: "asc" }
  });

  return NextResponse.json({ appointments });
}

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth.error || !auth.session) {
    return auth.error;
  }

  try {
    const body = await request.json();
    const parsed = appointmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados invalidos" }, { status: 400 });
    }

    const startAt = new Date(parsed.data.startAt);
    const endAt = new Date(parsed.data.endAt);

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime()) || endAt <= startAt) {
      return NextResponse.json({ error: "Horario invalido" }, { status: 400 });
    }

    const clientExists = await prisma.client.findFirst({
      where: {
        id: parsed.data.clientId,
        ownerId: auth.session.userId
      }
    });

    if (!clientExists) {
      return NextResponse.json({ error: "Cliente nao encontrado" }, { status: 404 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        title: parsed.data.title,
        clientId: parsed.data.clientId,
        ownerId: auth.session.userId,
        startAt,
        endAt,
        status: parsed.data.status,
        notes: parsed.data.notes || null
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      }
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
