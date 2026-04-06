import type { ProductMinimal } from "@/app/products/_server/types";
import styles from "./PurchasePageClient.module.css";

type Props = {
  product: ProductMinimal;
  purchasableStatus?: {
    isPurchasable: boolean;
    reason: string | null;
  };
};

export default function ProductSummarySection({ product, purchasableStatus }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{product.productName ?? "Product"}</h2>
      {product.heroImageUrl ? <img src={product.heroImageUrl} alt={product.productName ?? "product"} /> : null}
      {typeof product.finalPriceAmount === "number" ? <p className={styles.centeredText}>Price: {product.finalPriceAmount.toLocaleString()}</p> : null}
      {purchasableStatus && purchasableStatus.isPurchasable === false ? (
        <p className={styles.submitNote}>현재 구매가 불가능한 상품입니다.</p>
      ) : null}
    </section>
  );
}

