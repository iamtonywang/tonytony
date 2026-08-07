import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

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
  const admin = getSupabaseAdminClient();

  // Login lookup RPC: login_id -> email, user_status (service_role only)
  const { data: lookupData, error: lookupError } = await admin.rpc(
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

  // Auth: email + password only when status is active (Cookie client)
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) {
    return NextResponse.json(
      { ok: false, message: "로그인에 실패했습니다." },
      { status: 400 },
    );
  }

  const authUserId = signInData?.user?.id ?? null;
  if (!authUserId) {
    return NextResponse.json(
      { ok: false, message: "로그인에 실패했습니다." },
      { status: 400 },
    );
  }

  // users row 존재 확인
  const { data: usersRows, error: usersFetchError } = await supabase
    .from("users")
    .select("id, login_id")
    .eq("auth_user_id", authUserId)
    .limit(1);

  if (usersFetchError) {
    return NextResponse.json(
      { ok: false, message: "로그인 후 사용자 정보를 확인하지 못했습니다." },
      { status: 500 },
    );
  }

  const existingUserRow =
    Array.isArray(usersRows) && usersRows.length === 1
      ? (usersRows[0] as { id: number; login_id: string | null })
      : null;

  // users row 누락 시 backfill 생성 (service_role RPC)
  if (!existingUserRow || typeof existingUserRow.id !== "number") {
    const authPhoneRaw = signInData.user.phone;
    const authPhone = typeof authPhoneRaw === "string" ? authPhoneRaw.trim() : "";
    const fallbackPhone = authPhone.length > 0 ? authPhone : `u-${authUserId.replace(/-/g, "").slice(0, 20)}`;

    const authEmailRaw = signInData.user.email;
    const safeEmail = typeof authEmailRaw === "string" && authEmailRaw.trim().length > 0
      ? authEmailRaw.trim()
      : email;

    const fallbackLoginId = loginId.trim().toLowerCase();
    const { error: backfillError } = await admin.rpc("create_user_after_signup", {
      p_auth_user_id: authUserId,
      p_login_id: fallbackLoginId,
      p_phone: fallbackPhone,
      p_email: safeEmail,
    });

    if (backfillError) {
      return NextResponse.json(
        { ok: false, message: "로그인 후 사용자 정보를 생성하지 못했습니다." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
