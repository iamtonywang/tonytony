/**
 * KST(Asia/Seoul) 달력 날짜를 YYYY-MM-DD 문자열로 반환합니다.
 * 방문 visit_date 저장·집계와 동일한 기준으로 사용합니다.
 */
export function getKstDateString(now: Date = new Date()): string {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Seoul",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(now);

	const y = parts.find((p) => p.type === "year")?.value;
	const m = parts.find((p) => p.type === "month")?.value;
	const d = parts.find((p) => p.type === "day")?.value;
	if (!y || !m || !d) {
		throw new Error("kstDate: failed to format date");
	}
	return `${y}-${m}-${d}`;
}
