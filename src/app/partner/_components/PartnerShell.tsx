"use client";

import { useState } from "react";
import type { PartnerPageSummary } from "../types";
import SettlementRequestsSection from "./SettlementRequestsSection";
import SettlementHistorySection from "./SettlementHistorySection";
import BankAccountSection from "./BankAccountSection";
import PointLogsSection from "./PointLogsSection";
import styles from "./PartnerShell.module.css";

type Props = {
	summary: PartnerPageSummary | null;
};

type SummaryKey = "todaySales" | "monthlySales" | "pendingSettlement" | "availableSettlement";

type AccordionKey = "settlementRequest" | "settlementHistory" | "bankAccount" | "productSales" | "points";

function formatCurrency(v: number | null | undefined) {
	if (v === null || v === undefined) return "-";
	return `₩${v.toLocaleString("ko-KR")}`;
}

function ProductSalesPanel({ summary }: { summary: PartnerPageSummary | null }) {
	if (summary?.productSalesSummary === null) {
		return <p style={{ margin: 0 }}>-</p>;
	}
	if (summary?.productSalesSummary && summary.productSalesSummary.length > 0) {
		return (
			<div style={{ display: "grid", gap: 6 }}>
				{summary.productSalesSummary.map((item, idx) => (
					<article
						key={`${item.productLabel ?? "product"}-${idx}`}
						style={{ border: "1px solid rgba(255,255,255,0.2)", padding: 8 }}
					>
						<p style={{ margin: "0 0 4px 0" }}>상품: {item.productLabel ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>수량: {item.quantity ?? "-"}</p>
						<p style={{ margin: "0 0 4px 0" }}>총판매금액: {formatCurrency(item.gross)}</p>
						<p style={{ margin: 0 }}>내 수익(10%): {formatCurrency(item.commission)}</p>
					</article>
				))}
			</div>
		);
	}
	return <p style={{ margin: 0 }}>-</p>;
}

export default function PartnerShell({ summary }: Props) {
	const [openSummary, setOpenSummary] = useState<SummaryKey | null>(null);
	const [openSection, setOpenSection] = useState<AccordionKey | null>(null);

	const toggle = (key: AccordionKey) => {
		setOpenSection((prev) => (prev === key ? null : key));
	};

	return (
		<div className={styles.partnerWrap}>
			<div className={styles.partnerHeader}>
				<h1 className={styles.partnerTitle}>TONYWANG</h1>
				<p className={styles.partnerSubtitle}>Congratulations on your profit</p>
				<p className={styles.partnerSubtitle}>Partner Center</p>
				<div className={styles.headerDivider} aria-hidden />
			</div>

			<div className={styles.summaryStack}>
				<div className={styles.accordionItem}>
					<button
						type="button"
						className={styles.summaryButton}
						onClick={() => setOpenSummary((prev) => (prev === "todaySales" ? null : "todaySales"))}
					>
						<span className={styles.sectionLabel}>Today Sales</span>
					</button>
					{openSummary === "todaySales" ? (
						<div className={styles.summaryPanel}>
							<div className={styles.boxValue}>{formatCurrency(summary?.todaySalesAmount?.gross)}</div>
						</div>
					) : null}
				</div>

				<div className={styles.accordionItem}>
					<button
						type="button"
						className={styles.summaryButton}
						onClick={() => setOpenSummary((prev) => (prev === "monthlySales" ? null : "monthlySales"))}
					>
						<span className={styles.sectionLabel}>Monthly Sales</span>
					</button>
					{openSummary === "monthlySales" ? (
						<div className={styles.summaryPanel}>
							<div className={styles.boxValue}>{formatCurrency(summary?.monthSalesAmount?.gross)}</div>
						</div>
					) : null}
				</div>

				<div className={styles.accordionItem}>
					<button
						type="button"
						className={styles.summaryButton}
						onClick={() =>
							setOpenSummary((prev) => (prev === "pendingSettlement" ? null : "pendingSettlement"))
						}
					>
						<span className={styles.sectionLabel}>Pending Settlement</span>
					</button>
					{openSummary === "pendingSettlement" ? (
						<div className={styles.summaryPanel}>
							<div className={styles.boxValue}>{formatCurrency(summary?.waitingSettlementAmount?.commission)}</div>
						</div>
					) : null}
				</div>

				<div className={styles.accordionItem}>
					<button
						type="button"
						className={styles.summaryButton}
						onClick={() =>
							setOpenSummary((prev) => (prev === "availableSettlement" ? null : "availableSettlement"))
						}
					>
						<span className={styles.sectionLabel}>Available Settlement</span>
					</button>
					{openSummary === "availableSettlement" ? (
						<div className={styles.summaryPanel}>
							<div className={styles.boxValue}>{formatCurrency(summary?.availableSettlementAmount?.commission)}</div>
						</div>
					) : null}
				</div>
			</div>

			<div className={styles.sectionStack}>
				<div className={styles.accordionItem}>
					<button
						type="button"
						className={styles.sectionButton}
						onClick={() => toggle("settlementRequest")}
					>
						<span className={styles.sectionLabel}>Settlement Request</span>
					</button>
					{openSection === "settlementRequest" ? (
						<div className={styles.accordionPanel}>
							<div className={styles.panelInner}>
								<SettlementRequestsSection />
							</div>
						</div>
					) : null}
				</div>

				<div className={styles.accordionItem}>
					<button
						type="button"
						className={styles.sectionButton}
						onClick={() => toggle("settlementHistory")}
					>
						<span className={styles.sectionLabel}>Settlement History</span>
					</button>
					{openSection === "settlementHistory" ? (
						<div className={styles.accordionPanel}>
							<div className={styles.panelInner}>
								<SettlementHistorySection />
							</div>
						</div>
					) : null}
				</div>

				<div className={styles.accordionItem}>
					<button type="button" className={styles.sectionButton} onClick={() => toggle("bankAccount")}>
						<span className={styles.sectionLabel}>Bank Account</span>
					</button>
					{openSection === "bankAccount" ? (
						<div className={styles.accordionPanel}>
							<div className={styles.panelInner}>
								<BankAccountSection />
							</div>
						</div>
					) : null}
				</div>

				<div className={styles.accordionItem}>
					<button type="button" className={styles.sectionButton} onClick={() => toggle("productSales")}>
						<span className={styles.sectionLabel}>Product Sales</span>
					</button>
					{openSection === "productSales" ? (
						<div className={styles.accordionPanel}>
							<div className={styles.panelInner}>
								<ProductSalesPanel summary={summary} />
							</div>
						</div>
					) : null}
				</div>

				<div className={styles.accordionItem}>
					<button type="button" className={styles.sectionButton} onClick={() => toggle("points")}>
						<span className={styles.sectionLabel}>Points</span>
					</button>
					{openSection === "points" ? (
						<div className={styles.accordionPanel}>
							<div className={styles.panelInner}>
								<PointLogsSection />
							</div>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
