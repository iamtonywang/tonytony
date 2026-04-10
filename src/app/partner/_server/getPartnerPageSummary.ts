import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";
import { getHeaderSession } from "@/components/sections/Header/_server/getHeaderSession";
import type { PartnerPageSummary } from "../types";

// 파트너페이지 상위 1회 최소 조회만 담당, 목록 데이터는 하위 섹션 개별 fetch 전제
export async function getPartnerPageSummary(): Promise<PartnerPageSummary | null> {
	const session = await getHeaderSession();
	if (!session.authenticated || !session.loginId || typeof session.userId !== "number") {
		return {
			partnerStatus: null,
			hasBankAccount: false,
			loginId: null,
			realName: null,
			phone: null,
			email: null,
			partnerCode: null,
			todaySalesAmount: { gross: null, commission: null, point: null },
			monthSalesAmount: { gross: null, commission: null, point: null },
			waitingSettlementAmount: { commission: null },
			availableSettlementAmount: { commission: null },
			productSalesSummary: [],
		};
	}

	const supabase = await getSupabaseServerReadonlyClient();

	const SALES_COMMISSION_RATE = 0.1;
	const POINT_PER_ORDER = 5000;

	const round2 = (n: number): number => Math.round(n * 100) / 100;
	const toNumberOrNull = (v: unknown): number | null => {
		if (typeof v === "number" && Number.isFinite(v)) return v;
		if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
		return null;
	};

	const defaultSummary: PartnerPageSummary = {
		partnerStatus: null,
		hasBankAccount: false,
		loginId: null,
		realName: null,
		phone: null,
		email: null,
		partnerCode: null,
		todaySalesAmount: { gross: null, commission: null, point: null },
		monthSalesAmount: { gross: null, commission: null, point: null },
		waitingSettlementAmount: { commission: null },
		availableSettlementAmount: { commission: null },
		productSalesSummary: [],
	};

	// users — reuse shared session user id (same row as getHeaderSession) to avoid a second login_id resolution path
	const { data: usersRows } = await supabase
		.from("users")
		.select("id, login_id, phone, email")
		.eq("id", session.userId)
		.limit(1);
	const userRow = Array.isArray(usersRows) && usersRows.length === 1
		? (usersRows[0] as { id: number; login_id: string | null; phone: string | null; email: string | null })
		: null;
	if (!userRow || typeof userRow.id !== "number") {
		return defaultSummary;
	}

	// user_profiles
	const { data: profileRows } = await supabase
		.from("user_profiles")
		.select("real_name")
		.eq("user_id", userRow.id)
		.limit(1);
	const profile = Array.isArray(profileRows) && profileRows.length === 1
		? (profileRows[0] as { real_name: string | null })
		: null;

	// partners
	const { data: partnerRows } = await supabase
		.from("partners")
		.select("id, partner_status")
		.eq("user_id", userRow.id)
		.limit(1);
	const partner = Array.isArray(partnerRows) && partnerRows.length === 1
		? (partnerRows[0] as { id: number; partner_status: string | null })
		: null;

	// bank account 존재 여부
	let hasBankAccount = false;
	let partnerCode: string | null = null;
	let todaySalesAmount: PartnerPageSummary["todaySalesAmount"] = { gross: null, commission: null, point: null };
	let monthSalesAmount: PartnerPageSummary["monthSalesAmount"] = { gross: null, commission: null, point: null };
	let waitingSettlementAmount: PartnerPageSummary["waitingSettlementAmount"] = { commission: null };
	let availableSettlementAmount: PartnerPageSummary["availableSettlementAmount"] = { commission: null };
	let productSalesSummary: PartnerPageSummary["productSalesSummary"] = [];

	if (partner?.id) {
		const { data: bankRows } = await supabase
			.from("partner_bank_accounts")
			.select("id")
			.eq("partner_id", partner.id)
			.limit(1);
		hasBankAccount = Array.isArray(bankRows) && bankRows.length === 1 ? true : false;

		// partnerCode: 다건일 경우 최신 1건을 사용
		try {
			const { data: codeRows, error: codeErr } = await supabase
				.from("partner_codes")
				.select("referral_code, created_at")
				.eq("partner_id", partner.id)
				.order("created_at", { ascending: false })
				.limit(1);
			if (!codeErr && Array.isArray(codeRows) && codeRows.length === 1) {
				partnerCode = (codeRows[0] as { referral_code: string | null }).referral_code ?? null;
			}
		} catch {
			partnerCode = null;
		}

		// 판매지표: orders 기준 (orders.partner_id 미적재 데이터가 있을 수 있어 집계 누락 가능)
		// 판매 시점 기준은 paid_at으로 고정한다.
		const now = new Date();
		const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const tomorrowStart = new Date(todayStart);
		tomorrowStart.setDate(tomorrowStart.getDate() + 1);
		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

		const sumSales = (rows: Array<{ final_amount: number | string | null }>): number => {
			let sum = 0;
			for (const r of rows) {
				const n = toNumberOrNull(r.final_amount);
				if (n !== null) sum += n;
			}
			return round2(sum);
		};

		const todayResult = await supabase
			.from("orders")
			.select("final_amount")
			.eq("partner_id", partner.id)
			.gte("paid_at", todayStart.toISOString())
			.lt("paid_at", tomorrowStart.toISOString())
			.neq("order_status", "refunded");
		if (!todayResult.error && Array.isArray(todayResult.data)) {
			const gross = sumSales(todayResult.data as Array<{ final_amount: number | string | null }>);
			const count = todayResult.data.length;
			todaySalesAmount = {
				gross,
				commission: round2(gross * SALES_COMMISSION_RATE),
				point: count * POINT_PER_ORDER,
			};
		}

		const monthResult = await supabase
			.from("orders")
			.select("final_amount")
			.eq("partner_id", partner.id)
			.gte("paid_at", monthStart.toISOString())
			.lt("paid_at", tomorrowStart.toISOString())
			.neq("order_status", "refunded");
		if (!monthResult.error && Array.isArray(monthResult.data)) {
			const gross = sumSales(monthResult.data as Array<{ final_amount: number | string | null }>);
			const count = monthResult.data.length;
			monthSalesAmount = {
				gross,
				commission: round2(gross * SALES_COMMISSION_RATE),
				point: count * POINT_PER_ORDER,
			};
		}

		// 정산지표: settlements 기준, paid/cancelled 및 환불주문 제외
		const settlementResult = await supabase
			.from("settlements")
			.select("order_id, settlement_status, settlement_amount, settlement_available_at, settlement_paid_at, cancelled_at")
			.eq("partner_id", partner.id)
			.neq("settlement_status", "paid")
			.neq("settlement_status", "cancelled")
			.is("settlement_paid_at", null)
			.is("cancelled_at", null);

		if (!settlementResult.error && Array.isArray(settlementResult.data)) {
			const settlementRows = settlementResult.data as Array<{
				order_id: number | null;
				settlement_status: string | null;
				settlement_amount: number | string | null;
				settlement_available_at: string | null;
				settlement_paid_at: string | null;
				cancelled_at: string | null;
			}>;

			const orderIds = Array.from(
				new Set(settlementRows.map((r) => r.order_id).filter((v): v is number => typeof v === "number")),
			);
			let refundedOrderIds = new Set<number>();
			if (orderIds.length > 0) {
				const orderStatusResult = await supabase
					.from("orders")
					.select("id, order_status")
					.in("id", orderIds);
				if (!orderStatusResult.error && Array.isArray(orderStatusResult.data)) {
					for (const row of orderStatusResult.data as Array<{ id: number; order_status: string | null }>) {
						if (row.order_status === "refunded") refundedOrderIds.add(row.id);
					}
				} else {
					// 환불 제외 근거를 확보 못하면 정산금액은 null 처리
					waitingSettlementAmount = { commission: null };
					availableSettlementAmount = { commission: null };
					refundedOrderIds = new Set<number>(orderIds);
				}
			}

			let waitingSum = 0;
			let availableSum = 0;
			for (const row of settlementRows) {
				if (typeof row.order_id === "number" && refundedOrderIds.has(row.order_id)) continue;
				const amount = toNumberOrNull(row.settlement_amount);
				if (amount === null) continue;
				if (!row.settlement_available_at) continue;
				const availableAt = new Date(row.settlement_available_at).getTime();
				if (Number.isNaN(availableAt)) continue;
				if (availableAt > now.getTime()) waitingSum += amount;
				else availableSum += amount;
			}
			waitingSettlementAmount = { commission: round2(waitingSum) };
			availableSettlementAmount = { commission: round2(availableSum) };
		}

		// 상품별 판매 현황: orders + order_items + products, 환불주문 제외
		const orderIdsForProductsResult = await supabase
			.from("orders")
			.select("id")
			.eq("partner_id", partner.id)
			.neq("order_status", "refunded");

		if (!orderIdsForProductsResult.error && Array.isArray(orderIdsForProductsResult.data)) {
			const orderIdsForProducts = (orderIdsForProductsResult.data as Array<{ id: number }>)
				.map((r) => r.id)
				.filter((v) => typeof v === "number");

			if (orderIdsForProducts.length === 0) {
				productSalesSummary = [];
			} else {
				const orderItemsResult = await supabase
					.from("order_items")
					.select("order_id, product_id, product_slug, product_name_snapshot, quantity, line_total_amount")
					.in("order_id", orderIdsForProducts);

				if (!orderItemsResult.error && Array.isArray(orderItemsResult.data)) {
					const orderItems = orderItemsResult.data as Array<{
						order_id: number;
						product_id: number | null;
						product_slug: string | null;
						product_name_snapshot: string | null;
						quantity: number | null;
						line_total_amount: number | string | null;
					}>;

					const productIds = Array.from(
						new Set(orderItems.map((i) => i.product_id).filter((v): v is number => typeof v === "number")),
					);

					const productMap = new Map<number, { slug: string | null; product_name: string | null }>();
					if (productIds.length > 0) {
						const productsResult = await supabase
							.from("products")
							.select("id, slug, product_name")
							.in("id", productIds);
						if (!productsResult.error && Array.isArray(productsResult.data)) {
							for (const p of productsResult.data as Array<{ id: number; slug: string | null; product_name: string | null }>) {
								productMap.set(p.id, { slug: p.slug ?? null, product_name: p.product_name ?? null });
							}
						}
					}

					const grouped = new Map<string, { label: string | null; quantity: number; gross: number }>();
					for (const item of orderItems) {
						const productInfo = typeof item.product_id === "number" ? productMap.get(item.product_id) : undefined;
						const label =
							item.product_slug ??
							item.product_name_snapshot ??
							productInfo?.slug ??
							productInfo?.product_name ??
							null;
						const key = label ?? "__unknown__";
						const current = grouped.get(key) ?? { label, quantity: 0, gross: 0 };
						const qty = typeof item.quantity === "number" ? item.quantity : 0;
						const lineTotal = toNumberOrNull(item.line_total_amount) ?? 0;
						current.quantity += qty;
						current.gross += lineTotal;
						grouped.set(key, current);
					}

					productSalesSummary = Array.from(grouped.values()).map((v) => ({
						productLabel: v.label,
						quantity: v.quantity,
						gross: round2(v.gross),
						commission: round2(v.gross * SALES_COMMISSION_RATE),
					}));
				} else {
					productSalesSummary = null;
				}
			}
		} else {
			productSalesSummary = null;
		}
	}

	return {
		partnerStatus: partner?.partner_status ?? null,
		hasBankAccount,
		partnerCode,
		todaySalesAmount,
		monthSalesAmount,
		waitingSettlementAmount,
		availableSettlementAmount,
		productSalesSummary,
		loginId: userRow.login_id ?? null,
		realName: profile?.real_name ?? null,
		phone: userRow.phone ?? null,
		email: userRow.email ?? null,
	};
}

