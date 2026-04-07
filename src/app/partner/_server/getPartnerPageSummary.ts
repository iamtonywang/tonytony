import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PartnerPageSummary } from "../types";

// 파트너페이지 상위 1회 최소 조회만 담당, 목록 데이터는 하위 섹션 개별 fetch 전제
export async function getPartnerPageSummary(): Promise<PartnerPageSummary | null> {
	const supabase = await getSupabaseServerClient();

	const { data: userData } = await supabase.auth.getUser();
	if (!userData?.user) {
		return {
			partnerStatus: null,
			todaySalesAmount: null,
			monthSalesAmount: null,
			availableSettlementAmount: null,
			hasBankAccount: false,
			loginId: null,
			realName: null,
			phone: null,
			email: null,
		};
	}

	// users
	const { data: usersRows } = await supabase
		.from("users")
		.select("id, login_id, phone, email")
		.eq("auth_user_id", userData.user.id)
		.limit(1);
	const userRow = Array.isArray(usersRows) && usersRows.length === 1
		? (usersRows[0] as { id: number; login_id: string | null; phone: string | null; email: string | null })
		: null;
	if (!userRow || typeof userRow.id !== "number") {
		return {
			partnerStatus: null,
			todaySalesAmount: null,
			monthSalesAmount: null,
			availableSettlementAmount: null,
			hasBankAccount: false,
			loginId: null,
			realName: null,
			phone: null,
			email: null,
		};
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
	if (partner?.id) {
		const { data: bankRows } = await supabase
			.from("partner_bank_accounts")
			.select("id")
			.eq("partner_id", partner.id)
			.limit(1);
		hasBankAccount = Array.isArray(bankRows) && bankRows.length === 1 ? true : false;
	}

	return {
		partnerStatus: partner?.partner_status ?? null,
		todaySalesAmount: null, // 계산 로직은 이번 단계에서 제외
		monthSalesAmount: null, // 계산 로직은 이번 단계에서 제외
		availableSettlementAmount: null, // 계산 로직은 이번 단계에서 제외
		hasBankAccount,
		loginId: userRow.login_id ?? null,
		realName: profile?.real_name ?? null,
		phone: userRow.phone ?? null,
		email: userRow.email ?? null,
	};
}

