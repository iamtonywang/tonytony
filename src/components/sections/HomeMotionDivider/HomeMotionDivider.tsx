import styles from "./HomeMotionDivider.module.css";

export default function HomeMotionDivider() {
  return (
    <section className={styles.dividerSection}>
      <div className={styles.motionLine} aria-hidden="true" />

      <div className={styles.editorialWrap}>
        <div className={styles.editorialTopGrid}>
          <div className={styles.topColHeadline}>
            <h2 className={styles.editorialHeadline}>Why now?</h2>
          </div>

          <div className={styles.topColBody}>
            <div className={styles.editorialIntro}>
              <p className={styles.tonyName}>TONY WANG</p>
              <p>I wanted to prove</p>
              <p>that what I created exists beyond time.</p>
              <p>Biotechnology and cosmetic science belong to completely different worlds.</p>
              <p>Biotechnology is the science of creation.</p>
              <p>Cosmetic science is the technology of formulation.</p>
              <p>Plant cell genetic protein is not a trend.</p>
              <p>It is a new biological structure.</p>
            </div>
          </div>

          <div className={styles.topColYears}>
            <div className={styles.yearsBlock}>
              <div className={styles.yearText}>
                28<br />
                years
              </div>
              <div className={styles.yearCopy}>
                <p>28년 시간 신의 물질만 연구 개발 했다</p>
                <p>For 28 years,</p>
                <p>we have researched only one thing.</p>
                <p>The reconstruction</p>
                <p>of damaged skin biology.</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.editorialRule} aria-hidden="true" />

        <div className={styles.editorialBottomGrid}>
          <div className={styles.bottomColWhy}>
            <div className={styles.whyText}>WHY?</div>
          </div>

          <div className={styles.bottomColCopy}>
            <div className={styles.whyCopy}>
              <p>
                The reason we developed SKIN CARE was during the process of{" "}
                <span className={styles.highlight19Orange}>atopic drug clinical trials</span>.
              </p>
              <p>We discovered an entirely different biological mechanism.</p>
              <p>And then I realized something.</p>
              <p>Skin care can also change the world.</p>
            </div>
          </div>

          <div className={styles.bottomColQuote}>
            <div className={styles.quoteBlock}>
              <span className={styles.quoteMark}>&ldquo;</span>
              <p className={styles.benjaminText}>The Curious Case of Benjamin Button</p>
              <div className={styles.quoteLine} aria-hidden="true" />
              <p>Not imagination.</p>
              <p>Reality.</p>
              <span className={styles.quoteMarkEnd}>&rdquo;</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomMotionLine} aria-hidden="true" />
    </section>
  );
}
