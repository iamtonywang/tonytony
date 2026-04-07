"use client";

import { useState } from "react";
import type { PartnerPageSummary, PartnerTab } from "../types";
import PartnerSummarySection from "./PartnerSummarySection";
import SettlementRequestsSection from "./SettlementRequestsSection";
import SettlementHistorySection from "./SettlementHistorySection";
import BankAccountSection from "./BankAccountSection";
import PointLogsSection from "./PointLogsSection";

type Props = {
	summary: PartnerPageSummary | null;
};

export default function PartnerShell({ summary }: Props) {
	const [activeTab, setActiveTab] = useState<PartnerTab>("summary");

	return (
		<div style={{ padding: 24 }}>
			<h1 style={{ marginBottom: 12 }}>파트너/정산</h1>

			<nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
				<button onClick={() => setActiveTab("summary")}>요약</button>
				<button onClick={() => setActiveTab("settlementRequests")}>정산요청</button>
				<button onClick={() => setActiveTab("settlementHistory")}>정산이력</button>
				<button onClick={() => setActiveTab("bankAccount")}>계좌</button>
				<button onClick={() => setActiveTab("pointLogs")}>포인트</button>
			</nav>

			{activeTab === "summary" ? <PartnerSummarySection summary={summary} /> : null}
			{activeTab === "settlementRequests" ? <SettlementRequestsSection /> : null}
			{activeTab === "settlementHistory" ? <SettlementHistorySection /> : null}
			{activeTab === "bankAccount" ? <BankAccountSection /> : null}
			{activeTab === "pointLogs" ? <PointLogsSection /> : null}
		</div>
	);
}

