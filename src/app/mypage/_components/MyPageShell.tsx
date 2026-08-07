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

const MENU_ITEMS: { id: Exclude<MyPageTab, "profile">; label: string }[] = [
	{ id: "orders", label: "Orders" },
	{ id: "refunds", label: "Refunds" },
	{ id: "inquiries", label: "Inquiries" },
	{ id: "partner", label: "Partner" },
];

export default function MyPageShell({ summary }: Props) {
	const [openSection, setOpenSection] = useState<MyPageTab | null>("profile");

	const toggleSection = (section: Exclude<MyPageTab, "profile">) => {
		setOpenSection((prev) => (prev === section ? "profile" : section));
	};

	return (
		<div className={styles.pageBackground}>
			<div className={styles.pageInner}>
				<div className={styles.contentWrap}>
					<h1 className={styles.pageTitle}>My Page</h1>

					<div className={styles.profileSection}>
						<ProfileSection summary={summary} />
					</div>

					<div className={styles.accordionWrap}>
						{MENU_ITEMS.map((item) => {
							const isOpen = openSection === item.id;
							const panelId = `mypage-panel-${item.id}`;
							const buttonId = `mypage-tab-${item.id}`;

							return (
								<div key={item.id} className={styles.menuGroup}>
									<div className={styles.navBox}>
										<button
											type="button"
											id={buttonId}
											className={`${styles.navItem} ${isOpen ? styles.active : ""}`}
											aria-expanded={isOpen}
											aria-controls={panelId}
											onClick={() => toggleSection(item.id)}
										>
											{item.label}
										</button>
									</div>
									{isOpen ? (
										<div
											id={panelId}
											role="region"
											aria-labelledby={buttonId}
											className={styles.accordionPanel}
										>
											<div className={styles.panelKorean}>
												{item.id === "orders" ? <OrdersSection /> : null}
												{item.id === "refunds" ? <RefundsSection /> : null}
												{item.id === "inquiries" ? <InquiriesSection /> : null}
												{item.id === "partner" ? <PartnerSection /> : null}
											</div>
										</div>
									) : null}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
