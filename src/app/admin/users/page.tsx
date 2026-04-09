import { getUsersModuleSummary } from "./_server/getUsersModuleSummary";
import UserSummary from "./_components/UserSummary";
import UsersModuleClient from "./_components/UsersModuleClient";

export default async function Page() {
	const summary = await getUsersModuleSummary();

	return (
		<div style={{ maxWidth: 1080, margin: "0 auto" }}>
			<h1 style={{ textAlign: "center", margin: "12px 0 8px" }}>Users Module</h1>
			<p style={{ textAlign: "center", color: "rgba(255,255,255,0.85)", marginBottom: 20 }}>
				회원 통계 · 목록(20명 단위) · 상세(선택 시 조회)
			</p>
			<UserSummary data={summary} />
			<UsersModuleClient />
		</div>
	);
}
