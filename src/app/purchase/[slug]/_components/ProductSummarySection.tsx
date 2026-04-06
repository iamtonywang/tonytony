import type { ProductMinimal } from "@/app/products/_server/types";

type Props = {
  product: ProductMinimal;
  purchasableStatus?: {
    isPurchasable: boolean;
    reason: string | null;
  };
};

export default function ProductSummarySection({ product }: Props) {
  return (
    <section>
      <h1>{product.productName ?? "Product"}</h1>
      {product.heroImageUrl ? <img src={product.heroImageUrl} alt={product.productName ?? "product"} /> : null}
      <p>{product.shortDescription ?? ""}</p>
      {typeof product.finalPriceAmount === "number" ? <p>Price: {product.finalPriceAmount.toLocaleString()}</p> : null}
      {"purchasableStatus" in arguments[0] && arguments[0]?.purchasableStatus && arguments[0].purchasableStatus.isPurchasable === false ? (
        <p>현재 구매가 불가능한 상품입니다.</p>
      ) : null}
    </section>
  );
}

