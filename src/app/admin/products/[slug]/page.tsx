import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { getAdminProductPriceBySlug } from "@/app/admin/products/_server/getAdminProductPriceBySlug";
import { getAdminProductInquiriesBySlug } from "@/app/admin/products/_server/getAdminProductInquiriesBySlug";
import { getAdminProductReviewsBySlug } from "@/app/admin/products/_server/getAdminProductReviewsBySlug";

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

async function submitInquiryAnswer(formData: FormData) {
	"use server";

	const slugRaw = formData.get("slug");
	const slug = typeof slugRaw === "string" ? slugRaw.trim() : "";
	if (!slug || !ALLOWED_SLUGS.has(slug)) {
		notFound();
	}

	const idRaw = formData.get("inquiryId");
	const inquiryId =
		typeof idRaw === "string" ? Number(idRaw.trim()) : typeof idRaw === "number" ? Number(idRaw) : NaN;
	const answerRaw = formData.get("answerContent");
	const answerContent = typeof answerRaw === "string" ? answerRaw.trim() : "";

	if (!Number.isFinite(inquiryId) || inquiryId <= 0) {
		redirect(`/admin/products/${slug}?inq_err=${encodeURIComponent("invalid_inquiry_id")}`);
	}
	if (answerContent.length === 0) {
		redirect(`/admin/products/${slug}?inq_err=${encodeURIComponent("answer_content_required")}`);
	}

	const origin = await getRequestOrigin();
	const cookieHeader = (await headers()).get("cookie") ?? "";

	const res = await fetch(`${origin}/api/admin/products/inquiry`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(cookieHeader ? { Cookie: cookieHeader } : {}),
		},
		body: JSON.stringify({ inquiryId, answerContent }),
	});

	let message = "failed";
	try {
		const data = (await res.json()) as { ok?: boolean; message?: string };
		if (data.ok === true) {
			revalidatePath(`/admin/products/${slug}`);
			redirect(`/admin/products/${slug}?inq_saved=1`);
		}
		if (typeof data.message === "string" && data.message.trim() !== "") {
			message = data.message.trim();
		} else if (!res.ok) {
			message = `http_${res.status}`;
		}
	} catch {
		message = "invalid_response";
	}

	redirect(`/admin/products/${slug}?inq_err=${encodeURIComponent(message)}`);
}

