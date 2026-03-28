"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

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
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="header-menu-row"
            onClick={handleMenuToggle}
          >
            <span className={styles.menuIcon} />
          </button>
        </div>
        <div
          id="header-menu-row"
          className={`${styles.menuRow} ${isMenuOpen ? styles.menuRowOpen : ""}`}
        >
          <Link href="/ourwork" className={styles.link} onClick={handleMenuClose}>
            Our Work
          </Link>
          <Link href="/why" className={styles.link} onClick={handleMenuClose}>
            WHY?
          </Link>
          <Link href="/products" className={styles.link} onClick={handleMenuClose}>
            Product
          </Link>
          <Link href="/login" className={styles.link} onClick={handleMenuClose}>
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
