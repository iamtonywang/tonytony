import type { CSSProperties } from "react";

import type { UsersModuleSummary } from "../_server/getUsersModuleSummary";

type Props = {
	data: UsersModuleSummary;
};

export default function UserSummary({ data }: Props) {
	const cardStyle: CSSProperties = {
		border: "1px solid rgba(255,255,255,0.25)",
		padding: 12,
		borderRadius: 4,
		textAlign: "center",
	};
	return (
		<section style={{ marginBottom: 20 }}>
			<h2 style={{ margin: "0 0 12px", fontSize: "1.1rem" }}>회원 통계</h2>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
					gap: 10,
				}}
			>
				<div style={cardStyle}>
					<div style={{ opacity: 0.85, fontSize: 12 }}>전체</div>
					<div style={{ fontSize: 20, marginTop: 4 }}>{data.total}</div>
				</div>
				<div style={cardStyle}>
					<div style={{ opacity: 0.85, fontSize: 12 }}>active</div>
					<div style={{ fontSize: 20, marginTop: 4 }}>{data.active}</div>
				</div>
				<div style={cardStyle}>
					<div style={{ opacity: 0.85, fontSize: 12 }}>blocked</div>
					<div style={{ fontSize: 20, marginTop: 4 }}>{data.blocked}</div>
				</div>
				<div style={cardStyle}>
					<div style={{ opacity: 0.85, fontSize: 12 }}>withdrawn</div>
					<div style={{ fontSize: 20, marginTop: 4 }}>{data.withdrawn}</div>
				</div>
				<div style={cardStyle}>
					<div style={{ opacity: 0.85, fontSize: 12 }}>최근 7일 가입</div>
					<div style={{ fontSize: 20, marginTop: 4 }}>{data.recentJoined7d}</div>
				</div>
			</div>
		</section>
	);
}
