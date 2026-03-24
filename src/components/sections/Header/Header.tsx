import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Global navigation">
        <div className={styles.topRow}>
          <Link href="/" className={styles.brand}>
            TONYWANG
          </Link>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="Open navigation menu"
          >
            <span className={styles.menuIcon} />
          </button>
        </div>
        <div className={styles.menuRow}>
          <Link href="/ourwork" className={styles.link}>
            Our Work
          </Link>
          <Link href="/why" className={styles.link}>
            WHY?
          </Link>
          <Link href="/products" className={styles.link}>
            Product
          </Link>
          <Link href="/login" className={styles.link}>
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
