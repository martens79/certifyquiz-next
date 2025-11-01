import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!/^\S+@\S+\.\S+$/.test(email ?? "")) {
      return NextResponse.json({ error: "Email non valida" }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY!;
    const listId = Number(process.env.BREVO_LIST_ID);
    if (!apiKey || !listId) {
      return NextResponse.json({ error: "Config mancante" }, { status: 500 });
    }

    const r = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
    });

    if (r.ok) return NextResponse.json({ ok: true, message: "Iscrizione completata" });
    const data = await r.json().catch(() => ({}));
    return NextResponse.json({ error: data?.message || "Errore iscrizione" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Errore inatteso" }, { status: 500 });
  }
}
