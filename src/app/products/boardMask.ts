/** 목록 한 줄에서 비밀글 작성자 표시용 마스킹 (로그인 id 앞부분 + ***). */
export function maskBoardAuthor(author: string): string {
  const t = author.trim() || "User";
  if (t.length <= 1) return `${t}***`;
  return `${t.slice(0, Math.min(4, t.length))}***`;
}
