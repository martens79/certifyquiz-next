export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
export async function GET() {
  const v = process.env.REVALIDATE_SECRET ?? "";
  return NextResponse.json({
    ok: true,
    envPresent: v.length > 0,
    envLen: v.length,
    vercelEnv: process.env.VERCEL_ENV ?? null,
  });
}
