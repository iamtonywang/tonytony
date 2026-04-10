export type MyPageSummary = {
	loginId: string | null;
	realName: string | null;
	phone: string | null;
	email: string | null;
	isPartner: boolean;
};

export type MyPageTab = "profile" | "orders" | "refunds" | "partner";

