/** Client-safe public board row (no authorUserId / auth identifiers). */
export type PublicProductBoardItem = {
  id: string;
  author: string;
  preview: string;
  type: "Inquiry" | "Review";
  date: string;
  content: string;
  answerContent?: string | null;
  isPrivate: boolean;
  canViewFullContent: boolean;
};
