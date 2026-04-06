import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return NextResponse.json(
      { ok: false, message: "로그아웃에 실패했습니다." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}

