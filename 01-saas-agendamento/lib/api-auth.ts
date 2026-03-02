import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Nao autenticado" }, { status: 401 }),
      session: null
    };
  }

  return { error: null, session };
}
