import "server-only";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

export type AdminProductPriceRead = {
	slug: string | null;
	currency: string | null;
	priceAmount: number | null;
	discountAmount: number | null;
	finalPriceAmount: number | null;
};

function emptyRead(): AdminProductPriceRead {
	return {
		slug: null,
		currency: null,
		priceAmount: null,
		discountAmount: null,
		finalPriceAmount: null,
	};
}

function toFiniteNumber(v: unknown): number | null {
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "string" && v.trim() !== "") {
		const n = Number(v);
		if (Number.isFinite(n)) return n;
	}
	return null;
}

/**
 * Admin-only read: product by slug (no public visibility filter) + active product_prices row.
 */
export async function getAdminProductPriceBySlug(slug: string): Promise<AdminProductPriceRead> {
	const supabase = await getSupabaseServerReadonlyClient();

	const { data: prodRows, error: prodErr } = await supabase
		.from("products")
		.select("id, slug")
		.eq("slug", slug)
		.limit(1);

	if (prodErr || !Array.isArray(prodRows) || prodRows.length !== 1) {
		return emptyRead();
	}

	const product = prodRows[0] as { id: number; slug: string | null };

	const { data: priceRows, error: priceErr } = await supabase
		.from("product_prices")
		.select("product_id, currency, price_amount, discount_amount, final_price_amount")
		.eq("product_id", product.id)
		.eq("is_active", true)
		.limit(2);

	if (priceErr || !Array.isArray(priceRows) || priceRows.length !== 1) {
		return {
			slug: product.slug,
			currency: null,
			priceAmount: null,
			discountAmount: null,
			finalPriceAmount: null,
		};
	}

	const pr = priceRows[0] as {
		currency: string | null;
		price_amount: unknown;
		discount_amount: unknown;
		final_price_amount: unknown;
	};

	const currency =
		typeof pr.currency === "string" && pr.currency.trim().length > 0 ? pr.currency.trim() : null;

	return {
		slug: product.slug,
		currency,
		priceAmount: toFiniteNumber(pr.price_amount),
		discountAmount: toFiniteNumber(pr.discount_amount),
		finalPriceAmount: toFiniteNumber(pr.final_price_amount),
	};
}
