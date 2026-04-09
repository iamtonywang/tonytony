import { NextRequest, NextResponse } from "next/server";

import { findRefundByOrderNumberAndRequestedAt } from "@/app/api/refunds/refundOrderKeyLookup";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type RefundCompleteBody = {
	orderNumber?: unknown;
	requestedAt?: unknown;
};

function parseOrderKey(body: RefundCompleteBody): { orderNumber: string; requestedAt: string } | null {
	const orderNumber = typeof body.orderNumber === "string" ? body.orderNumber.trim() : "";
	const requestedAt = typeof body.requestedAt === "string" ? body.requestedAt.trim() : "";
	if (!orderNumber || !requestedAt) return null;
	return { orderNumber, requestedAt };
}

export async function POST(req: NextRequest) {
	const supabase = await getSupabaseServerClient();

	const { data: authData } = await supabase.auth.getUser();
	if (!authData?.user) {
		return NextResponse.json({ ok: false, message: "Unauthorized", errors: null }, { status: 401 });
	}

	let body: RefundCompleteBody;
	try {
		body = (await req.json()) as RefundCompleteBody;
	} catch {
		return NextResponse.json({ ok: false, message: "잘못된 요청 형식입니다.", errors: null }, { status: 400 });
	}

	const key = parseOrderKey(body);
	if (!key) {
		return NextResponse.json(
			{ ok: false, message: "입력값 검증에 실패했습니다.", errors: { orderNumber: "required", requestedAt: "required" } },
			{ status: 400 },
		);
	}

	const resolved = await findRefundByOrderNumberAndRequestedAt(supabase, key.orderNumber, key.requestedAt);
	if (!resolved.ok) {
		return NextResponse.json({ ok: false, message: "refund_not_found", errors: null }, { status: 404 });
	}
	const refundId = resolved.refundId;

	const { data: userRows } = await supabase
		.from("users")
		.select("id")
		.eq("auth_user_id", authData.user.id)
		.limit(1);
	const userRow = Array.isArray(userRows) && userRows.length === 1 ? (userRows[0] as { id: number }) : null;
	if (!userRow || typeof userRow.id !== "number") {
		return NextResponse.json({ ok: false, message: "user_not_found", errors: null }, { status: 404 });
	}

	const { data: adminRows } = await supabase
		.from("admins")
		.select("id, user_id, admin_role, admin_status")
		.eq("user_id", userRow.id)
		.eq("admin_status", "active")
		.limit(1);
	const adminRow = Array.isArray(adminRows) && adminRows.length === 1
		? (adminRows[0] as {
				id: number;
				user_id: number;
				admin_role: string;
				admin_status: string;
			})
		: null;
	if (!adminRow || typeof adminRow.id !== "number") {
		return NextResponse.json({ ok: false, message: "admin_forbidden", errors: null }, { status: 403 });
	}

	const completedAt = new Date().toISOString();
	const { data: rpcData, error: rpcError } = await supabase.rpc("complete_refund_atomic", {
		p_refund_id: refundId,
		p_processed_by_admin_id: adminRow.id,
		p_completed_at: completedAt,
	});

	if (rpcError) {
		const rawMessage = typeof rpcError.message === "string" ? rpcError.message : "";
		const knownMessages = new Set([
			"admin_forbidden",
			"refund_not_completable",
			"order_not_refundable",
			"payment_not_refundable",
			"refund_amount_invalid",
			"full_refund_only",
		]);
		const mappedMessage = knownMessages.has(rawMessage) ? rawMessage : "refund_complete_failed";

		return NextResponse.json(
			{ ok: false, message: mappedMessage, errors: null },
			{ status: mappedMessage === "refund_complete_failed" ? 500 : 400 },
		);
	}

	type RpcCompleteRefundRow = {
		refund_id: number;
		order_id: number;
		payment_id: number;
		refund_status: string;
		payment_status: string;
		order_status: string;
		completed_at: string;
	};

	const rpcRow = Array.isArray(rpcData) ? (rpcData[0] as RpcCompleteRefundRow | undefined) : (rpcData as RpcCompleteRefundRow | null);
	if (!rpcRow || typeof rpcRow.refund_id !== "number") {
		return NextResponse.json({ ok: false, message: "refund_complete_failed", errors: null }, { status: 500 });
	}

	return NextResponse.json({ ok: true, message: "Refund completed", errors: null }, { status: 200 });
}
