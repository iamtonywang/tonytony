"use client";

import { useState } from "react";

import RefundDetail from "./RefundDetail";
import RefundList from "./RefundList";

type Selection = {
	orderNumber: string;
	requestedAt: string;
};

export default function RefundsModuleClient() {
	const [selected, setSelected] = useState<Selection | null>(null);
	const [refreshKey, setRefreshKey] = useState(0);

	const bump = () => setRefreshKey((k) => k + 1);

	return (
		<div style={{ display: "grid", gap: 20 }}>
			<RefundList selected={selected} onSelect={setSelected} refreshKey={refreshKey} />
			<RefundDetail selection={selected} refreshKey={refreshKey} onProcessed={bump} />
		</div>
	);
}
