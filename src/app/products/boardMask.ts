/** 목록 한 줄에서 비밀글 작성자 표시용 마스킹 (로그인 id 앞부분 + ***). */
export function maskBoardAuthor(author: string): string {
  const t = author.trim() || "User";
  if (t.length <= 1) return `${t}***`;
  return `${t.slice(0, Math.min(4, t.length))}***`;
}

/** 목록 행 좌측 작성자: 앞 3자 + *** (비밀/일반 동일, 짧은 id는 ·로 폭 맞춤). */
export function formatBoardRowAuthor(author: string | undefined): string {
  const login = (author ?? "User").replace(/\*+$/, "").trim() || "User";
  return login.slice(0, 3).padEnd(3, "·") + "***";
}
