import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const { secret, path } = await req.json().catch(() => ({}));
  if (secret !== process.env.REVALIDATE_SECRET || typeof path !== "string") {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  await revalidatePath(path);
  return NextResponse.json({ revalidated: true });
}
