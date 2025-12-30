import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const upstream = await fetch("https://api.certifyquiz.com/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") || "application/json";
    const text = await upstream.text();

    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type": contentType,
        "x-cq-newsletter": "proxy",
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Newsletter proxy error" },
      {
        status: 500,
        headers: { "x-cq-newsletter": "proxy" },
      }
    );
  }
}
