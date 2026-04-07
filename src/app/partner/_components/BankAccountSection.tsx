"use client";

import { useEffect, useRef, useState } from "react";

type BankAccountItem = {
	hasBankAccount: boolean;
	bankName: string | null;
	accountNumberMasked: string | null;
	accountHolder: string | null;
	accountStatus: string | null;
};

export default function BankAccountSection() {
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [item, setItem] = useState<BankAccountItem | null>(null);
	// 탭 진입 후 마운트 시 최초 1회만 요청하도록 중복 호출을 막는다.
	const hasFetchedRef = useRef(false);

	useEffect(() => {
		// 최초 1회만 fetch
		if (hasFetchedRef.current) return;
		hasFetchedRef.current = true;

		const fetchBankAccount = async () => {
			try {
				const response = await fetch("/api/partner/bank-account", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					cache: "no-store",
				});
				const payload = (await response.json()) as {
					ok?: boolean;
					item?: BankAccountItem | null;
					message?: string | null;
				};

				if (response.ok && payload?.ok) {
					setItem(payload.item ?? null);
					setErrorMessage(null);
					return;
				}

				setItem(null);
				setErrorMessage(payload?.message ?? "계좌 정보를 불러오지 못했습니다.");
			} catch {
				setItem(null);
				setErrorMessage("계좌 정보 요청 중 오류가 발생했습니다.");
			} finally {
				setLoading(false);
			}
		};

		void fetchBankAccount();
	}, []);

	if (loading) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>정산 계좌</h2>
				<p style={{ margin: 0 }}>계좌 정보를 불러오는 중...</p>
			</section>
		);
	}

	if (errorMessage) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>정산 계좌</h2>
				<p style={{ margin: 0 }}>{errorMessage}</p>
			</section>
		);
	}

	if (item === null) {
		return (
			<section>
				<h2 style={{ marginBottom: 8 }}>정산 계좌</h2>
				<p style={{ margin: 0 }}>계좌 정보가 없습니다.</p>
			</section>
		);
	}

	const isRegistered = item.hasBankAccount;

	return (
		<section>
			<h2 style={{ marginBottom: 8 }}>정산 계좌</h2>
			<article style={{ border: "1px solid #ddd", padding: 8 }}>
				<p style={{ margin: "0 0 4px 0" }}>계좌상태: {isRegistered ? "계좌 등록됨" : "계좌 미등록"}</p>
				<p style={{ margin: "0 0 4px 0" }}>은행명: {isRegistered ? (item.bankName ?? "-") : "-"}</p>
				<p style={{ margin: "0 0 4px 0" }}>계좌번호: {isRegistered ? (item.accountNumberMasked ?? "-") : "-"}</p>
				<p style={{ margin: "0 0 4px 0" }}>예금주: {isRegistered ? (item.accountHolder ?? "-") : "-"}</p>
				<p style={{ margin: 0 }}>검증상태: {isRegistered ? (item.accountStatus ?? "-") : "-"}</p>
			</article>
		</section>
	);
}

