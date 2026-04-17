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

              <div className={styles.whySubText}>
                <span className={styles.wordStrong}>충격적인</span> 계기가 있었어 그리고 그때 나는 생각했고 <span className={styles.wordStrong}>결심했어</span> 스킨케어로도 세상을 <span className={styles.wordMedium}>뒤집어</span> 놓을수있다는 것을
              </div>
              <div className={styles.whyPCode}>P-Code™</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.whyGlowLine} aria-hidden="true" />
    </section>
  );
}
