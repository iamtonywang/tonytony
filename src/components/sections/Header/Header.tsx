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

  const renderLoginId = () => {
    // 로그인 아이디는 5자리까지만 노출, 전체값은 title로만 유지
    const raw = loginId?.trim() ?? "";
    if (!raw) {
      return <span className={styles.link}>ACCOUNT</span>;
    }
    const visible = raw.length > 5 ? `@${raw.slice(0, 5)}…` : `@${raw}`;
    return (
      <span className={styles.link} title={raw}>
        {visible}
      </span>
    );
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        router.replace("/");
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
              <Link href="/mypage" className={styles.link} onClick={handleMenuClose}>
                My Page
              </Link>
              {isPartner ? (
                <Link href="/partner" className={styles.link} onClick={handleMenuClose}>
                  Partner
                </Link>
              ) : null}
              <button
                type="button"
                className={styles.link}
                onClick={handleLogout}
                disabled={isLoggingOut}
                // 버튼 기본 스타일 제거: 텍스트 링크처럼 보이도록 최소 reset
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                  font: "inherit",
                  color: "inherit",
                }}
              >
                {isLoggingOut ? "로그아웃중" : "Logout"}
              </button>
              {renderLoginId()}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
