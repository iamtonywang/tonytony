import { NextRequest, NextResponse } from "next/server";

import { getProductBoardBySlug } from "@/app/products/_server/getProductBoardBySlug";
import type { PublicProductBoardItem } from "@/app/products/[slug]/_components/publicBoardTypes";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "private, no-store" } as const;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
const SLUG_MAX = 64;

function parseSlug(raw: string | null): string | null {
  if (typeof raw !== "string") return null;
  const slug = raw.trim();
  if (!slug || slug.length > SLUG_MAX) return null;
  if (!SLUG_RE.test(slug)) return null;
  return slug;
}

function toPublicItem(row: {
  id: string;
  author: string;
  preview: string;
  type: "Inquiry" | "Review";
  date: string;
  content: string;
  answerContent?: string | null;
  isPrivate: boolean;
  canViewFullContent: boolean;
}): PublicProductBoardItem {
  return {
    id: row.id,
    author: row.author,
    preview: row.preview,
    type: row.type,
    date: row.date,
    content: row.content,
    answerContent: row.answerContent ?? null,
    isPrivate: row.isPrivate,
    canViewFullContent: row.canViewFullContent,
  };
}

export async function GET(req: NextRequest) {
  const slug = parseSlug(req.nextUrl.searchParams.get("slug"));
  if (!slug) {
    return NextResponse.json(
      { ok: false, message: "slug_required" },
      { status: 400, headers: NO_STORE },
    );
  }

  try {
    const rows = await getProductBoardBySlug(slug);
    const items: PublicProductBoardItem[] = rows
      .filter((item) => !(item.isPrivate === true && item.canViewFullContent !== true))
      .map(toPublicItem);

    return NextResponse.json({ ok: true, items }, { status: 200, headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { ok: false, message: "load_failed" },
      { status: 500, headers: NO_STORE },
    );
  }
}
