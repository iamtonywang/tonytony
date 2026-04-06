import type { ProductMinimal } from "@/app/products/_server/types";

type Props = {
  product: ProductMinimal;
};

export default function ProductSummarySection({ product }: Props) {
  return (
    <section>
      <h1>{product.productName ?? "Product"}</h1>
      {product.heroImageUrl ? <img src={product.heroImageUrl} alt={product.productName ?? "product"} /> : null}
      <p>{product.shortDescription ?? ""}</p>
      {typeof product.finalPriceAmount === "number" ? <p>Price: {product.finalPriceAmount.toLocaleString()}</p> : null}
    </section>
  );
}

