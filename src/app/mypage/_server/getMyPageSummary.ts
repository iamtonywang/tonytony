import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";
import { getHeaderSession } from "@/components/sections/Header/_server/getHeaderSession";
import type { MyPageSummary } from "../types";

// 마이페이지 상위 1회 최소 조회만 담당, 목록/무거운 데이터는 하위 섹션 개별 fetch 전제
export async function getMyPageSummary(): Promise<MyPageSummary | null> {
	const totalStart = Date.now();
	const headerSessionStart = Date.now();
	const headerSession = await getHeaderSession();
	console.log(`[mypage_header_session] ${Date.now() - headerSessionStart} ms`);
	if (!headerSession.authenticated || !headerSession.loginId) {
		console.log(`[mypage_total] ${Date.now() - totalStart} ms`);
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
	const usersQueryStart = Date.now();
	const { data: usersRows } = await supabase
		.from("users")
		.select("id, login_id, phone, email")
		.eq("login_id", headerSession.loginId)
		.limit(1);
	console.log(`[mypage_users_query] ${Date.now() - usersQueryStart} ms`);
	const userRow = Array.isArray(usersRows) && usersRows.length === 1
		? (usersRows[0] as { id: number; login_id: string | null; phone: string | null; email: string | null })
		: null;

	if (!userRow || typeof userRow.id !== "number") {
		console.log(`[mypage_total] ${Date.now() - totalStart} ms`);
		return {
			loginId: null,
			realName: null,
			phone: null,
			email: null,
			isPartner: false,
		};
	}

	// user_profiles
	const profilesQueryStart = Date.now();
	const { data: profileRows } = await supabase
		.from("user_profiles")
		.select("real_name")
		.eq("user_id", userRow.id)
		.limit(1);
	console.log(`[mypage_user_profiles_query] ${Date.now() - profilesQueryStart} ms`);
	const profile = Array.isArray(profileRows) && profileRows.length === 1
		? (profileRows[0] as { real_name: string | null })
		: null;

	// partners (partner 여부)
	const partnersQueryStart = Date.now();
	const { data: partnerRows } = await supabase
		.from("partners")
		.select("id, partner_status")
		.eq("user_id", userRow.id)
		.limit(1);
	console.log(`[mypage_partners_query] ${Date.now() - partnersQueryStart} ms`);
	const isPartner = Array.isArray(partnerRows) && partnerRows.length === 1 ? true : false;

	const mergeStart = Date.now();
	const summary: MyPageSummary = {
		loginId: (userRow.login_id ?? null),
		realName: (profile?.real_name ?? null),
		phone: (userRow.phone ?? null),
		email: (userRow.email ?? null),
		isPartner,
	};
	console.log(`[mypage_merge] ${Date.now() - mergeStart} ms`);
	console.log(`[mypage_total] ${Date.now() - totalStart} ms`);
	return summary;
}

