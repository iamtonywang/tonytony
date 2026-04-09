import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

type BankAccountItem = {
  hasBankAccount: boolean;
  bankName: string | null;
  accountNumberMasked: string | null;
  accountHolder: string | null;
  accountStatus: string | null;
};

function maskAccountNumber(raw: string | null): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;

  const visible = value.slice(-4);
  const maskedLen = Math.max(0, value.length - 4);
  return `${"*".repeat(maskedLen)}${visible}`;
}

export async function GET(_req: NextRequest) {
  const supabase = await getSupabaseServerReadonlyClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({ ok: false, item: null, message: "Unauthorized" }, { status: 401 });
  }

  // users.id 내부 조회 (응답 노출 금지)
  const { data: usersRows, error: usersErr } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", userData.user.id)
    .limit(1);

  if (usersErr) {
    return NextResponse.json({ ok: false, item: null, message: "users_lookup_failed" }, { status: 500 });
  }

  const userRow = Array.isArray(usersRows) && usersRows.length === 1 ? (usersRows[0] as { id: number }) : null;
  if (!userRow || typeof userRow.id !== "number") {
    return NextResponse.json({ ok: false, item: null, message: "user_not_found" }, { status: 404 });
  }

  // partners.id 내부 조회 (응답 노출 금지)
  const { data: partnerRows, error: partnerErr } = await supabase
    .from("partners")
    .select("id")
    .eq("user_id", userRow.id)
    .limit(1);

  if (partnerErr) {
    return NextResponse.json({ ok: false, item: null, message: "partner_lookup_failed" }, { status: 500 });
  }

  const partner = Array.isArray(partnerRows) && partnerRows.length === 1 ? (partnerRows[0] as { id: number }) : null;

  if (!partner || typeof partner.id !== "number") {
    const noAccountItem: BankAccountItem = {
      hasBankAccount: false,
      bankName: null,
      accountNumberMasked: null,
      accountHolder: null,
      accountStatus: null,
    };
    return NextResponse.json({ ok: true, item: noAccountItem, message: null }, { status: 200 });
  }

  // 선택 규칙: created_at DESC 최신 1건
  const { data: bankRows, error: bankErr } = await supabase
    .from("partner_bank_accounts")
    .select("bank_name, account_number, account_holder, is_verified")
    .eq("partner_id", partner.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (bankErr) {
    return NextResponse.json({ ok: false, item: null, message: "bank_account_fetch_failed" }, { status: 500 });
  }

  const account =
    Array.isArray(bankRows) && bankRows.length === 1
      ? (bankRows[0] as {
          bank_name: string | null;
          account_number: string | null;
          account_holder: string | null;
          is_verified: boolean;
        })
      : null;

  if (!account) {
    const noAccountItem: BankAccountItem = {
      hasBankAccount: false,
      bankName: null,
      accountNumberMasked: null,
      accountHolder: null,
      accountStatus: null,
    };
    return NextResponse.json({ ok: true, item: noAccountItem, message: null }, { status: 200 });
  }

  const item: BankAccountItem = {
    hasBankAccount: true,
    bankName: account.bank_name ?? null,
    accountNumberMasked: maskAccountNumber(account.account_number ?? null),
    accountHolder: account.account_holder ?? null,
    accountStatus: account.is_verified ? "verified" : "unverified",
  };

  return NextResponse.json({ ok: true, item, message: null }, { status: 200 });
}

