import Link from "next/link";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>TONYWANG</h1>
      <p className={styles.subtitle}>Science-driven wellness for everyday life.</p>
      <Link href="/products" className={styles.cta}>
        Explore Product
      </Link>
    </section>
  );
}
