import styles from "./MainContentSection.module.css";

export default function MainContentSection() {
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
          <div className={styles.whyTextOverlay}>
            <div className={styles.whyTypographyWrap}>
              <div className={styles.whyBrand}>TONYWANG</div>

              <div className={styles.whyHeadline} aria-label="WHY?">
                <span className={`${styles.whyHeadlineStep} ${styles.step1}`}>W</span>
                <span className={`${styles.whyHeadlineStep} ${styles.step2}`}>WH</span>
                <span className={`${styles.whyHeadlineStep} ${styles.step3}`}>WHY</span>
                <span className={`${styles.whyHeadlineStep} ${styles.step4}`}>WHY?</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.whyGlowLine} aria-hidden="true" />
    </section>
  );
}
