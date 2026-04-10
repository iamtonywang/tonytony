import type { SettlementsModuleSummary } from "../_server/getSettlementsModuleSummary";

type Props = {
	data: SettlementsModuleSummary;
};

export default function SettlementSummary({ data }: Props) {
	return (
		<section
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
				gap: 10,
				marginBottom: 20,
			}}
		>
			<div style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12, borderRadius: 4 }}>
				<div style={{ fontSize: 12, opacity: 0.8 }}>전체</div>
				<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{data.total}</div>
			</div>
			<div style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12, borderRadius: 4 }}>
				<div style={{ fontSize: 12, opacity: 0.8 }}>pending</div>
				<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{data.pending}</div>
			</div>
			<div style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12, borderRadius: 4 }}>
				<div style={{ fontSize: 12, opacity: 0.8 }}>approved</div>
				<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{data.approved}</div>
			</div>
			<div style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12, borderRadius: 4 }}>
				<div style={{ fontSize: 12, opacity: 0.8 }}>rejected</div>
				<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{data.rejected}</div>
			</div>
			<div style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12, borderRadius: 4 }}>
				<div style={{ fontSize: 12, opacity: 0.8 }}>paid</div>
				<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{data.paid}</div>
			</div>
		</section>
	);
}
