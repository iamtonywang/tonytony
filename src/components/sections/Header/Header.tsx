import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Global navigation">
        <a href="#" className={styles.link}>
          Our Work
        </a>
        <a href="#" className={styles.link}>
          WHY?
        </a>
        <a href="#" className={styles.link}>
          Product
        </a>
        <a href="#" className={styles.link}>
          Login
        </a>
      </nav>
    </header>
  );
}
