"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MainContentSection.module.css";

export default function MainContentSection() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          setAnimKey((prevKey) => prevKey + 1);
        } else {
          setVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    if (overlayRef.current) {
      observer.observe(overlayRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.ourWorkGlowLine} aria-hidden="true" />

      <div className={styles.ourWorkSeoIntro}>
        <h1 className={styles.ourWorkSeoTitle}>TONYWANG</h1>
        <p className={styles.ourWorkSeoLine}>Research Development Plant Cell Gene Protein</p>
        <p className={styles.ourWorkSeoLine}>Molecular Bio-Bioengineering for skin recovery and regeneration</p>
        <p className={styles.ourWorkSeoLine}>Our Work is built on proof, precision, and uncompromising development.</p>
      </div>

      <div className={styles.ourWorkGlowLine} aria-hidden="true" />

      <div className={styles.ourWorkVisualBlock}>
        <div className={styles.ourWorkVisualMedia}>
          <img
            className={styles.ourWorkVisualImage}
            src="/landing-assets/hero-main-pc.webp"
            alt="TONYWANG our work visual"
            draggable={false}
          />
          <div className={styles.ourWorkGradientOverlay} aria-hidden="true" />
          <div
            ref={overlayRef}
            className={`${styles.ourWorkTextOverlay} ${visible ? styles.ourWorkTextOverlayVisible : ""}`}
            aria-hidden="true"
          >
            <div key={animKey} className={styles.ourWorkTextInner} />
          </div>
        </div>
      </div>

      <div className={styles.ourWorkGlowLine} aria-hidden="true" />

      <div className={styles.ourWorkBottomCopy} />

      <div className={styles.ourWorkGlowLine} aria-hidden="true" />
    </section>
  );
}
