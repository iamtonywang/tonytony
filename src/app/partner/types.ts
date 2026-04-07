export type PartnerPageSummary = {
	partnerStatus: string | null;
	todaySalesAmount: number | null;
	monthSalesAmount: number | null;
	availableSettlementAmount: number | null;
	hasBankAccount: boolean;
	loginId: string | null;
	realName: string | null;
	phone: string | null;
	email: string | null;
};

export type PartnerTab = "summary" | "settlementRequests" | "settlementHistory" | "bankAccount" | "pointLogs";

