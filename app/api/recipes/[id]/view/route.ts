import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/session";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await prisma.recipe.findFirst({
    where: { id, published: true },
    select: { id: true }
  });

  if (!recipe) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const session = await readSession();

  try {
    await prisma.recipeView.create({
      data: {
        recipeId: recipe.id,
        userId: session?.userId,
        sessionId: request.cookies.get("savor_viewer_id")?.value,
        userAgent: request.headers.get("user-agent")?.slice(0, 255) || null,
        referrer: request.headers.get("referer")?.slice(0, 255) || null
      }
    });
  } catch {
    return NextResponse.json({ ok: false, reason: "views_unavailable" }, { status: 202 });
  }

  const response = NextResponse.json({ ok: true });

  if (!request.cookies.get("savor_viewer_id")?.value) {
    response.cookies.set("savor_viewer_id", randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    });
  }

  return response;
}
