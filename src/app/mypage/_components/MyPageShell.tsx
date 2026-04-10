"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { MyPageSummary, MyPageTab } from "../types";
import ProfileSection from "./ProfileSection";
import OrdersSection from "./OrdersSection";
import RefundsSection from "./RefundsSection";
import PartnerSection from "./PartnerSection";
import styles from "./MyPage.module.css";

type Props = {
	summary: MyPageSummary | null;
};

export default function MyPageShell({ summary }: Props) {
	const router = useRouter();
	const [openSection, setOpenSection] = useState<MyPageTab | null>("profile");

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

					<div className={styles.accordionWrap}>
						<div className={styles.navBox}>
							<button
								type="button"
								className={`${styles.navItem} ${openSection === "profile" ? styles.active : ""}`}
								onClick={() => setOpenSection((prev) => (prev === "profile" ? null : "profile"))}
							>
								Profile
							</button>
						</div>
						{openSection === "profile" ? (
							<div className={styles.accordionPanel}>
								<div className={styles.profileSection}>
									<ProfileSection summary={summary} />
								</div>
							</div>
						) : null}

						<div className={styles.navBox}>
							<button
								type="button"
								className={`${styles.navItem} ${openSection === "orders" ? styles.active : ""}`}
								onClick={() => setOpenSection((prev) => (prev === "orders" ? null : "orders"))}
							>
								Orders
							</button>
						</div>
						{openSection === "orders" ? (
							<div className={styles.accordionPanel}>
								<div className={styles.panelKorean}>
									<OrdersSection />
								</div>
							</div>
						) : null}

						<div className={styles.navBox}>
							<button
								type="button"
								className={`${styles.navItem} ${openSection === "refunds" ? styles.active : ""}`}
								onClick={() => setOpenSection((prev) => (prev === "refunds" ? null : "refunds"))}
							>
								Refunds
							</button>
						</div>
						{openSection === "refunds" ? (
							<div className={styles.accordionPanel}>
								<div className={styles.panelKorean}>
									<RefundsSection />
								</div>
							</div>
						) : null}

						<div className={styles.navBox}>
							<button
								type="button"
								className={`${styles.navItem} ${openSection === "partner" ? styles.active : ""}`}
								onClick={() => setOpenSection((prev) => (prev === "partner" ? null : "partner"))}
							>
								Partner
							</button>
						</div>
						{openSection === "partner" ? (
							<div className={styles.accordionPanel}>
								<div className={styles.panelKorean}>
									<PartnerSection />
								</div>
							</div>
						) : null}
					</div>

					{summary?.isPartner ? (
						<div
							className={styles.partnerCtaBox}
							onClick={() => router.push("/partner")}
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									router.push("/partner");
								}
							}}
						>
							<div className={styles.partnerCtaTitle}>Partner Center</div>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

