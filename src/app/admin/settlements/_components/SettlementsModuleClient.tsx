"use client";

import { useState } from "react";

import SettlementDetail from "./SettlementDetail";
import SettlementRequestList, { type SettlementRequestSelection } from "./SettlementRequestList";

export default function SettlementsModuleClient() {
	const [selected, setSelected] = useState<SettlementRequestSelection | null>(null);
	const [refreshKey, setRefreshKey] = useState(0);

	const bump = () => setRefreshKey((k) => k + 1);

	return (
		<div style={{ display: "grid", gap: 20 }}>
			<SettlementRequestList selected={selected} onSelect={setSelected} refreshKey={refreshKey} />
			<SettlementDetail selection={selected} refreshKey={refreshKey} onProcessed={bump} />
		</div>
	);
}
