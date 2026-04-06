import type { ProductMinimal } from "@/app/products/_server/types";
import styles from "./PurchasePageClient.module.css";

type Props = {
  product: ProductMinimal;
  purchasableStatus?: {
    isPurchasable: boolean;
    reason: string | null;
  };
  quantity: number;
  onQuantityChange: (value: number) => void;
};

export default function ProductSummarySection({ product, purchasableStatus, quantity, onQuantityChange }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{product.productName ?? "Product"}</h2>
      {product.heroImageUrl ? <img src={product.heroImageUrl} alt={product.productName ?? "product"} /> : null}
      <p className={styles.submitNote}>{product.shortDescription ?? ""}</p>
      {typeof product.finalPriceAmount === "number" ? <p className={styles.centeredText}>Price: {product.finalPriceAmount.toLocaleString()}</p> : null}
      <div className={styles.formRow}>
        <label className={styles.centeredText}>
          Quantity
          <input type="number" value={quantity} min={1} onChange={(e) => onQuantityChange(Number(e.target.value || 1))} />
        </label>
      </div>
      {purchasableStatus && purchasableStatus.isPurchasable === false ? (
        <p className={styles.submitNote}>현재 구매가 불가능한 상품입니다.</p>
      ) : null}
    </section>
  );
}

