import type { RefundsModuleSummary } from "../_server/getRefundsModuleSummary";

type Props = {
	data: RefundsModuleSummary;
};

export default function RefundSummary({ data }: Props) {
	return (
		<section
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
				gap: 10,
				marginBottom: 20,
			}}
		>
			<div style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12, borderRadius: 4 }}>
				<div style={{ fontSize: 12, opacity: 0.8 }}>전체</div>
				<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{data.total}</div>
			</div>
			<div style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12, borderRadius: 4 }}>
				<div style={{ fontSize: 12, opacity: 0.8 }}>requested</div>
				<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{data.requested}</div>
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
				<div style={{ fontSize: 12, opacity: 0.8 }}>completed</div>
				<div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{data.completed}</div>
			</div>
		</section>
	);
}
