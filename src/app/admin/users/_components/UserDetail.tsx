/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";

type DetailItem = {
	loginId: string;
	realName: string | null;
	phone: string;
	email: string | null;
	userStatus: string;
	createdAt: string;
	lastLoginAt: string | null;
	zipcode: string | null;
	address1: string | null;
	address2: string | null;
	orderCount: number;
	refundCount: number;
};

type Props = {
	loginId: string | null;
};

export default function UserDetail({ loginId }: Props) {
	const [item, setItem] = useState<DetailItem | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!loginId) {
			setItem(null);
			setError(null);
			return;
		}
		const run = async () => {
			setLoading(true);
			setError(null);
			const res = await fetch(`/api/admin/users/detail/${encodeURIComponent(loginId)}`, { cache: "no-store" });
			const data = (await res.json()) as { ok?: boolean; item?: DetailItem | null; message?: string | null };
			if (!res.ok || !data.ok || !data.item) {
				setItem(null);
				setError(data.message ?? "상세를 불러오지 못했습니다.");
				setLoading(false);
				return;
			}
			setItem(data.item);
			setLoading(false);
		};
		void run();
	}, [loginId]);

	if (!loginId) {
		return (
			<section style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12 }}>
				<h2 style={{ marginBottom: 8 }}>회원 상세</h2>
				<p style={{ margin: 0, opacity: 0.7 }}>목록에서 login_id를 선택하세요.</p>
			</section>
		);
	}

	return (
		<section style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12 }}>
			<h2 style={{ marginBottom: 8 }}>회원 상세</h2>
			{loading ? <p style={{ margin: 0, opacity: 0.8 }}>불러오는 중…</p> : null}
			{error && !loading ? <p style={{ margin: 0, color: "salmon" }}>{error}</p> : null}
			{item && !loading ? (
				<div style={{ display: "grid", gap: 6, fontSize: 14 }}>
					<div>
						<strong>login_id</strong> {item.loginId}
					</div>
					<div>
						<strong>본명</strong> {item.realName ?? "—"}
					</div>
					<div>
						<strong>연락처</strong> {item.phone}
					</div>
					<div>
						<strong>이메일</strong> {item.email ?? "—"}
					</div>
					<div>
						<strong>상태</strong> {item.userStatus}
					</div>
					<div>
						<strong>가입일</strong> {item.createdAt}
					</div>
					<div>
						<strong>최근 로그인</strong> {item.lastLoginAt ?? "—"}
					</div>
					<div>
						<strong>우편번호</strong> {item.zipcode ?? "—"}
					</div>
					<div>
						<strong>주소1</strong> {item.address1 ?? "—"}
					</div>
					<div>
						<strong>주소2</strong> {item.address2 ?? "—"}
					</div>
					<div>
						<strong>주문 수</strong> {item.orderCount}
					</div>
					<div>
						<strong>환불 건수</strong> {item.refundCount}
					</div>
				</div>
			) : null}
		</section>
	);
}
