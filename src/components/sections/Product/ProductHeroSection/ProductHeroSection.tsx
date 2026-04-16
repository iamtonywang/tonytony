"use client";

import styles from "./ProductHeroSection.module.css";

const HERO_LINES = [
  "TONYWANG",
  "Research Development Plant Cell Gene Protein",
  "Molecular Bio-Bioengineering",
  "It only sells to those who truly love themselves",
  "If you don't love yourself, get out of here",
  "I want to tell you the true value, not the product",
  "I'm here to solve all the skin problems",
  "TONYWANG",
];

export default function ProductHeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroVisual}>
        <div className={styles.videoArea}>
          <div className={styles.backgroundLayer} />
          <div className={styles.videoOverlay} aria-hidden="true">
            <img
              src="/landing-assets/login-bg-main.webp"
              alt=""
              className={styles.overlayImage}
            />
          </div>
        </div>
        <div className={styles.heroOverlay}>
          <div className={styles.heroSequence} aria-hidden="true">
            <p className={styles.heroText}>{HERO_LINES[0]}</p>
          </div>
          <div className={styles.heroStaticBlock}>
            <div className={styles.heroStaticTitle}>TONYWANG</div>
            <div className={styles.heroSubLine}>plant cell genetic protein</div>
            <div className={styles.heroSubLine}>Institute Bio-Bioengineering</div>
            <div className={styles.heroSubLine}>식물세포유전자단백질</div>
            <div className={styles.heroSubLine}>바이오생명공학연구소</div>
            <div className={styles.heroSubLine}>My job is to develop a plant cell gene protein</div>
          </div>
        </div>
        <button type="button" className={styles.playButton} aria-label="Hero" />
      </div>
    </section>
  );
}
