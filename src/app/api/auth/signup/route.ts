import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type SignupRequestBody = {
  login_id?: unknown;
  password?: unknown;
  phone?: unknown;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function validateBasicPhone(phone: string): boolean {
  // Keep validation intentionally basic; final validation can be handled by Supabase/Auth.
  // Accept digits, optional leading `+`, and common separators.
  const normalized = phone.replace(/\s+/g, "");
  return /^\+?\d[\d-]{6,14}$/.test(normalized);
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { ok: false, message: "잘못된 요청 형식입니다." },
      { status: 415 },
    );
  }

  let body: SignupRequestBody;
  try {
    const parsed = (await req.json()) as SignupRequestBody;
    body = parsed;
  } catch {
    return NextResponse.json(
      { ok: false, message: "잘못된 요청 형식입니다." },
      { status: 400 },
    );
  }

  const loginId = isNonEmptyString(body?.login_id) ? body.login_id.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const phoneRaw = isNonEmptyString(body?.phone) ? body.phone.trim() : "";
  const phone = phoneRaw.replace(/\D/g, "");

  // Basic server-side validation (client format checks only; final shape check stays here).
  const minPasswordLength = 6;
  if (!loginId) {
    return NextResponse.json(
      { ok: false, message: "로그인 ID를 입력해 주세요." },
      { status: 400 },
    );
  }
  if (!password || password.length < minPasswordLength) {
    return NextResponse.json(
      { ok: false, message: "비밀번호를 올바르게 입력해 주세요." },
      { status: 400 },
    );
  }
  if (!phone || !validateBasicPhone(phone)) {
    return NextResponse.json(
      { ok: false, message: "전화번호를 올바르게 입력해 주세요." },
      { status: 400 },
    );
  }

  const supabase = getSupabaseServerClient();

  // Duplicate checks happen on the server only.
  const { data: loginRows, error: loginDupError } = await supabase
    .from("users")
    .select("id")
    .eq("login_id", loginId)
    .limit(1);

  if (loginDupError) {
    console.error(
      "[signup][login-dup-check]",
      loginDupError?.code,
      loginDupError?.message,
      loginDupError?.details,
      loginDupError?.hint,
    );
    return NextResponse.json(
      { ok: false, message: "회원가입에 실패했습니다." },
      { status: 500 },
    );
  }

  if (loginRows && loginRows.length > 0) {
    return NextResponse.json(
      { ok: false, message: "이미 사용 중인 로그인 ID입니다." },
      { status: 409 },
    );
  }

  const { data: phoneRows, error: phoneDupError } = await supabase
    .from("users")
    .select("id")
    .eq("phone", phone)
    .limit(1);

  if (phoneDupError) {
    console.error(
      "[signup][phone-dup-check]",
      phoneDupError?.code,
      phoneDupError?.message,
      phoneDupError?.details,
      phoneDupError?.hint,
    );
    return NextResponse.json(
      { ok: false, message: "회원가입에 실패했습니다." },
      { status: 500 },
    );
  }

  if (phoneRows && phoneRows.length > 0) {
    return NextResponse.json(
      { ok: false, message: "이미 사용 중인 전화번호입니다." },
      { status: 409 },
    );
  }

  // Create auth user; DB trigger (next stage) is responsible for creating public.users.
  const { data, error } = await supabase.auth.signUp({
    phone,
    password,
    options: {
      data: {
        login_id: loginId,
      },
    },
  });

  if (error) {
    return NextResponse.json(
      { ok: false, message: "회원가입에 실패했습니다." },
      { status: 400 },
    );
  }

  // In this stage we treat "no user and no session" as a failure.
  const hasUser = Boolean(data?.user);
  const hasSession = Boolean((data as { session?: unknown } | undefined)?.session);
  if (!hasUser && !hasSession) {
    return NextResponse.json(
      { ok: false, message: "회원가입에 실패했습니다." },
      { status: 400 },
    );
  }

  // 지시문에 맞게, 이 단계의 성공 판정은 user 존재로만 처리한다.
  if (!hasUser) {
    return NextResponse.json(
      { ok: false, message: "회원가입에 실패했습니다." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}

