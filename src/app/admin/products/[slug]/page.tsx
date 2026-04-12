import Link from "next/link";
import { notFound } from "next/navigation";

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

export default async function Page({
	params,
}: Readonly<{
	params: Promise<{ slug: string }>;
}>) {
	const { slug } = await params;
	if (!ALLOWED_SLUGS.has(slug)) {
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
				<p style={{ marginTop: 8, opacity: 0.8 }}>
					가격 정책 및 표시 가격 관리 영역입니다. placeholder입니다.
				</p>
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
