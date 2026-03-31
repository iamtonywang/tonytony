 "use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./ProductListSection.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

interface ProductListSectionProps {
  items: ProductMinimal[];
}

export default function ProductListSection({ items }: ProductListSectionProps) {
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
    <section
      className={styles.productFlowSection}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className={styles.productSeoIntro} draggable={false}>
        <h1 className={styles.productSeoTitle}>TONYWANG</h1>
        <p className={styles.productSeoLine}>Research Development Plant Cell Gene Protein</p>
        <p className={styles.productSeoLine}>Molecular Bio-Bioengineering for skin recovery and regeneration</p>
        <p className={styles.productSeoLine}>I want to tell you the true value, not the product</p>
      </div>

      <div className={styles.productGlowLine} aria-hidden="true" />

      <div className={styles.productVisualBlock}>
        <div className={styles.productVisualMedia}>
          <img
            className={styles.productVisualImage}
            src="/landing-assets/hero-main-pc.webp"
            alt="TONYWANG product visual"
            draggable={false}
          />
          <div
            ref={overlayRef}
            className={`${styles.productTextOverlay} ${visible ? styles.productTextOverlayVisible : ""}`}
            draggable={false}
          >
            <div className={styles.productOverlayCopy}>
              <p>TONYWANG</p>
              <p>worthless person</p>
              <p>person who doesn't love himself</p>
              <p>person who turns a blind eye to the truth</p>
              <p>person who doesn't care about himself</p>
              <p>Please get out of here.</p>
            </div>
            <div className={styles.productOverlayDivider} aria-hidden="true" />
            <ul key={animKey} className={styles.productOverlayList} draggable={false}>
              {items.map((item) => {
                const key = item.slug ?? Math.random().toString(36);
                if (!item.slug) return null;
                return (
                  <li key={key} className={styles.productOverlayItem}>
                    <Link href={`/products/${item.slug}`} className={styles.productOverlayLink}>
                      {item.productName ?? ""}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.productGlowLine} aria-hidden="true" />

      <div className={styles.productBottomCopy} draggable={false}>
        <p className={styles.productBottomTitle}>TONYWANG</p>
        <p className={styles.productBottomSubTitle}>Plant Cell Gene Protein Product Portfolio</p>
        <p className={styles.productBottomLine}>
          Every listed product is arranged with the same scientific intent: precise signaling, recovery, and ECM
          reconstruction.
        </p>
        <p className={styles.productBottomLine}>
          Select a product to view its dedicated research context, formula direction, and the proof-driven value behind it.
        </p>
      </div>

      <div className={styles.productGlowLine} aria-hidden="true" />
    </section>
  );
}
