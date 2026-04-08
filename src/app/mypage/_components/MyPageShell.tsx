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
			<div className={styles.pageInner}>
				<div className={styles.contentWrap}>
					<h1 className={styles.pageTitle}>My Page</h1>
					<div className={styles.headerText}>
						<h1 className={styles.brand}>TONYWANG</h1>
						<p className={styles.sub}>plant cell genetic protein</p>
						<p className={styles.sub}>Bioengineering Laboratory</p>
						<p className={styles.desc}>May you always be blessed</p>
					</div>

					<nav className={styles.navList}>
						<div className={styles.navBox}>
							<button
								className={`${styles.navItem} ${activeTab === "profile" ? styles.active : ""}`}
								onClick={() => setActiveTab("profile")}
							>
								Profile
							</button>
						</div>
						<div className={styles.navBox}>
							<button
								className={`${styles.navItem} ${activeTab === "orders" ? styles.active : ""}`}
								onClick={() => setActiveTab("orders")}
							>
								Orders
							</button>
						</div>
						<div className={styles.navBox}>
							<button
								className={`${styles.navItem} ${activeTab === "refunds" ? styles.active : ""}`}
								onClick={() => setActiveTab("refunds")}
							>
								Refunds
							</button>
						</div>
						<div className={styles.navBox}>
							<button
								className={`${styles.navItem} ${activeTab === "inquiries" ? styles.active : ""}`}
								onClick={() => setActiveTab("inquiries")}
							>
								Inquiries
							</button>
						</div>
						<div className={styles.navBox}>
							<button
								className={`${styles.navItem} ${activeTab === "partner" ? styles.active : ""}`}
								onClick={() => setActiveTab("partner")}
							>
								Partner
							</button>
						</div>
					</nav>

					{activeTab === "profile" ? (
						<div className={styles.profileSection}>
							<ProfileSection summary={summary} />
						</div>
					) : null}
					{activeTab === "orders" ? <OrdersSection /> : null}
					{activeTab === "refunds" ? <RefundsSection /> : null}
					{activeTab === "inquiries" ? <InquiriesSection /> : null}
					{activeTab === "partner" ? <PartnerSection /> : null}
				</div>
			</div>
		</div>
	);
}

