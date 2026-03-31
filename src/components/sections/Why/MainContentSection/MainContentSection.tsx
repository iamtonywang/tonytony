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
      { threshold: 0.3 }
    );

    if (overlayRef.current) {
      observer.observe(overlayRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.whyGlowLine} aria-hidden="true" />

      <div className={styles.whySeoIntro}>
        <h1 className={styles.whySeoTitle}>TONYWANG</h1>
        <p className={styles.whySeoLine}>Research Development Plant Cell Gene Protein</p>
        <p className={styles.whySeoLine}>Molecular Bio-Bioengineering for verified skin innovation</p>
        <p className={styles.whySeoLine}>WHY asks one question: what is truly proven and truly valuable?</p>
      </div>

      <div className={styles.whyGlowLine} aria-hidden="true" />

      <div className={styles.whyVisualBlock}>
        <div className={styles.whyVisualMedia}>
          <img
            className={styles.whyVisualImage}
            src="/landing-assets/hero-main-pc.webp"
            alt="TONYWANG why visual"
            draggable={false}
          />
          <div className={styles.whyGradientOverlay} aria-hidden="true" />
          <div
            ref={overlayRef}
            className={`${styles.whyTextOverlay} ${visible ? styles.whyTextOverlayVisible : ""}`}
            aria-hidden="true"
          >
            <div key={animKey} className={styles.whyTextInner}>
              <div className={styles.whyOverlayLine}>WHY</div>
              <div className={styles.whyOverlayLine}>TONYWANG PLANT CELL GENE PROTEIN</div>
              <div className={styles.whyOverlayLine}>Proof is the first principle</div>
              <div className={styles.whyOverlayLine}>Value must be measurable</div>
              <div className={styles.whyOverlayLine}>False trends are not science</div>
              <div className={styles.whyOverlayLine}>Biology needs verified answers</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.whyGlowLine} aria-hidden="true" />
    </section>
  );
}
