import { NextRequest, NextResponse } from "next/server";

import { requireActiveAdminReadonly } from "@/app/admin/settlements/_server/requireActiveAdminReadonly";

const PAGE_SIZE = 20;

type ReqRow = {
	partner_id: number;
	request_amount: number | string;
	request_status: string;
	requested_at: string;
	paid_at: string | null;
};

export async function GET(req: NextRequest) {
	const r = await requireActiveAdminReadonly();
	if (!r.ok) {
		if (r.reason === "unauthorized") {
			return NextResponse.json(
				{ ok: false, items: [], total: 0, hasNext: false, message: "Unauthorized" },
				{ status: 401 },
			);
		}
		if (r.reason === "user_not_found") {
			return NextResponse.json(
				{ ok: false, items: [], total: 0, hasNext: false, message: "user_not_found" },
				{ status: 404 },
			);
		}
		return NextResponse.json(
			{ ok: false, items: [], total: 0, hasNext: false, message: "admin_forbidden" },
			{ status: 403 },
		);
	}

	const { supabase } = r;

	const url = new URL(req.url);
	const pageParam = url.searchParams.get("page");
	const page = Math.max(1, Number.isFinite(Number(pageParam)) ? Number(pageParam) : 1);
	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	const { count: totalCount, error: countErr } = await supabase
		.from("partner_settlement_requests")
		.select("*", { count: "exact", head: true });

	if (countErr) {
		return NextResponse.json(
			{ ok: false, items: [], total: 0, hasNext: false, message: "count_failed" },
			{ status: 500 },
		);
	}

	const { data, error } = await supabase
		.from("partner_settlement_requests")
		.select("partner_id, request_amount, request_status, requested_at, paid_at")
		.order("requested_at", { ascending: false })
		.range(from, to);

	if (error) {
		return NextResponse.json(
			{ ok: false, items: [], total: 0, hasNext: false, message: "list_fetch_failed" },
			{ status: 500 },
		);
	}

	const rows = Array.isArray(data) ? (data as ReqRow[]) : [];
	const partnerIds = Array.from(new Set(rows.map((x) => x.partner_id).filter((id) => typeof id === "number")));

	const partnerToUserId = new Map<number, number>();
	if (partnerIds.length > 0) {
		const { data: pRows } = await supabase.from("partners").select("id, user_id").in("id", partnerIds);
		if (Array.isArray(pRows)) {
			for (const p of pRows as Array<{ id: number; user_id: number }>) {
				partnerToUserId.set(p.id, p.user_id);
			}
		}
	}

	const userIds = Array.from(new Set(Array.from(partnerToUserId.values())));
	const userMap = new Map<number, { login_id: string | null; phone: string | null; email: string | null }>();
	if (userIds.length > 0) {
		const { data: uRows } = await supabase.from("users").select("id, login_id, phone, email").in("id", userIds);
		if (Array.isArray(uRows)) {
			for (const u of uRows as Array<{
				id: number;
				login_id: string | null;
				phone: string | null;
				email: string | null;
			}>) {
				userMap.set(u.id, { login_id: u.login_id, phone: u.phone, email: u.email });
			}
		}
	}

	const profileMap = new Map<number, string | null>();
	if (userIds.length > 0) {
		const { data: prRows } = await supabase.from("user_profiles").select("user_id, real_name").in("user_id", userIds);
		if (Array.isArray(prRows)) {
			for (const pr of prRows as Array<{ user_id: number; real_name: string | null }>) {
				profileMap.set(pr.user_id, pr.real_name ?? null);
			}
		}
	}

	const items = rows.map((row) => {
		const uid = partnerToUserId.get(row.partner_id);
		const u = uid !== undefined ? userMap.get(uid) : undefined;
		const realName = uid !== undefined ? (profileMap.get(uid) ?? null) : null;
		return {
			loginId: u?.login_id ?? "",
			realName,
			phone: u?.phone ?? "",
			requestStatus: row.request_status,
			requestAmount: String(row.request_amount),
			requestedAt: row.requested_at,
			paidAt: row.paid_at ?? null,
		};
	});

	const total = typeof totalCount === "number" ? totalCount : 0;
	const hasNext = to + 1 < total;

	return NextResponse.json({ ok: true, items, total, hasNext, message: null }, { status: 200 });
}
