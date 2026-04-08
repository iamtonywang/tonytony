"use client";

import { useState } from "react";
import type { MyPageSummary, MyPageTab } from "../types";
import ProfileSection from "./ProfileSection";
import OrdersSection from "./OrdersSection";
import RefundsSection from "./RefundsSection";
import InquiriesSection from "./InquiriesSection";
import PartnerSection from "./PartnerSection";
import styles from "./MyPage.module.css";

type Props = {
	summary: MyPageSummary | null;
};

export default function MyPageShell({ summary }: Props) {
	const [activeTab, setActiveTab] = useState<MyPageTab>("profile");

	return (
		<div className={styles.pageBackground}>
			<div className={styles.pageInner} style={{ padding: 24 }}>
				<h1 className={styles.pageTitle}>My Page</h1>
				<div className={styles.headerText}>
					<h1 className={styles.brand}>TONYWANG</h1>
					<p className={styles.sub}>plant cell genetic protein</p>
					<p className={styles.sub}>Bioengineering Laboratory</p>
					<p className={styles.desc}>May you always be blessed</p>
				</div>

				<nav className={styles.navWrap}>
					<button
						className={`${styles.navItem} ${activeTab === "profile" ? styles.active : ""}`}
						onClick={() => setActiveTab("profile")}
					>
						Profile
					</button>
					<button
						className={`${styles.navItem} ${activeTab === "orders" ? styles.active : ""}`}
						onClick={() => setActiveTab("orders")}
					>
						Orders
					</button>
					<button
						className={`${styles.navItem} ${activeTab === "refunds" ? styles.active : ""}`}
						onClick={() => setActiveTab("refunds")}
					>
						Refunds
					</button>
					<button
						className={`${styles.navItem} ${activeTab === "inquiries" ? styles.active : ""}`}
						onClick={() => setActiveTab("inquiries")}
					>
						Inquiries
					</button>
					<button
						className={`${styles.navItem} ${activeTab === "partner" ? styles.active : ""}`}
						onClick={() => setActiveTab("partner")}
					>
						Partner
					</button>
				</nav>

				{activeTab === "profile" ? <ProfileSection summary={summary} /> : null}
				{activeTab === "orders" ? <OrdersSection /> : null}
				{activeTab === "refunds" ? <RefundsSection /> : null}
				{activeTab === "inquiries" ? <InquiriesSection /> : null}
				{activeTab === "partner" ? <PartnerSection /> : null}
			</div>
		</div>
	);
}

