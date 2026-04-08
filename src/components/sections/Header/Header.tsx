"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";

type HeaderProps = {
  authenticated: boolean;
  loginId: string | null;
  isPartner: boolean;
};

export default function Header({ authenticated, loginId, isPartner }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/");
        router.refresh();
        return;
      }
    } finally {
      setIsLoggingOut(false);
    }
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
          {!authenticated ? (
            <Link href="/login" className={styles.link} onClick={handleMenuClose}>
              Login
            </Link>
          ) : (
            <>
              <span className={styles.link}>{loginId ?? "로그인중"}</span>
              <Link href="/mypage" className={styles.link} onClick={handleMenuClose}>
                My Page
              </Link>
              {isPartner ? (
                <Link href="/partner" className={styles.link} onClick={handleMenuClose}>
                  Partner
                </Link>
              ) : null}
              <button type="button" className={styles.link} onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? "로그아웃중" : "Logout"}
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
