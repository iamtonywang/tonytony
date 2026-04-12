import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type Body = {
  slug?: unknown;
  content?: unknown;
};

function titleFromContent(text: string): string {
  const t = text.trim();
  if (t.length <= 80) return t;
  return `${t.slice(0, 80)}…`;
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: "invalid_json" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  if (!slug) {
    return NextResponse.json({ ok: false, message: "slug_required" }, { status: 400 });
  }

  const rawContent = typeof body.content === "string" ? body.content : "";
  const content = rawContent.trim();
  if (content.length === 0) {
    return NextResponse.json({ ok: false, message: "content_required" }, { status: 400 });
  }

  const { data: userRows, error: userErr } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", authData.user.id)
    .limit(1);

  if (userErr || !Array.isArray(userRows) || userRows.length !== 1) {
    return NextResponse.json({ ok: false, message: "user_not_found" }, { status: 404 });
  }

  const userId = (userRows[0] as { id: number }).id;

  const { data: prodRows, error: prodErr } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .eq("is_visible", true)
    .in("product_status", ["active", "sold_out"])
    .limit(1);

  if (prodErr || !Array.isArray(prodRows) || prodRows.length !== 1) {
    return NextResponse.json({ ok: false, message: "product_not_found" }, { status: 404 });
  }

  const productId = (prodRows[0] as { id: number }).id;

  const { error: insErr } = await supabase.from("inquiries").insert({
    product_id: productId,
    user_id: userId,
    title: titleFromContent(content),
    content,
    is_private: false,
    inquiry_status: "active",
  });

  if (insErr) {
    return NextResponse.json({ ok: false, message: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
