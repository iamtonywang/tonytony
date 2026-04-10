import { NextRequest, NextResponse } from "next/server";

import { requireActiveAdminReadonly } from "@/app/admin/settlements/_server/requireActiveAdminReadonly";

import { findSettlementRequestIdByDisplayKey } from "../resolveRequestKey";

function maskAccountNumber(raw: string | null): string | null {
	if (!raw) return null;
	const value = raw.trim();
	if (!value) return null;
	const visible = value.slice(-4);
	const maskedLen = Math.max(0, value.length - 4);
	return `${"*".repeat(maskedLen)}${visible}`;
}

export async function GET(req: NextRequest) {
	const r = await requireActiveAdminReadonly();
	if (!r.ok) {
		if (r.reason === "unauthorized") {
			return NextResponse.json({ ok: false, item: null, message: "Unauthorized" }, { status: 401 });
		}
		if (r.reason === "user_not_found") {
			return NextResponse.json({ ok: false, item: null, message: "user_not_found" }, { status: 404 });
		}
		return NextResponse.json({ ok: false, item: null, message: "admin_forbidden" }, { status: 403 });
	}

	const url = new URL(req.url);
	const loginId = (url.searchParams.get("loginId") ?? "").trim();
	const requestedAt = (url.searchParams.get("requestedAt") ?? "").trim();
	const requestAmount = (url.searchParams.get("requestAmount") ?? "").trim();

	if (!loginId || !requestedAt || !requestAmount) {
		return NextResponse.json({ ok: false, item: null, message: "missing_params" }, { status: 400 });
	}

	const { supabase } = r;

	const resolved = await findSettlementRequestIdByDisplayKey(supabase, loginId, requestedAt, requestAmount);
	if (!resolved.ok) {
		const st = resolved.message === "ambiguous" ? 404 : 404;
		return NextResponse.json({ ok: false, item: null, message: "not_found" }, { status: st });
	}

	const { data: reqRows, error: reqErr } = await supabase
		.from("partner_settlement_requests")
		.select(
			"partner_id, bank_account_id, request_amount, request_status, request_note, payment_memo, requested_at, approved_at, rejected_at, paid_at",
		)
		.eq("id", resolved.requestId)
		.limit(1);

	if (reqErr || !Array.isArray(reqRows) || reqRows.length !== 1) {
		return NextResponse.json({ ok: false, item: null, message: "not_found" }, { status: 404 });
	}

	const reqRow = reqRows[0] as {
		partner_id: number;
		bank_account_id: number;
		request_amount: number | string;
		request_status: string;
		request_note: string | null;
		payment_memo: string | null;
		requested_at: string;
		approved_at: string | null;
		rejected_at: string | null;
		paid_at: string | null;
	};

	const { data: partnerRows } = await supabase
		.from("partners")
		.select("user_id")
		.eq("id", reqRow.partner_id)
		.limit(1);
	const partnerRow = Array.isArray(partnerRows) && partnerRows.length === 1 ? (partnerRows[0] as { user_id: number }) : null;
	if (!partnerRow) {
		return NextResponse.json({ ok: false, item: null, message: "not_found" }, { status: 404 });
	}

	const { data: userRows } = await supabase
		.from("users")
		.select("login_id, phone, email")
		.eq("id", partnerRow.user_id)
		.limit(1);
	const userRow = Array.isArray(userRows) && userRows.length === 1
		? (userRows[0] as { login_id: string | null; phone: string | null; email: string | null })
		: null;

	const { data: profRows } = await supabase
		.from("user_profiles")
		.select("real_name")
		.eq("user_id", partnerRow.user_id)
		.limit(1);
	const realName =
		Array.isArray(profRows) && profRows.length === 1 ? (profRows[0] as { real_name: string | null }).real_name ?? null : null;

	const { data: bankRows } = await supabase
		.from("partner_bank_accounts")
		.select("bank_name, account_number, account_holder, is_verified")
		.eq("id", reqRow.bank_account_id)
		.eq("partner_id", reqRow.partner_id)
		.limit(1);
	const bank =
		Array.isArray(bankRows) && bankRows.length === 1
			? (bankRows[0] as {
					bank_name: string | null;
					account_number: string | null;
					account_holder: string | null;
					is_verified: boolean;
				})
			: null;

	const { data: itemRows, error: itemErr } = await supabase
		.from("partner_settlement_request_items")
		.select("settlement_id, amount_snapshot")
		.eq("request_id", resolved.requestId);

	if (itemErr) {
		return NextResponse.json({ ok: false, item: null, message: "items_fetch_failed" }, { status: 500 });
	}

	const itemsRaw = Array.isArray(itemRows)
		? (itemRows as Array<{ settlement_id: number; amount_snapshot: number | string }>)
		: [];
	const settlementIds = itemsRaw.map((i) => i.settlement_id).filter((id): id is number => typeof id === "number");

	const settlementMap = new Map<
		number,
		{
			settlement_status: string;
			settlement_amount: number | string;
			settlement_available_at: string;
			order_id: number;
		}
	>();

	if (settlementIds.length > 0) {
		const { data: sRows } = await supabase
			.from("settlements")
			.select("id, settlement_status, settlement_amount, settlement_available_at, order_id")
			.in("id", settlementIds)
			.eq("partner_id", reqRow.partner_id);

		if (Array.isArray(sRows)) {
			for (const s of sRows as Array<{
				id: number;
				settlement_status: string;
				settlement_amount: number | string;
				settlement_available_at: string;
				order_id: number;
			}>) {
				settlementMap.set(s.id, {
					settlement_status: s.settlement_status,
					settlement_amount: s.settlement_amount,
					settlement_available_at: s.settlement_available_at,
					order_id: s.order_id,
				});
			}
		}
	}

	const orderIds = Array.from(
		new Set(itemsRaw.map((i) => settlementMap.get(i.settlement_id)?.order_id).filter((v): v is number => typeof v === "number")),
	);

	const orderMap = new Map<number, { order_number: string | null; referral_code: string | null }>();
	if (orderIds.length > 0) {
		const { data: oRows } = await supabase.from("orders").select("id, order_number, referral_code").in("id", orderIds);
		if (Array.isArray(oRows)) {
			for (const o of oRows as Array<{ id: number; order_number: string | null; referral_code: string | null }>) {
				orderMap.set(o.id, { order_number: o.order_number, referral_code: o.referral_code });
			}
		}
	}

	const lineItems = itemsRaw.map((it) => {
		const s = settlementMap.get(it.settlement_id);
		const ord = s ? orderMap.get(s.order_id) : undefined;
		return {
			amountSnapshot: String(it.amount_snapshot),
			settlementStatus: s?.settlement_status ?? "",
			settlementAmount: s ? String(s.settlement_amount) : "",
			settlementAvailableAt: s?.settlement_available_at ?? "",
			orderNumber: ord?.order_number ?? "",
			referralCode: ord?.referral_code ?? null,
		};
	});

	const item = {
		loginId: userRow?.login_id ?? "",
		realName,
		phone: userRow?.phone ?? "",
		email: userRow?.email ?? null,
		requestStatus: reqRow.request_status,
		requestAmount: String(reqRow.request_amount),
		requestNote: reqRow.request_note,
		paymentMemo: reqRow.payment_memo,
		requestedAt: reqRow.requested_at,
		approvedAt: reqRow.approved_at,
		rejectedAt: reqRow.rejected_at,
		paidAt: reqRow.paid_at,
		bankName: bank?.bank_name ?? null,
		accountHolder: bank?.account_holder ?? null,
		accountNumberMasked: bank ? maskAccountNumber(bank.account_number ?? null) : null,
		accountStatus: bank ? (bank.is_verified ? "verified" : "unverified") : null,
		items: lineItems,
	};

	return NextResponse.json({ ok: true, item, message: null }, { status: 200 });
}
