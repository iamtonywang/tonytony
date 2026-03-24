import Link from "next/link";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <>
      <section className={styles.heroSection}>
        <div className={styles.heroVisual}>
          <div className={styles.videoArea} />
          <div className={styles.heroOverlay}>
            <h1>TONYWANG SCIENCE</h1>
            <p>Science-backed wellness for modern living.</p>
            <Link href="/products" className={styles.cta}>
              Explore Product
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.textSection}>
        <p>Landing message placeholder for the first fold narrative.</p>
      </section>

      <section className={styles.visualSection}>
        <div className={styles.visualArea}>
          <div className={styles.visualOverlay}>
            <p>Second visual copy placeholder.</p>
          </div>
        </div>
      </section>
    </>
  );
}
