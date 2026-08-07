import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { getAdminProductPriceBySlug } from "@/app/admin/products/_server/getAdminProductPriceBySlug";
import AdminProductInquiriesPanel from "./_components/AdminProductInquiriesPanel";
import AdminProductReviewsPanel from "./_components/AdminProductReviewsPanel";

const ALLOWED_SLUGS = new Set([
	"nigajun-44",
	"nigajun-99",
	"nigajun-88",
	"nigajun-77",
	"nigajun-55",
	"nigajun-22",
	"nigajun-11",
	"nigajun-00",
]);

function slugToDisplayTitle(slug: string): string {
	return slug
		.split("-")
		.map((part) =>
			/^\d+$/.test(part)
				? part
				: part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
		)
		.join(" ");
}

const sectionStyle = {
	border: "1px solid rgba(255,255,255,0.2)",
	padding: 12,
	marginBottom: 12,
	textAlign: "left" as const,
};

async function getRequestOrigin(): Promise<string> {
	const h = await headers();
	const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
	const isLocal = host.startsWith("localhost") || host.startsWith("127.");
	const proto = h.get("x-forwarded-proto") ?? (isLocal ? "http" : "https");
	return `${proto}://${host}`;
}

async function submitPrice(formData: FormData) {
	"use server";

	const slugRaw = formData.get("slug");
	const slug = typeof slugRaw === "string" ? slugRaw.trim() : "";
	if (!slug || !ALLOWED_SLUGS.has(slug)) {
		notFound();
	}

	const priceRaw = formData.get("priceAmount");
	const discountRaw = formData.get("discountAmount");
	const priceAmount = typeof priceRaw === "string" ? Number(priceRaw) : Number(priceRaw);
	const discountAmount = typeof discountRaw === "string" ? Number(discountRaw) : Number(discountRaw);

	const origin = await getRequestOrigin();
	const cookieHeader = (await headers()).get("cookie") ?? "";

	let message = "failed";
	let priceSaveOk = false;

	try {
		const res = await fetch(`${origin}/api/admin/products/price`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...(cookieHeader ? { Cookie: cookieHeader } : {}),
			},
			body: JSON.stringify({
				slug,
				priceAmount,
				discountAmount,
			}),
		});

		const text = await res.text();

		let data: { ok?: boolean; message?: string } | undefined;
		try {
			data = JSON.parse(text) as { ok?: boolean; message?: string };
		} catch {
			console.error(
				"admin_products_price_response_parse_failed",
				JSON.stringify({ slug, status: res.status, text }),
			);
			message = "invalid_response";
		}

		if (message !== "invalid_response") {
			if (data?.ok === true) {
				priceSaveOk = true;
			} else if (typeof data?.message === "string") {
				message = data.message;
			}
		}
	} catch (error) {
		console.error("admin_products_price_fetch_failed", error);
		message = "invalid_response";
	}

	if (priceSaveOk) {
		revalidatePath(`/admin/products/${slug}`);
		redirect(`/admin/products/${slug}?saved=1`);
	}

	redirect(`/admin/products/${slug}?err=${encodeURIComponent(message)}`);
}

