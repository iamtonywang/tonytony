"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState, type FormEvent } from "react";

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

function PriceManagementForm({ slug }: { slug: string }) {
	const [priceAmount, setPriceAmount] = useState("");
	const [discountAmount, setDiscountAmount] = useState("");
	const [statusLine, setStatusLine] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatusLine(null);
		setPending(true);
		try {
			const pa = Number(priceAmount);
			const da = Number(discountAmount);
			const res = await fetch("/api/admin/products/price", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					slug,
					priceAmount: pa,
					discountAmount: da,
				}),
			});
			const data = (await res.json()) as { ok?: boolean; message?: string };
			if (data.ok === true) {
				setStatusLine("저장되었습니다.");
			} else {
				setStatusLine(`실패: ${typeof data.message === "string" ? data.message : res.status}`);
			}
		} catch {
			setStatusLine("실패: network");
		} finally {
			setPending(false);
		}
	}

	return (
		<form onSubmit={onSubmit}>
			<div style={{ marginBottom: 10 }}>
				<label style={{ display: "block", marginBottom: 4, opacity: 0.9 }}>priceAmount</label>
				<input
					type="number"
					min={0}
					step="0.01"
					value={priceAmount}
					onChange={(e) => setPriceAmount(e.target.value)}
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
					value={discountAmount}
					onChange={(e) => setDiscountAmount(e.target.value)}
					required
					style={{ width: "100%", maxWidth: 320, padding: 8, boxSizing: "border-box" }}
				/>
			</div>
			<button type="submit" disabled={pending} style={{ padding: "8px 16px", marginBottom: 8 }}>
				{pending ? "저장 중…" : "저장"}
			</button>
			{statusLine ? <p style={{ marginTop: 8, opacity: 0.85 }}>{statusLine}</p> : null}
		</form>
	);
}

export default function Page() {
	const raw = useParams()?.slug;
	const slug = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

	const allowed = slug.length > 0 && ALLOWED_SLUGS.has(slug);
	if (!allowed) {
		notFound();
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
				slug: {slug}
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
				<PriceManagementForm slug={slug} />
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
