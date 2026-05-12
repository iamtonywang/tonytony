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
              <p>내가 연구한거 그리고 만든것이</p>
              <p>과거와 현재사이에서 절대적 존재 임을 증명하고 싶어</p>
              <p>생명공학 과 향장학 세계관은 너무 달라</p>
              <p>생명공학 연구 개발 은 향장학 배합 기술과 시스템 자체가 달라</p>
              <p>바이오 생명공학은 신약 연구 분야고 향장학은 배합의 기술이야</p>
              <p>바이오 생명공학 은 창조의 세계관 이야</p>
            </div>
          </div>

          <div className={styles.topColYears}>
            <div className={styles.yearsBlock}>
              <div className={styles.yearText}>
                28<br />
                years
              </div>
              <div className={styles.yearCopy}>
                <p>28년 시간 신약 물질만 연구 개발 했다</p>
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
                SKIN CARE를 연구 개발한 이유는{" "}
                <span className={styles.highlight19Orange}>아토피 신약 임상</span>을 하는 과정에서
              </p>
              <p>새로운 기전을 발견 하였고 임상 과정에서 놀라운 사실을 목격 했어</p>
              <p>그리고 . . . . . .</p>
              <p>나는 생각했고 결심했어</p>
              <p>스킨케어로도 세상을 뒤집어 놓을수있다는 것을 깨달게 되었어</p>
            </div>
          </div>

          <div className={styles.bottomColQuote}>
            <div className={styles.quoteBlock}>
              <span className={styles.quoteMark}>&ldquo;</span>
              <p className={styles.benjaminText}>The Curious Case of Benjamin Button</p>
              <div className={styles.quoteLine} aria-hidden="true" />
              <p>상상이 아닌 현실로 . . . . .</p>
              <span className={styles.quoteMarkEnd}>&rdquo;</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomMotionLine} aria-hidden="true" />
    </section>
  );
}
