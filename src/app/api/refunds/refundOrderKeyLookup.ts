import type { SupabaseClient } from "@supabase/supabase-js";

export type RefundOrderKeyLookupOk = {
	ok: true;
	refundId: number;
	orderId: number;
	paymentId: number | null;
};

export type RefundOrderKeyLookupFail = {
	ok: false;
	message: "refund_not_found" | "refund_ambiguous";
};

/**
 * Resolves internal refund row by public order_number + requested_at (no PK exposed to clients).
 */
export async function findRefundByOrderNumberAndRequestedAt(
	supabase: SupabaseClient,
	orderNumber: string,
	requestedAtIso: string,
): Promise<RefundOrderKeyLookupOk | RefundOrderKeyLookupFail> {
	const on = orderNumber.trim();
	const at = requestedAtIso.trim();
	if (!on || !at) {
		return { ok: false, message: "refund_not_found" };
	}

	const { data: orderRows, error: orderErr } = await supabase
		.from("orders")
		.select("id")
		.eq("order_number", on)
		.limit(1);

	if (orderErr || !Array.isArray(orderRows) || orderRows.length !== 1) {
		return { ok: false, message: "refund_not_found" };
	}

	const orderId = (orderRows[0] as { id: number }).id;

	const { data: refundRows, error: refundErr } = await supabase
		.from("refunds")
		.select("id, order_id, payment_id")
		.eq("order_id", orderId)
		.eq("requested_at", at)
		.limit(2);

	if (refundErr || !Array.isArray(refundRows) || refundRows.length === 0) {
		return { ok: false, message: "refund_not_found" };
	}
	if (refundRows.length > 1) {
		return { ok: false, message: "refund_ambiguous" };
	}

	const r = refundRows[0] as { id: number; order_id: number; payment_id: number | null };
	return { ok: true, refundId: r.id, orderId: r.order_id, paymentId: r.payment_id };
}
