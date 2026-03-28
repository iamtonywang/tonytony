import Link from "next/link";
import styles from "./ProductListSection.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

interface ProductListSectionProps {
  items: ProductMinimal[];
}

export default function ProductListSection({ items }: ProductListSectionProps) {
  return (
    <div className={styles.textList}>
      <ul className={styles.ul}>
        {items.map((item) => {
          const key = item.slug ?? Math.random().toString(36);
          if (!item.slug) return null;
          return (
            <li key={key} className={styles.li}>
              <Link href={`/products/${item.slug}`} className={styles.textLink}>
                {item.productName ?? ""}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
