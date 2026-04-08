import { redirect } from "next/navigation";

import type { ReactNode } from "react";
import { getAdminSession } from "./_server/getAdminSession";

export default async function AdminLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	// 상위 1회 관리자 권한 체크
	const session = await getAdminSession();
	if (!session.authenticated || !session.isAdmin) {
		// 권한 없으면 안전한 경로로 redirect
		redirect("/");
	}

	// 가벼운 프레임만 유지 (무거운 공용 네비/프리로드 금지)
	return (
		<section style={{ maxWidth: 1080, margin: "24px auto", padding: "0 16px" }}>
			{children}
		</section>
	);
}

