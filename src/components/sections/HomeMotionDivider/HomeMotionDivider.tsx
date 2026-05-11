import styles from "./HomeMotionDivider.module.css";

export default function HomeMotionDivider() {
  return (
    <section className={styles.dividerSection}>
      <div className={styles.motionLine} aria-hidden="true" />

      <div className={styles.dividerCopy}>
        <h2 className={styles.whyNow}>Why now?</h2>

        <p>최초라는 것을 증명 하고자 나왔어</p>
        <p>
          <span className={styles.tonyName}>TONY WANG</span>
        </p>
        <p>내가 연구한거 그리고 만든것이</p>
        <p>과거와 현재시간에서 절대적 존재 인것을 증명하고 싶어</p>
        <p>생명공학 과 향장학 세계관은 너무 달라</p>
        <p>
          <span className={styles.pcOnly}>생명공학 연구 개발 은 향장학 배합 기술과 시스템 자체가 달라</span>

          <span className={styles.mobileOnly}>
            생명공학 연구 개발 은 향장학 배합 기술과 <br />
            시스템 자체가 달라
          </span>
        </p>

        <p>
          <span className={styles.pcOnly}>바이오 생명공학은 신약 연구 분야고 향장학은 배합의 기술이야</span>

          <span className={styles.mobileOnly}>
            바이오 생명공학은 신약 연구 분야고 <br />
            향장학은 배합의 기술이야
          </span>
        </p>
        <p>바이오 생명공학 은 창조의 세계관 이야</p>

        <p>
          <span className={styles.yearText}>28 years</span>
        </p>
        <p>28년 시간 신약 물질만 연구 개발 했다</p>
        <p>
          <span className={styles.whyText}>WHY?</span>
        </p>
        <p>
          <span className={styles.pcOnly}>
            SKIN CARE를 연구 개발한 이유는{" "}
            <span className={styles.highlight19Orange}>아토피 신약 임상</span>을 하는 과정에서
          </span>

          <span className={styles.mobileOnly}>
            SKIN CARE를 연구 개발한 이유는 <br />
            <span className={styles.highlight19Orange}>아토피 신약 임상</span>을 하는 과정에서
          </span>
        </p>

        <p>
          <span className={styles.pcOnly}>새로운 기전을 발견 하였고 임상 과정에서 놀라운 사실을 목격 했어</span>

          <span className={styles.mobileOnly}>
            새로운 기전을 발견 하였고 임상 과정에서 <br />
            놀라운 사실을 목격 했어
          </span>
        </p>

        <p>그리고 . . . . . .</p>
        <p>나는 생각했고 결심했어</p>
        <p>
          <span className={styles.pcOnly}>스킨케어로도 세상을 뒤집어 놓을수있다는 것을 깨달게 되었어</span>

          <span className={styles.mobileOnly}>
            스킨케어로도 세상을 뒤집어 놓을수있다는 것을 <br />
            깨달게 되었어
          </span>
        </p>
        <p>
          <span className={styles.benjaminText}>The Curious Case of Benjamin Button</span>
        </p>
        <p>상상이 아닌 현실로 . . . . .</p>

        <div className={styles.bottomMotionLine} aria-hidden="true" />
      </div>
    </section>
  );
}
