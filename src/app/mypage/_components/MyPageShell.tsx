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

					{activeTab === "profile" ? (
						<div className={styles.sectionBox}>
							<h2 className={styles.sectionTitle}>Profile</h2>
							<div className={styles.profileSection}>
								<ProfileSection summary={summary} />
							</div>
						</div>
					) : null}
					{activeTab === "orders" ? (
						<div className={styles.sectionBox}>
							<h2 className={styles.sectionTitle}>Orders</h2>
							<OrdersSection />
						</div>
					) : null}
					{activeTab === "refunds" ? (
						<div className={styles.sectionBox}>
							<h2 className={styles.sectionTitle}>Refunds</h2>
							<RefundsSection />
						</div>
					) : null}
					{activeTab === "inquiries" ? (
						<div className={styles.sectionBox}>
							<h2 className={styles.sectionTitle}>Inquiries</h2>
							<InquiriesSection />
						</div>
					) : null}
					{activeTab === "partner" ? (
						<div className={styles.sectionBox}>
							<h2 className={styles.sectionTitle}>Partner</h2>
							<PartnerSection />
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

