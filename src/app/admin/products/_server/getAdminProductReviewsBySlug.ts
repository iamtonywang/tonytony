import "server-only";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

export type AdminProductReviewListItem = {
	id: number;
	rating: number | null;
	content: string;
	reviewStatus: string;
	createdAt: string;
	authorLabel: string;
	isPrivate: boolean;
};

/**
 * Admin-only read: product by slug (no public visibility filter) + reviews for that product.
 */
export async function getAdminProductReviewsBySlug(slug: string): Promise<AdminProductReviewListItem[]> {
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

	const { data: revRows, error: revErr } = await supabase
		.from("reviews")
		.select("id, user_id, rating, content, is_private, review_status, created_at")
		.eq("product_id", product.id)
		.in("review_status", ["active", "hidden"])
		.order("created_at", { ascending: false });

	if (revErr || !Array.isArray(revRows) || revRows.length === 0) {
		return [];
	}

	const rows = revRows as Array<{
		id: number | string;
		user_id: number | string;
		rating: number | null;
		content: string;
		is_private: boolean;
		review_status: string;
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
		const rating =
			r.rating === null || r.rating === undefined
				? null
				: typeof r.rating === "number" && Number.isFinite(r.rating)
					? r.rating
					: null;

		return {
			id: Number.isFinite(id) ? id : 0,
			rating,
			content: typeof r.content === "string" ? r.content : "",
			reviewStatus: typeof r.review_status === "string" ? r.review_status : "",
			createdAt: typeof r.created_at === "string" ? r.created_at : "",
			isPrivate: Boolean(r.is_private),
			authorLabel: Number.isFinite(userId)
				? (loginByUserId.get(userId) ?? `user_id:${userId}`)
				: "(unknown)",
		};
	});
}
