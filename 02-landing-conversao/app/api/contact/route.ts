import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Preencha nome, e-mail e mensagem corretamente." },
        { status: 400 }
      );
    }

    console.log("[lead]", parsed.data);

    return NextResponse.json({
      ok: true,
      message: "Recebemos sua mensagem. Vamos retornar em ate 24h."
    });
  } catch {
    return NextResponse.json({ error: "Erro ao processar o formulario." }, { status: 500 });
  }
}
