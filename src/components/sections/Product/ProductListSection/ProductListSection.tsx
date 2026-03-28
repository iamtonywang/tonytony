import Link from "next/link";
import styles from "./ProductListSection.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

interface ProductListSectionProps {
  items: ProductMinimal[];
}

export default function ProductListSection({ items }: ProductListSectionProps) {
  return (
    <section className={styles.listSection}>
      <h2 className={styles.heading}>Product List</h2>
      <div className={styles.grid}>
        {items.map((item) => {
          const key = item.slug ?? Math.random().toString(36);
          return (
            <article key={key} className={styles.card}>
              <p className={styles.productName}>
                {item.productName ?? ""}
              </p>
              <p className={styles.productSlug}>
                {item.slug ? `slug: ${item.slug}` : ""}
              </p>
              {typeof item.finalPriceAmount === "number" ? (
                <p className={styles.productPrice}>₩ {item.finalPriceAmount.toLocaleString()}</p>
              ) : (
                <p className={styles.productPrice}></p>
              )}
              {item.heroImageUrl ? (
                <img
                  src={item.heroImageUrl}
                  alt=""
                  className={styles.productImage}
                />
              ) : null}
              {item.shortDescription ? (
                <p className={styles.productDesc}>{item.shortDescription}</p>
              ) : null}
              {item.slug ? (
                <Link href={`/products/${item.slug}`} className={styles.viewButton}>
                  View Product
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
