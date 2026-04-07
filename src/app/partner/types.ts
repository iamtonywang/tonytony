export type PartnerPageSummary = {
	partnerStatus: string | null;
	hasBankAccount: boolean;
	loginId: string | null;
	realName: string | null;
	phone: string | null;
	email: string | null;
	partnerCode: string | null;
	todaySalesAmount: {
		gross: number | null;
		commission: number | null;
		point: number | null;
	};
	monthSalesAmount: {
		gross: number | null;
		commission: number | null;
		point: number | null;
	};
	waitingSettlementAmount: {
		commission: number | null;
	};
	availableSettlementAmount: {
		commission: number | null;
	};
	productSalesSummary: Array<{
		productLabel: string | null;
		quantity: number | null;
		gross: number | null;
		commission: number | null;
	}> | null;
};

export type PartnerTab = "summary" | "settlementRequests" | "settlementHistory" | "bankAccount" | "pointLogs";

