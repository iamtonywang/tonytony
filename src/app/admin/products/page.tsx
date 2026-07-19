import Link from "next/link";

const PRODUCT_SLUGS = [
	"nigajun-44",
	"nigajun-99",
	"nigajun-88",
	"nigajun-77",
	"nigajun-55",
	"nigajun-35",
	"nigajun-28",
	"nigajun-17",
] as const;

export default async function Page() {
	return (
		<div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
			<h1 style={{ margin: "12px 0 8px" }}>Product Management</h1>
			<p style={{ color: "rgba(255,255,255,0.85)", marginBottom: 8 }}>
				등록된 상품의 운영 상세는 slug별 페이지에서 확인합니다.
			</p>
			<p style={{ color: "rgba(255,255,255,0.85)", marginBottom: 24 }}>
				아래 링크에서 상품을 선택해 주세요.
			</p>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
					gap: 12,
					textAlign: "left",
				}}
			>
				{PRODUCT_SLUGS.map((slug) => (
					<div
						key={slug}
						style={{
							border: "1px solid rgba(255,255,255,0.2)",
							padding: 12,
						}}
					>
						<Link href={`/admin/products/${slug}`} style={{ fontWeight: 600 }}>
							{slug}
						</Link>
						<p style={{ marginTop: 8, opacity: 0.8, fontSize: 14 }}>
							운영 상세 보기
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
