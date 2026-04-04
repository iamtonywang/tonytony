import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseServerClient();

  // 서버 판정 방식: getSession (단일 사용)
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    return NextResponse.json({ authenticated: false });
  }
  const authenticated = Boolean(data?.session);
  return NextResponse.json({ authenticated });
}

import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return NextResponse.json({ authenticated: false });
  }

  const hasSession = Boolean(data?.session);
  return NextResponse.json({ authenticated: hasSession === true });
}

