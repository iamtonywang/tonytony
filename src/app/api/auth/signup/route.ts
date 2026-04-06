import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

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
    console.error("[signup][400][bad-json]");
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
    console.error("[signup][400][invalid-login-id]", loginId);
    return NextResponse.json(
      { ok: false, message: "로그인 ID를 입력해 주세요." },
      { status: 400 },
    );
  }
  if (!password || password.length < minPasswordLength) {
    console.error("[signup][400][invalid-password]", loginId, phone);
    return NextResponse.json(
      { ok: false, message: "비밀번호를 올바르게 입력해 주세요." },
      { status: 400 },
    );
  }
  if (!phone || !validateBasicPhone(phone)) {
    console.error("[signup][400][invalid-phone]", phone);
    return NextResponse.json(
      { ok: false, message: "전화번호를 올바르게 입력해 주세요." },
      { status: 400 },
    );
  }

  const supabase = await getSupabaseServerClient();

  // Duplicate checks happen on the server only.
  const { data: duplicateData, error: duplicateError } = await supabase.rpc(
    "check_signup_duplicates",
    {
      p_login_id: loginId,
      p_phone: phone,
    },
  );

  if (duplicateError) {
    console.error(
      "[signup][check_signup_duplicates]",
      duplicateError?.code,
      duplicateError?.message,
      duplicateError?.details,
      duplicateError?.hint,
    );
    return NextResponse.json(
      { ok: false, message: "회원가입에 실패했습니다." },
      { status: 500 },
    );
  }

  if (!duplicateData) {
    return NextResponse.json(
      { ok: false, message: "회원가입에 실패했습니다." },
      { status: 500 },
    );
  }

  const duplicateRow = Array.isArray(duplicateData)
    ? duplicateData[0]
    : duplicateData;

  const loginIdExistsRaw = (duplicateRow as { login_id_exists?: unknown })?.login_id_exists;
  const phoneExistsRaw = (duplicateRow as { phone_exists?: unknown })?.phone_exists;

  if (typeof loginIdExistsRaw !== "boolean" || typeof phoneExistsRaw !== "boolean") {
    return NextResponse.json(
      { ok: false, message: "회원가입에 실패했습니다." },
      { status: 500 },
    );
  }

  if (loginIdExistsRaw) {
    return NextResponse.json(
      { ok: false, message: "이미 사용 중인 로그인 ID입니다." },
      { status: 409 },
    );
  }

  if (phoneExistsRaw) {
    return NextResponse.json(
      { ok: false, message: "이미 사용 중인 전화번호입니다." },
      { status: 409 },
    );
  }

  // Build internal email for Auth identifier (no verification step by policy)
  const emailLocal = Buffer.from(loginId, "utf8").toString("hex");
  const email = `u_${emailLocal}@example.com`;

  // Create auth user via email + password only (no phone, no metadata)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("[signup][400][signUp-error]", loginId, phone);
    return NextResponse.json(
      { ok: false, message: "회원가입에 실패했습니다." },
      { status: 400 },
    );
  }

  // In this stage we treat "no user and no session" as a failure.
  const hasUser = Boolean(data?.user);
  const hasSession = Boolean((data as { session?: unknown } | undefined)?.session);
  if (!hasUser && !hasSession) {
    console.error("[signup][400][no-user-no-session]");
    return NextResponse.json(
      { ok: false, message: "회원가입에 실패했습니다." },
      { status: 400 },
    );
  }

  // 지시문에 맞게, 이 단계의 성공 판정은 user 존재로만 처리한다.
  if (!hasUser) {
    console.error("[signup][400][no-user]");
    return NextResponse.json(
      { ok: false, message: "회원가입에 실패했습니다." },
      { status: 400 },
    );
  }

  // Persist into public.users via SECURITY DEFINER function (no direct insert)
  const userId = (data?.user as { id?: string } | undefined)?.id;
  const { error: insertError } = await supabase.rpc("create_user_after_signup", {
    p_auth_user_id: userId,
    p_login_id: loginId,
    p_phone: phone,
    p_email: email,
  });
  if (insertError) {
    console.error(
      "[signup][create_user_after_signup]",
      insertError?.code,
      insertError?.message,
      insertError?.details,
      insertError?.hint,
    );
    if (userId) {
      const admin = getSupabaseAdminClient();
      try {
        await admin.auth.admin.deleteUser(userId, false);
      } catch {}
    }
    return NextResponse.json(
      { ok: false, message: "회원가입에 실패했습니다." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}

