"use client";

import styles from "./ProductListSection.module.css";

export default function ProductListSection() {
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
    </section>
  );
}
