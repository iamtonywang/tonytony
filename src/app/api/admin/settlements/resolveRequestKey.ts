import type { SupabaseClient } from "@supabase/supabase-js";

export type ResolveRequestKeyResult =
	| { ok: true; requestId: number }
	| { ok: false; message: "not_found" | "ambiguous" };

/**
 * Resolves a settlement request from public display key (no request id exposed to clients).
 */
export async function findSettlementRequestIdByDisplayKey(
	supabase: SupabaseClient,
	loginId: string,
	requestedAtIso: string,
	requestAmountRaw: string,
): Promise<ResolveRequestKeyResult> {
	const lid = loginId.trim();
	const ra = requestedAtIso.trim();
	const amt = requestAmountRaw.trim();
	if (!lid || !ra || !amt) {
		return { ok: false, message: "not_found" };
	}

	const { data: userRows } = await supabase.from("users").select("id").eq("login_id", lid).limit(2);
	if (!Array.isArray(userRows) || userRows.length !== 1) {
		return { ok: false, message: "not_found" };
	}
	const userPk = (userRows[0] as { id: number }).id;

	const { data: partnerRows } = await supabase.from("partners").select("id").eq("user_id", userPk).limit(1);
	if (!Array.isArray(partnerRows) || partnerRows.length !== 1) {
		return { ok: false, message: "not_found" };
	}
	const partnerPk = (partnerRows[0] as { id: number }).id;

	const amountNum = Number(amt);
	if (!Number.isFinite(amountNum)) {
		return { ok: false, message: "not_found" };
	}

	const { data: reqRows } = await supabase
		.from("partner_settlement_requests")
		.select("id")
		.eq("partner_id", partnerPk)
		.eq("requested_at", ra)
		.eq("request_amount", amountNum)
		.limit(2);

	if (!Array.isArray(reqRows) || reqRows.length === 0) {
		return { ok: false, message: "not_found" };
	}
	if (reqRows.length > 1) {
		return { ok: false, message: "ambiguous" };
	}

	return { ok: true, requestId: (reqRows[0] as { id: number }).id };
}