export default async function Page({
	params,
	searchParams,
}: Readonly<{
	params: Promise<{ slug: string }>;
	searchParams: Promise<{
		saved?: string;
		err?: string;
	}>;
}>) {
	const { slug } = await params;
	const sp = await searchParams;

	if (!slug || !ALLOWED_SLUGS.has(slug)) {
		notFound();
	}

	const priceData = await getAdminProductPriceBySlug(slug);
	const finalPriceLabel =
		typeof priceData.finalPriceAmount === "number" ? String(priceData.finalPriceAmount) : "";
	const basePriceLabel =
		typeof priceData.priceAmount === "number" ? String(priceData.priceAmount) : "";
	const discountLabel =
		typeof priceData.discountAmount === "number" ? String(priceData.discountAmount) : "";

	let statusLine: string | null = null;
	if (sp.saved === "1") {
		statusLine = "저장되었습니다.";
	} else if (typeof sp.err === "string" && sp.err.length > 0) {
		statusLine = `실패: ${decodeURIComponent(sp.err)}`;
	}

	const displayTitle = slugToDisplayTitle(slug);

	return (
		<div style={{ maxWidth: 1080, margin: "0 auto" }}>
			<p style={{ marginBottom: 16 }}>
				<Link href="/admin/products" style={{ color: "rgba(255,255,255,0.9)" }}>
					← /admin/products
				</Link>
			</p>
			<h1 style={{ textAlign: "center", margin: "12px 0 8px" }}>{displayTitle}</h1>
			<p style={{ textAlign: "center", color: "rgba(255,255,255,0.85)", marginBottom: 24 }}>
				slug: {priceData.slug ?? slug}
			</p>

			<div style={sectionStyle}>
				<strong>Price Management</strong>
				<style
					dangerouslySetInnerHTML={{
						__html: `
.ap-price-details { margin-top: 12px; }
.ap-price-details > summary.ap-price-summary {
  list-style: none;
  cursor: pointer;
  display: inline-block;
  margin-top: 4px;
  padding: 8px 14px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 2px;
  color: rgba(255,255,255,0.92);
  background: transparent;
  user-select: none;
}
.ap-price-details > summary.ap-price-summary::-webkit-details-marker { display: none; }
.ap-price-details > summary.ap-price-summary::marker { content: ''; }
.ap-price-details > summary.ap-price-summary:hover {
  border-color: rgba(255,255,255,0.38);
  background: rgba(255,255,255,0.06);
  color: #fff;
}
.ap-price-details .ap-price-panel { margin-top: 12px; padding-top: 4px; }
.ap-price-details .ap-price-input {
  width: 100%;
  max-width: 320px;
  padding: 8px;
  box-sizing: border-box;
  background: transparent;
  color: rgba(255,255,255,0.92);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 2px;
}
.ap-price-details .ap-price-input:hover { border-color: rgba(255,255,255,0.45); }
.ap-price-details .ap-price-input:focus { outline: none; border-color: rgba(255,255,255,0.52); }
.ap-price-details .ap-price-save {
  cursor: pointer;
  margin-top: 4px;
  margin-bottom: 8px;
  padding: 8px 16px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 2px;
  color: rgba(255,255,255,0.92);
  background: transparent;
}
.ap-price-details .ap-price-save:hover {
  border-color: rgba(255,255,255,0.38);
  background: rgba(255,255,255,0.06);
  color: #fff;
}
`,
					}}
				/>
				<div style={{ marginTop: 8, marginBottom: 4, opacity: 0.9 }}>
					{priceData.currency ? (
						<p style={{ margin: "0 0 6px" }}>
							<strong>Currency</strong>: {priceData.currency}
						</p>
					) : null}
					<p style={{ margin: "0 0 6px" }}>
						<strong>Current Final Price</strong>: {finalPriceLabel}
					</p>
					<p style={{ margin: "0 0 6px" }}>
						<strong>Current Base Price</strong>: {basePriceLabel}
					</p>
					<p style={{ margin: 0 }}>
						<strong>Current Discount Amount</strong>: {discountLabel}
					</p>
				</div>
				<details className="ap-price-details">
					<summary className="ap-price-summary">가격 수정</summary>
					<div className="ap-price-panel">
						<form action={submitPrice}>
							<input type="hidden" name="slug" value={slug} />
							<div style={{ marginBottom: 10 }}>
								<label
									style={{ display: "block", marginBottom: 4, color: "rgba(255,255,255,0.88)" }}
								>
									priceAmount
								</label>
								<input
									type="number"
									min={0}
									step="0.01"
									name="priceAmount"
									required
									className="ap-price-input"
								/>
							</div>
							<div style={{ marginBottom: 10 }}>
								<label
									style={{ display: "block", marginBottom: 4, color: "rgba(255,255,255,0.88)" }}
								>
									discountAmount
								</label>
								<input
									type="number"
									min={0}
									step="0.01"
									name="discountAmount"
									required
									className="ap-price-input"
								/>
							</div>
							<button type="submit" className="ap-price-save">
								저장
							</button>
							{statusLine ? <p style={{ marginTop: 8, opacity: 0.85 }}>{statusLine}</p> : null}
						</form>
					</div>
				</details>
			</div>

			<AdminProductInquiriesPanel slug={slug} />
			<AdminProductReviewsPanel slug={slug} />

			<div style={sectionStyle}>
				<strong>Sales Status</strong>
				<p style={{ marginTop: 8, opacity: 0.8 }}>
					판매·전환 요약은 추후 집계 연동 예정입니다.
				</p>
			</div>
		</div>
	);
}
