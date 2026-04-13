import 'server-only';

export type ProductMinimal = {
  slug: string | null;
  productName: string | null;
  shortDescription: string | null;
  heroImageUrl: string | null;
  finalPriceAmount: number | null;
  productStatus: string | null;
  isVisible: boolean | null;
};

export type ProductSharedRow = {
  id: number;
  slug: string | null;
  product_name: string | null;
  short_description: string | null;
  product_status: string | null;
  is_visible: boolean | null;
};

/** Product detail board row (inquiries + reviews merged on server). */
export type ProductBoardItem = {
  id: string;
  author: string;
  /** `users.id` of the post author; for permission checks on the client. */
  authorUserId: number;
  preview: string;
  type: "Inquiry" | "Review";
  date: string;
  content: string;
  answerContent?: string | null;
  isPrivate: boolean;
  /** 비밀글이 아니거나, 현재 세션이 작성자 본인·활성 관리자일 때만 전문 표시. */
  canViewFullContent: boolean;
};

