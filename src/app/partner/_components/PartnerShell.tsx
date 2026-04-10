"use client";

import { useState } from "react";
import type { PartnerPageSummary, PartnerTab } from "../types";
import PartnerSummarySection from "./PartnerSummarySection";
import SettlementRequestsSection from "./SettlementRequestsSection";
import SettlementHistorySection from "./SettlementHistorySection";
import BankAccountSection from "./BankAccountSection";
import PointLogsSection from "./PointLogsSection";
import styles from "./PartnerShell.module.css";

type Props = {
	summary: PartnerPageSummary | null;
};

export default function PartnerShell({ summary }: Props) {
	const [activeTab, setActiveTab] = useState<PartnerTab>("summary");

	return (
		<div className={styles.partnerWrap}>
			<h1 className={styles.partnerTitle}>TONYWANG</h1>
			<p className={styles.partnerSubtitle}>Congratulations on your profit</p>
			<p className={styles.partnerSubtitle}>Partner Center</p>

			<nav className={styles.partnerNav}>
				<button type="button" onClick={() => setActiveTab("summary")}>
					요약
				</button>
				<button type="button" onClick={() => setActiveTab("settlementRequests")}>
					정산요청
				</button>
				<button type="button" onClick={() => setActiveTab("settlementHistory")}>
					정산이력
				</button>
				<button type="button" onClick={() => setActiveTab("bankAccount")}>
					계좌
				</button>
				<button type="button" onClick={() => setActiveTab("pointLogs")}>
					포인트
				</button>
			</nav>

			{activeTab === "summary" ? <PartnerSummarySection summary={summary} /> : null}
			{activeTab === "settlementRequests" ? <SettlementRequestsSection /> : null}
			{activeTab === "settlementHistory" ? <SettlementHistorySection /> : null}
			{activeTab === "bankAccount" ? <BankAccountSection /> : null}
			{activeTab === "pointLogs" ? <PointLogsSection /> : null}
		</div>
	);
}

