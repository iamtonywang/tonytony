import { NextRequest, NextResponse } from "next/server";

import { requireActiveAdmin } from "@/app/admin/users/_server/requireActiveAdmin";

const PAGE_SIZE = 20;

type UserRow = {
	id: number;
	login_id: string;
	phone: string;
	email: string | null;
	user_status: string;
	created_at: string;
};

export async function GET(req: NextRequest) {
	const r = await requireActiveAdmin();
	if (!r.ok) {
		if (r.reason === "unauthorized") {
			return NextResponse.json({ ok: false, items: [], hasNext: false, message: "Unauthorized" }, { status: 401 });
		}
		if (r.reason === "user_not_found") {
			return NextResponse.json({ ok: false, items: [], hasNext: false, message: "user_not_found" }, { status: 404 });
		}
		return NextResponse.json({ ok: false, items: [], hasNext: false, message: "admin_forbidden" }, { status: 403 });
	}
	const { supabase } = r;

	const url = new URL(req.url);
	const pageParam = url.searchParams.get("page");
	const page = Math.max(1, Number.isFinite(Number(pageParam)) ? Number(pageParam) : 1);
	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	const { data, error, count } = await supabase
		.from("users")
		.select("id, login_id, phone, email, user_status, created_at", { count: "exact" })
		.order("created_at", { ascending: false })
		.range(from, to);

	if (error) {
		return NextResponse.json({ ok: false, items: [], hasNext: false, message: "users_fetch_failed" }, { status: 500 });
	}

	const rows = Array.isArray(data) ? (data as UserRow[]) : [];
	const ids = rows.map((row) => row.id).filter((id) => typeof id === "number");

	let realNameByUserId = new Map<number, string | null>();
	if (ids.length > 0) {
		const { data: profRows, error: profErr } = await supabase
			.from("user_profiles")
			.select("user_id, real_name")
			.in("user_id", ids);
		if (!profErr && Array.isArray(profRows)) {
			for (const p of profRows as Array<{ user_id: number; real_name: string | null }>) {
				realNameByUserId.set(p.user_id, p.real_name ?? null);
			}
		}
	}

	const items = rows.map((row) => ({
		loginId: row.login_id,
		realName: realNameByUserId.get(row.id) ?? null,
		phone: row.phone,
		email: row.email,
		userStatus: row.user_status,
		createdAt: row.created_at,
	}));

	const total = typeof count === "number" ? count : 0;
	const hasNext = to + 1 < total;

	return NextResponse.json({ ok: true, items, hasNext, message: null }, { status: 200 });
}
