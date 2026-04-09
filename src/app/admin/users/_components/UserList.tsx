/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";

type ListItem = {
	loginId: string;
	realName: string | null;
	phone: string;
	email: string | null;
	userStatus: string;
	createdAt: string;
};

type Props = {
	selectedLoginId: string | null;
	onSelectLoginId: (loginId: string) => void;
};

export default function UserList({ selectedLoginId, onSelectLoginId }: Props) {
	const [page, setPage] = useState(1);
	const [rows, setRows] = useState<ListItem[]>([]);
	const [hasNext, setHasNext] = useState(false);
	const [loading, setLoading] = useState(true);
	const hasFetchedRef = useRef(false);

	useEffect(() => {
		if (page === 1 && hasFetchedRef.current) return;
		if (page === 1) hasFetchedRef.current = true;

		const run = async () => {
			setLoading(true);
			const res = await fetch(`/api/admin/users/list?page=${page}`, { cache: "no-store" });
			if (!res.ok) {
				setRows([]);
				setHasNext(false);
				setLoading(false);
				return;
			}
			const data = (await res.json()) as { ok?: boolean; items?: ListItem[]; hasNext?: boolean };
			setRows(Array.isArray(data.items) ? data.items : []);
			setHasNext(Boolean(data.hasNext));
			setLoading(false);
		};
		void run();
	}, [page]);

	return (
		<section style={{ border: "1px solid rgba(255,255,255,0.25)", padding: 12 }}>
			<h2 style={{ marginBottom: 12 }}>회원 목록</h2>
			{loading ? (
				<p style={{ margin: 0, opacity: 0.8 }}>불러오는 중…</p>
			) : rows.length === 0 ? (
				<p style={{ margin: 0, opacity: 0.8 }}>회원이 없습니다.</p>
			) : (
				<div style={{ display: "grid", gap: 10 }}>
					{rows.map((r) => {
						const isSel = selectedLoginId === r.loginId;
						return (
							<button
								key={r.loginId}
								type="button"
								onClick={() => onSelectLoginId(r.loginId)}
								style={{
									textAlign: "left",
									border: isSel ? "1px solid rgba(255,255,255,0.55)" : "1px solid rgba(255,255,255,0.2)",
									background: isSel ? "rgba(255,255,255,0.06)" : "transparent",
									color: "inherit",
									padding: 10,
									borderRadius: 4,
									cursor: "pointer",
									font: "inherit",
								}}
							>
								<div style={{ fontWeight: 600 }}>{r.loginId}</div>
								<div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>
									{r.realName ?? "—"} · {r.phone} · {r.email ?? "—"}
								</div>
								<div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{r.userStatus}</div>
							</button>
						);
					})}
				</div>
			)}
			<div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
				<button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
					이전
				</button>
				<span style={{ opacity: 0.8 }}>page {page}</span>
				<button type="button" disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
					다음
				</button>
			</div>
		</section>
	);
}
