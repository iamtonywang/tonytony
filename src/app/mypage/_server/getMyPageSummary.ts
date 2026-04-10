import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";
import { getHeaderSession } from "@/components/sections/Header/_server/getHeaderSession";
import type { MyPageSummary } from "../types";

// 마이페이지 상위 1회 최소 조회만 담당, 목록/무거운 데이터는 하위 섹션 개별 fetch 전제
export async function getMyPageSummary(): Promise<MyPageSummary | null> {
	const headerSession = await getHeaderSession();
	if (!headerSession.authenticated || !headerSession.loginId) {
		return {
			loginId: null,
			realName: null,
			phone: null,
			email: null,
			isPartner: false,
		};
	}

	const supabase = await getSupabaseServerReadonlyClient();

	// users
	const { data: usersRows } = await supabase
		.from("users")
		.select("id, login_id, phone, email")
		.eq("login_id", headerSession.loginId)
		.limit(1);
	const userRow = Array.isArray(usersRows) && usersRows.length === 1
		? (usersRows[0] as { id: number; login_id: string | null; phone: string | null; email: string | null })
		: null;

	if (!userRow || typeof userRow.id !== "number") {
		return {
			loginId: null,
			realName: null,
			phone: null,
			email: null,
			isPartner: false,
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

	// partners (partner 여부)
	const { data: partnerRows } = await supabase
		.from("partners")
		.select("id, partner_status")
		.eq("user_id", userRow.id)
		.limit(1);
	const isPartner = Array.isArray(partnerRows) && partnerRows.length === 1 ? true : false;

	return {
		loginId: (userRow.login_id ?? null),
		realName: (profile?.real_name ?? null),
		phone: (userRow.phone ?? null),
		email: (userRow.email ?? null),
		isPartner,
	};
}

