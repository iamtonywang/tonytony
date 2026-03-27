import type { ReactNode } from "react";

interface ProductDetailViewProps {
  children: ReactNode;
}

export default function ProductDetailView({ children }: ProductDetailViewProps) {
  return <main>{children}</main>;
}