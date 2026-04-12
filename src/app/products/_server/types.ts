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

/** Product detail board row (inquiries + reviews merged on server). */
export type ProductBoardItem = {
  id: string;
  author: string;
  preview: string;
  type: "Inquiry" | "Review";
  date: string;
  content: string;
  isPrivate: boolean;
};

