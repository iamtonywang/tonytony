import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type LoginRequestBody = {
  login_id?: unknown;
  password?: unknown;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

type SupabaseErrorLike = {
  message?: string | null;
  details?: string | null;
  hint?: string | null;
  code?: string | null;
};

function toErrorMeta(err: unknown) {
  const e = (err ?? null) as SupabaseErrorLike | null;
  return {
    message: typeof e?.message === "string" ? e.message : null,
    details: typeof e?.details === "string" ? e.details : null,
    hint: typeof e?.hint === "string" ? e.hint : null,
    code: typeof e?.code === "string" ? e.code : null,
  };
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
    console.error("[login-route][400][body-parse]", {
      loginId: null,
      authUserId: null,
      signInEmail: null,
      signInPhone: null,
      lookupEmail: null,
      reason: "invalid-json-body",
      ...toErrorMeta(null),
    });
    return NextResponse.json(
      { ok: false, message: "잘못된 요청 형식입니다." },
      { status: 400 },
    );
  }

  const loginId = isNonEmptyString(body?.login_id) ? body.login_id.trim() : "";
  const password = isNonEmptyString(body?.password) ? body.password : "";

  if (!loginId) {
    console.error("[login-route][400][invalid-input-login-id]", {
      loginId: loginId?.trim() ?? null,
      authUserId: null,
      signInEmail: null,
      signInPhone: null,
      lookupEmail: null,
      reason: "missing-login-id",
      ...toErrorMeta(null),
    });
    return NextResponse.json(
      { ok: false, message: "로그인 ID를 입력해 주세요." },
      { status: 400 },
    );
  }
  if (!password) {
    console.error("[login-route][400][invalid-input-password]", {
      loginId: loginId?.trim() ?? null,
      authUserId: null,
      signInEmail: null,
      signInPhone: null,
      lookupEmail: null,
      reason: "missing-password",
      ...toErrorMeta(null),
    });
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
    console.error("[login-route][400][lookup-error]", {
      loginId: loginId?.trim() ?? null,
      authUserId: null,
      signInEmail: null,
      signInPhone: null,
      lookupEmail: null,
      reason: "login-lookup-failed",
      ...toErrorMeta(lookupError),
    });
    return NextResponse.json(
      { ok: false, message: "로그인에 실패했습니다." },
      { status: 400 },
    );
  }

  if (!lookupData) {
    // no row (includes not found / duplicate / email null by contract)
    console.error("[login-route][400][lookup-empty]", {
      loginId: loginId?.trim() ?? null,
      authUserId: null,
      signInEmail: null,
      signInPhone: null,
      lookupEmail: null,
      reason: "lookup-data-empty",
      ...toErrorMeta(null),
    });
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
    console.error("[login-route][400][lookup-shape-invalid]", {
      loginId: loginId?.trim() ?? null,
      authUserId: null,
      signInEmail: null,
      signInPhone: null,
      lookupEmail: typeof email === "string" ? email : null,
      reason: "lookup-email-or-status-invalid",
      ...toErrorMeta(null),
    });
    return NextResponse.json(
      { ok: false, message: "로그인에 실패했습니다." },
      { status: 400 },
    );
  }

  // user_status pre-check (allow only active)
  if (userStatus !== "active") {
    console.error("[login-route][400][user-status-blocked]", {
      loginId: loginId?.trim() ?? null,
      authUserId: null,
      signInEmail: null,
      signInPhone: null,
      lookupEmail: email,
      reason: "user-status-not-active",
      ...toErrorMeta(null),
    });
    return NextResponse.json(
      { ok: false, message: "로그인에 실패했습니다." },
      { status: 400 },
    );
  }

  // Auth: email + password only when status is active
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) {
    console.error("[login-route][400][signin-error]", {
      loginId: loginId?.trim() ?? null,
      authUserId: signInData?.user?.id ?? null,
      signInEmail: signInData?.user?.email ?? null,
      signInPhone: signInData?.user?.phone ?? null,
      lookupEmail: email,
      reason: "sign-in-failed",
      ...toErrorMeta(signInError),
    });
    return NextResponse.json(
      { ok: false, message: "로그인에 실패했습니다." },
      { status: 400 },
    );
  }

  // Diagnostic payload for 500-branch isolation.
  // Security guard: do NOT log password, tokens, cookies, session object, or Authorization header.
  const debugPayload = {
    loginId: loginId?.trim() ?? null,
    authUserId: signInData?.user?.id ?? null,
    signInEmail: signInData?.user?.email ?? null,
    signInPhone: signInData?.user?.phone ?? null,
    lookupEmail: typeof email === "string" ? email : null,
  };

  const authUserId = signInData?.user?.id ?? null;
  if (!authUserId) {
    console.error("[login-route][400][missing-auth-user-id]", {
      loginId: loginId?.trim() ?? null,
      authUserId: signInData?.user?.id ?? null,
      signInEmail: signInData?.user?.email ?? null,
      signInPhone: signInData?.user?.phone ?? null,
      lookupEmail: email,
      reason: "missing-auth-user-id-after-signin",
      ...toErrorMeta(null),
    });
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
    const firstUsersRow =
      Array.isArray(usersRows) && usersRows.length > 0
        ? (usersRows[0] as { id?: unknown; login_id?: unknown; auth_user_id?: unknown })
        : null;
    console.error("[login-route][users-fetch-error]", {
      authUserId,
      loginId: loginId?.trim() ?? null,
      lookupEmail: email,
      usersRowsLength: Array.isArray(usersRows) ? usersRows.length : null,
      firstUsersRowSummary: {
        hasId: !!firstUsersRow && typeof firstUsersRow.id === "number",
        hasLoginId: !!firstUsersRow && typeof firstUsersRow.login_id === "string",
        hasAuthUserId: !!firstUsersRow && typeof firstUsersRow.auth_user_id === "string",
      },
      reason: "users-fetch-query-failed",
      error: {
        message: usersFetchError.message,
        details: usersFetchError.details ?? null,
        hint: usersFetchError.hint ?? null,
        code: usersFetchError.code ?? null,
      },
    });
    return NextResponse.json(
      { ok: false, message: "로그인 후 사용자 정보를 확인하지 못했습니다." },
      { status: 500 },
    );
  }

  const existingUserRow =
    Array.isArray(usersRows) && usersRows.length === 1
      ? (usersRows[0] as { id: number; login_id: string | null })
      : null;

  // users row 누락 시 backfill 생성
  if (!existingUserRow || typeof existingUserRow.id !== "number") {
    const authPhoneRaw = signInData.user.phone;
    const authPhone = typeof authPhoneRaw === "string" ? authPhoneRaw.trim() : "";
    const fallbackPhone = authPhone.length > 0 ? authPhone : `u-${authUserId.replace(/-/g, "").slice(0, 20)}`;

    const authEmailRaw = signInData.user.email;
    const safeEmail = typeof authEmailRaw === "string" && authEmailRaw.trim().length > 0
      ? authEmailRaw.trim()
      : email;

    const fallbackLoginId = loginId.trim().toLowerCase();
    console.info("[login-route][backfill-start]", {
      p_auth_user_id: authUserId,
      p_login_id: fallbackLoginId,
      p_phone: fallbackPhone,
      p_email: safeEmail,
      ...debugPayload,
    });
    const { error: backfillError } = await supabase.rpc("create_user_after_signup", {
      p_auth_user_id: authUserId,
      p_login_id: fallbackLoginId,
      p_phone: fallbackPhone,
      p_email: safeEmail,
    });
    console.info("[login-route][backfill-done]", {
      p_auth_user_id: authUserId,
      p_login_id: fallbackLoginId,
      p_phone: fallbackPhone,
      p_email: safeEmail,
      ...debugPayload,
      backfillOk: !backfillError,
    });

    if (backfillError) {
      console.error("[login-route][users-backfill-error]", {
        ...debugPayload,
        error: {
          message: backfillError.message,
          details: backfillError.details ?? null,
          hint: backfillError.hint ?? null,
          code: backfillError.code ?? null,
        },
      });
      return NextResponse.json(
        { ok: false, message: "로그인 후 사용자 정보를 생성하지 못했습니다." },
        { status: 500 },
      );
    }

    // backfill 생성 확인
    const { data: verifyRows, error: verifyError } = await supabase
      .from("users")
      .select("id, login_id")
      .eq("auth_user_id", authUserId)
      .limit(1);

    if (verifyError) {
      const firstVerifiedRow =
        Array.isArray(verifyRows) && verifyRows.length > 0
          ? (verifyRows[0] as { id?: unknown; login_id?: unknown; auth_user_id?: unknown })
          : null;
      console.error("[login-route][users-verify-error]", {
        authUserId,
        loginId: loginId?.trim() ?? null,
        lookupEmail: email,
        verifiedUsersRowsLength: Array.isArray(verifyRows) ? verifyRows.length : null,
        firstVerifiedRowSummary: {
          hasId: !!firstVerifiedRow && typeof firstVerifiedRow.id === "number",
          hasLoginId: !!firstVerifiedRow && typeof firstVerifiedRow.login_id === "string",
          hasAuthUserId: !!firstVerifiedRow && typeof firstVerifiedRow.auth_user_id === "string",
        },
        reason: "users-verify-query-failed",
        error: {
          message: verifyError.message,
          details: verifyError.details ?? null,
          hint: verifyError.hint ?? null,
          code: verifyError.code ?? null,
        },
      });
      return NextResponse.json(
        { ok: false, message: "로그인 후 사용자 정보를 확인하지 못했습니다." },
        { status: 500 },
      );
    }

    const verifiedUserRow =
      Array.isArray(verifyRows) && verifyRows.length === 1
        ? (verifyRows[0] as { id: number; login_id: string | null })
        : null;

    if (!verifiedUserRow || typeof verifiedUserRow.id !== "number") {
      console.error("[login-route][verified-user-missing]", {
        ...debugPayload,
        usersRowsLength: Array.isArray(usersRows) ? usersRows.length : null,
        verifiedUsersRowsLength: Array.isArray(verifyRows) ? verifyRows.length : null,
        hasVerifiedUserId: !!verifiedUserRow && typeof verifiedUserRow.id === "number",
        hasVerifiedLoginId: !!verifiedUserRow && typeof verifiedUserRow.login_id === "string",
      });
      return NextResponse.json(
        { ok: false, message: "로그인 후 사용자 정보가 누락되었습니다." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}