export default async function Page({
	params,
	searchParams,
}: Readonly<{
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ saved?: string; err?: string; inq_saved?: string; inq_err?: string }>;
}>) {
	const { slug } = await params;
	const sp = await searchParams;

	if (!slug || !ALLOWED_SLUGS.has(slug)) {
		notFound();
	}

	const [priceData, inquiries, reviews] = await Promise.all([
		getAdminProductPriceBySlug(slug),
		getAdminProductInquiriesBySlug(slug),
		getAdminProductReviewsBySlug(slug),
	]);
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

	let inquirySavedLine: string | null = null;
	if (sp.inq_saved === "1") {
		inquirySavedLine = "문의 답변이 저장되었습니다.";
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
			<div style={sectionStyle}>
				<strong>Inquiry Management</strong>
				{typeof sp.inq_err === "string" && sp.inq_err.length > 0 ? (
					<p
						role="alert"
						style={{
							marginTop: 8,
							marginBottom: 8,
							color: "rgb(248, 113, 113)",
							fontFamily: "ui-monospace, Consolas, monospace",
							wordBreak: "break-word",
							whiteSpace: "pre-wrap",
						}}
					>
						inq_err: {sp.inq_err}
					</p>
				) : null}
				{inquirySavedLine ? (
					<p style={{ marginTop: 8, marginBottom: 0, opacity: 0.9 }}>{inquirySavedLine}</p>
				) : null}
				{inquiries.length === 0 ? (
					<p style={{ marginTop: 8, opacity: 0.8 }}>등록된 문의가 없습니다.</p>
				) : (
					<ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none" }}>
						{inquiries.map((row) => {
							const replyLabel = row.answerContent ? "답변완료" : "미답변";
							return (
								<li
									key={row.id}
									style={{
										marginBottom: 14,
										paddingBottom: 12,
										borderBottom: "1px solid rgba(255,255,255,0.12)",
									}}
								>
									<div
										style={{
											border: "1px solid rgba(255,255,255,0.18)",
											borderRadius: 4,
											padding: 10,
											marginBottom: 10,
											background: "rgba(255,255,255,0.03)",
										}}
									>
										<p style={{ margin: "0 0 4px", opacity: 0.95 }}>
											<strong>작성자</strong>: {row.authorLabel}
										</p>
										<p style={{ margin: "0 0 4px", opacity: 0.88, fontSize: 12 }}>
											<span
												style={{
													display: "inline-block",
													padding: "2px 8px",
													border: "1px solid rgba(255,255,255,0.22)",
													borderRadius: 2,
													color: "rgba(255,255,255,0.88)",
												}}
											>
												{row.isPrivate === true ? "비밀글" : "일반글"}
											</span>
										</p>
										<p style={{ margin: "0 0 4px", opacity: 0.95 }}>
											<strong>제목</strong>: {row.title}
										</p>
										<p style={{ margin: "0 0 4px", opacity: 0.95, whiteSpace: "pre-wrap" }}>
											<strong>문의내용</strong>: {row.content}
										</p>
										<p style={{ margin: "0 0 4px", opacity: 0.95 }}>
											<strong>상태</strong>: {row.inquiryStatus}
										</p>
										<p style={{ margin: "0 0 4px", opacity: 0.95 }}>
											<strong>답변</strong>: {replyLabel}
										</p>
										<p style={{ margin: 0, opacity: 0.95 }}>
											<strong>생성일</strong>: {row.createdAt}
										</p>
									</div>
									{row.answerContent ? (
										<div
											style={{
												border: "1px solid rgba(255,255,255,0.28)",
												borderLeft: "3px solid rgba(255,255,255,0.42)",
												borderRadius: 4,
												padding: 10,
												background: "rgba(255,255,255,0.06)",
												opacity: 0.95,
											}}
										>
											<p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.92 }}>
												<strong>관리자 답변</strong>
											</p>
											<p style={{ margin: "0 0 4px", whiteSpace: "pre-wrap" }}>
												<strong>답변내용</strong>: {row.answerContent}
											</p>
											<p style={{ margin: "0 0 4px" }}>
												<strong>답변자</strong>: TONYWANG
											</p>
											{row.answeredAt ? (
												<p style={{ margin: 0 }}>
													<strong>답변일</strong>: {row.answeredAt}
												</p>
											) : null}
										</div>
									) : (
										<div
											style={{
												border: "1px solid rgba(255,255,255,0.24)",
												borderRadius: 4,
												padding: 10,
												marginTop: 0,
												background: "rgba(255,255,255,0.05)",
											}}
										>
											<form action={submitInquiryAnswer}>
												<input type="hidden" name="slug" value={slug} />
												<input type="hidden" name="inquiryId" value={String(row.id)} />
												<label
													style={{ display: "block", marginBottom: 4, opacity: 0.88 }}
													htmlFor={`inq-answer-${row.id}`}
												>
													답변 작성
												</label>
												<textarea
													id={`inq-answer-${row.id}`}
													name="answerContent"
													required
													rows={4}
													style={{
														width: "100%",
														maxWidth: 520,
														boxSizing: "border-box",
														padding: 8,
														background: "transparent",
														color: "rgba(255,255,255,0.92)",
														border: "1px solid rgba(255,255,255,0.3)",
														borderRadius: 2,
													}}
												/>
												<div style={{ marginTop: 6 }}>
													<button
														type="submit"
														style={{
															cursor: "pointer",
															padding: "8px 16px",
															border: "1px solid rgba(255,255,255,0.2)",
															borderRadius: 2,
															color: "rgba(255,255,255,0.92)",
															background: "transparent",
														}}
													>
														답변 저장
													</button>
												</div>
											</form>
										</div>
									)}
								</li>
							);
						})}
					</ul>
				)}
			</div>
			<div style={sectionStyle}>
				<strong>Review Management</strong>
				{reviews.length === 0 ? (
					<p style={{ marginTop: 8, opacity: 0.8 }}>등록된 리뷰가 없습니다.</p>
				) : (
					<ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none" }}>
						{reviews.map((row) => (
							<li
								key={row.id}
								style={{
									marginBottom: 14,
									paddingBottom: 12,
									borderBottom: "1px solid rgba(255,255,255,0.12)",
								}}
							>
								<p style={{ margin: "0 0 4px", opacity: 0.95 }}>
									<strong>작성자</strong>: {row.authorLabel}
								</p>
								<p style={{ margin: "0 0 4px", opacity: 0.95 }}>
									<strong>평점</strong>:{" "}
									{row.rating !== null && row.rating !== undefined ? String(row.rating) : "—"}
								</p>
								<p style={{ margin: "0 0 4px", opacity: 0.95, whiteSpace: "pre-wrap" }}>
									<strong>리뷰내용</strong>: {row.content}
								</p>
								<p style={{ margin: "0 0 4px", opacity: 0.95 }}>
									<strong>상태</strong>: {row.reviewStatus}
								</p>
								<p style={{ margin: 0, opacity: 0.95 }}>
									<strong>생성일</strong>: {row.createdAt}
								</p>
							</li>
						))}
					</ul>
				)}
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
