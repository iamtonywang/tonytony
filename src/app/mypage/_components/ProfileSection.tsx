import type { MyPageSummary } from "../types";

type Props = {
	summary: MyPageSummary | null;
};

export default function ProfileSection({ summary }: Props) {
	return (
		<section>
			<h2 style={{ marginBottom: 8 }}>프로필</h2>
			<div>
				<p style={{ margin: 0 }}>login_id: {summary?.loginId ?? "-"}</p>
				<p style={{ margin: 0 }}>이름: {summary?.realName ?? "-"}</p>
				<p style={{ margin: 0 }}>연락처: {summary?.phone ?? "-"}</p>
				<p style={{ margin: 0 }}>이메일: {summary?.email ?? "-"}</p>
				<p style={{ margin: 0 }}>파트너 여부: {summary?.isPartner ? "예" : "아니요"}</p>
			</div>
		</section>
	);
}

