import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type LoginRequestBody = {
  login_id?: unknown;
  password?: unknown;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { ok: false, message: "잘못된 요청 형식입니다." },
      { status: 415 },
    );
  }

  let body: LoginRequestBody;
  try {
    body = (await req.json()) as LoginRequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, message: "잘못된 요청 형식입니다." },
      { status: 400 },
    );
  }

  const loginId = isNonEmptyString(body?.login_id) ? body.login_id.trim() : "";
  const password = isNonEmptyString(body?.password) ? body.password : "";

  if (!loginId) {
    return NextResponse.json(
      { ok: false, message: "로그인 ID를 입력해 주세요." },
      { status: 400 },
    );
  }
  if (!password) {
    return NextResponse.json(
      { ok: false, message: "비밀번호를 올바르게 입력해 주세요." },
      { status: 400 },
    );
  }

  const supabase = await getSupabaseServerClient();

  // Login lookup RPC: login_id -> email, user_status
  const { data: lookupData, error: lookupError } = await supabase.rpc(
    "login_lookup_email_and_status",
    { p_login_id: loginId },
  );
  if (lookupError) {
    return NextResponse.json(
      { ok: false, message: "로그인에 실패했습니다." },
      { status: 400 },
    );
  }

  if (!lookupData) {
    // no row (includes not found / duplicate / email null by contract)
    return NextResponse.json(
      { ok: false, message: "로그인에 실패했습니다." },
      { status: 400 },
    );
  }

  // lookupData can be object or array depending on driver; normalize
  const row = Array.isArray(lookupData) ? lookupData[0] : lookupData;
  const email = (row as { email?: unknown })?.email;
  const userStatus = (row as { user_status?: unknown })?.user_status;

  if (typeof email !== "string" || typeof userStatus !== "string") {
    return NextResponse.json(
      { ok: false, message: "로그인에 실패했습니다." },
      { status: 400 },
    );
  }

  // user_status pre-check (allow only active)
  if (userStatus !== "active") {
    return NextResponse.json(
      { ok: false, message: "로그인에 실패했습니다." },
      { status: 400 },
    );
  }

  // Auth: email + password only when status is active
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) {
    return NextResponse.json(
      { ok: false, message: "로그인에 실패했습니다." },
      { status: 400 },
    );
  }

  // Note: persistSession is false in current server client; session persistence is not finalized here.
  return NextResponse.json({ ok: true });
}

