import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { getAdminProductPriceBySlug } from "@/app/admin/products/_server/getAdminProductPriceBySlug";

const ALLOWED_SLUGS = new Set([
	"nigajun-44",
	"nigajun-99",
	"nigajun-82",
	"nigajun-77",
	"nigajun-55",
	"nigajun-35",
	"nigajun-28",
	"nigajun-17",
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

	let message = "failed";
	try {
		const data = (await res.json()) as { ok?: boolean; message?: string };
		if (data.ok === true) {
			revalidatePath(`/admin/products/${slug}`);
			redirect(`/admin/products/${slug}?saved=1`);
		}
		if (typeof data.message === "string") message = data.message;
	} catch {
		message = "invalid_response";
	}

	redirect(`/admin/products/${slug}?err=${encodeURIComponent(message)}`);
}

export default async function Page({
	params,
	searchParams,
}: Readonly<{
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ saved?: string; err?: string }>;
}>) {
	const { slug } = await params;
	const sp = await searchParams;

	if (!slug || !ALLOWED_SLUGS.has(slug)) {
		notFound();
	}

	const priceData = await getAdminProductPriceBySlug(slug);
	const fmt = (n: number | null) => (typeof n === "number" && Number.isFinite(n) ? String(n) : "—");
	const finalPriceLabel = fmt(priceData.finalPriceAmount);
	const basePriceLabel = fmt(priceData.priceAmount);
	const discountLabel = fmt(priceData.discountAmount);

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
				<strong>Basic Information</strong>
				<p style={{ marginTop: 8, opacity: 0.8 }}>
					상품 기본 메타데이터 영역입니다. 후속 단계에서 연동합니다.
				</p>
			</div>
			<div style={sectionStyle}>
				<strong>Price Management</strong>
				<p style={{ marginTop: 8, opacity: 0.8, marginBottom: 12 }}>
					가격 정책 및 표시 가격 관리입니다. 금액은 서버에서 확정합니다.
				</p>
				<div style={{ marginBottom: 16, opacity: 0.9 }}>
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
				<form action={submitPrice}>
					<input type="hidden" name="slug" value={slug} />
					<div style={{ marginBottom: 10 }}>
						<label style={{ display: "block", marginBottom: 4, opacity: 0.9 }}>priceAmount</label>
						<input
							type="number"
							min={0}
							step="0.01"
							name="priceAmount"
							required
							style={{ width: "100%", maxWidth: 320, padding: 8, boxSizing: "border-box" }}
						/>
					</div>
					<div style={{ marginBottom: 10 }}>
						<label style={{ display: "block", marginBottom: 4, opacity: 0.9 }}>discountAmount</label>
						<input
							type="number"
							min={0}
							step="0.01"
							name="discountAmount"
							required
							style={{ width: "100%", maxWidth: 320, padding: 8, boxSizing: "border-box" }}
						/>
					</div>
					<button type="submit" style={{ padding: "8px 16px", marginBottom: 8 }}>
						저장
					</button>
					{statusLine ? <p style={{ marginTop: 8, opacity: 0.85 }}>{statusLine}</p> : null}
				</form>
			</div>
			<div style={sectionStyle}>
				<strong>Inquiry Management</strong>
				<p style={{ marginTop: 8, opacity: 0.8 }}>
					문의 접수·응대 현황을 둘 자리입니다. 아직 데이터 없음.
				</p>
			</div>
			<div style={sectionStyle}>
				<strong>Review Management</strong>
				<p style={{ marginTop: 8, opacity: 0.8 }}>
					리뷰 모더레이션·노출 설정 placeholder입니다.
				</p>
			</div>
			<div style={sectionStyle}>
				<strong>Sales Status</strong>
				<p style={{ marginTop: 8, opacity: 0.8 }}>
					판매·전환 요약은 추후 집계 연동 예정입니다.
				</p>
			</div>
		</div>
	);
}
