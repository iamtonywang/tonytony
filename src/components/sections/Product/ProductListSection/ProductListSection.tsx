import Link from "next/link";
import styles from "./ProductListSection.module.css";

const PRODUCT_ITEMS = [
  { name: "NIGAJUN 44", slug: "nigajun-44" },
  { name: "NIGAJUN 99", slug: "nigajun-99" },
  { name: "NIGAJUN 82", slug: "nigajun-82" },
  { name: "NIGAJUN 77", slug: "nigajun-77" },
  { name: "NIGAJUN 55", slug: "nigajun-55" },
  { name: "NIGAJUN 35", slug: "nigajun-35" },
  { name: "NIGAJUN 28", slug: "nigajun-28" },
  { name: "NIGAJUN 17", slug: "nigajun-17" },
];

export default function ProductListSection() {
  return (
    <section className={styles.listSection}>
      <h2 className={styles.heading}>Product List</h2>
      <div className={styles.grid}>
        {PRODUCT_ITEMS.map((item) => (
          <article key={item.slug} className={styles.card}>
            <p className={styles.productName}>{item.name}</p>
            <p className={styles.productSlug}>slug: {item.slug}</p>
            <Link href={`/products/${item.slug}`} className={styles.viewButton}>
              View Product
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
