"use client";

import { useState } from "react";
import type { MyPageSummary, MyPageTab } from "../types";
import ProfileSection from "./ProfileSection";
import OrdersSection from "./OrdersSection";
import RefundsSection from "./RefundsSection";
import InquiriesSection from "./InquiriesSection";
import PartnerSection from "./PartnerSection";

type Props = {
	summary: MyPageSummary | null;
};

export default function MyPageShell({ summary }: Props) {
	const [activeTab, setActiveTab] = useState<MyPageTab>("profile");

	return (
		<div style={{ padding: 24 }}>
			<h1 style={{ marginBottom: 12 }}>마이페이지</h1>

			<nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
				<button onClick={() => setActiveTab("profile")}>프로필</button>
				<button onClick={() => setActiveTab("orders")}>주문</button>
				<button onClick={() => setActiveTab("refunds")}>환불</button>
				<button onClick={() => setActiveTab("inquiries")}>문의</button>
				<button onClick={() => setActiveTab("partner")}>파트너</button>
			</nav>

			{activeTab === "profile" ? <ProfileSection summary={summary} /> : null}
			{activeTab === "orders" ? <OrdersSection /> : null}
			{activeTab === "refunds" ? <RefundsSection /> : null}
			{activeTab === "inquiries" ? <InquiriesSection /> : null}
			{activeTab === "partner" ? <PartnerSection /> : null}
		</div>
	);
}

