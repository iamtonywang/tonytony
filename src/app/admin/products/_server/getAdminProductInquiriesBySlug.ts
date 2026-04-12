import "server-only";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

export type AdminProductInquiryListItem = {
	id: number;
	title: string;
	content: string;
	inquiryStatus: string;
	answerContent: string | null;
	answeredAt: string | null;
	createdAt: string;
	authorLabel: string;
	isPrivate: boolean;
};

function hasAnswerText(answer: unknown): answer is string {
	return typeof answer === "string" && answer.trim().length > 0;
}

/**
 * Admin-only read: product by slug (no public visibility filter) + inquiries for that product.
 */
export async function getAdminProductInquiriesBySlug(slug: string): Promise<AdminProductInquiryListItem[]> {
	const supabase = await getSupabaseServerReadonlyClient();

	const { data: prodRows, error: prodErr } = await supabase
		.from("products")
		.select("id, slug")
		.eq("slug", slug)
		.limit(1);

	if (prodErr || !Array.isArray(prodRows) || prodRows.length !== 1) {
		return [];
	}

	const product = prodRows[0] as { id: number; slug: string | null };

	const { data: invRows, error: invErr } = await supabase
		.from("inquiries")
		.select(
			"id, user_id, title, content, is_private, inquiry_status, answer_content, answered_at, created_at",
		)
		.eq("product_id", product.id)
		.in("inquiry_status", ["active", "answered"])
		.order("created_at", { ascending: false });

	if (invErr || !Array.isArray(invRows) || invRows.length === 0) {
		return [];
	}

	const rows = invRows as Array<{
		id: number | string;
		user_id: number | string;
		title: string;
		content: string;
		is_private: boolean;
		inquiry_status: string;
		answer_content: string | null;
		answered_at: string | null;
		created_at: string;
	}>;

	const userIds = [
		...new Set(
			rows
				.map((r) => (typeof r.user_id === "number" ? r.user_id : Number(r.user_id)))
				.filter((id) => Number.isFinite(id)),
		),
	] as number[];

	const loginByUserId = new Map<number, string>();

	if (userIds.length > 0) {
		const { data: userRows, error: userErr } = await supabase
			.from("users")
			.select("id, login_id")
			.in("id", userIds);

		if (!userErr && Array.isArray(userRows)) {
			for (const u of userRows as Array<{ id: number | string; login_id: string | null }>) {
				const uid = typeof u.id === "number" ? u.id : Number(u.id);
				if (!Number.isFinite(uid)) continue;
				if (typeof u.login_id === "string" && u.login_id.trim() !== "") {
					loginByUserId.set(uid, u.login_id.trim());
				}
			}
		}
	}

	return rows.map((r) => {
		const id = typeof r.id === "number" ? r.id : Number(r.id);
		const userId = typeof r.user_id === "number" ? r.user_id : Number(r.user_id);
		const ac = hasAnswerText(r.answer_content) ? r.answer_content.trim() : null;

		return {
			id: Number.isFinite(id) ? id : 0,
			title: typeof r.title === "string" ? r.title : "",
			content: typeof r.content === "string" ? r.content : "",
			inquiryStatus: typeof r.inquiry_status === "string" ? r.inquiry_status : "",
			answerContent: ac,
			answeredAt: r.answered_at,
			createdAt: typeof r.created_at === "string" ? r.created_at : "",
			isPrivate: Boolean(r.is_private),
			authorLabel: Number.isFinite(userId)
				? (loginByUserId.get(userId) ?? `user_id:${userId}`)
				: "(unknown)",
		};
	});
}
