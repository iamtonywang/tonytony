import styles from "./TextSection.module.css";

export default function TextSection() {
  return (
    <section className={styles.textSection}>
      <div className={styles.sectionSeparator} aria-hidden="true" />
      <div className={styles.seoBlock}>
        <h1 className={styles.brandTitle}>TONYWANG</h1>
        <p className={styles.subLine}>plant cell genetic protein</p>
        <p className={styles.subLine}>Institute Bio-Bioengineering</p>
        <h2 className={styles.korTitle}>식물세포유전자단백질</h2>
        <p className={styles.korSubLine}>바이오생명공학연구소</p>
        <p className={styles.enStatement}>My job is to develop a plant cell gene protein</p>
      </div>
      <div className={styles.statementGlowLine} aria-hidden="true" />
      <div className={styles.statementVisualBlock}>
        <div className={styles.statementVisualMedia}>
          <img
            className={styles.statementVisualImage}
            src="/landing-assets/hero-main-pc.webp"
            alt="TONYWANG plant cell genetic protein visual"
          />
          <div className={styles.statementGradientOverlay} aria-hidden="true" />
          <div className={styles.statementTextOverlay} aria-hidden="true">
            <div className={styles.statementTextInner}>
              <div className={styles.textLine + " " + styles.textHero}>HEY</div>
              <div className={styles.textLine}>나는 이렇게 나를 정리해 망설이는 시간은 멍청하고 아까워</div>
              <div className={styles.textLine}>그냥 아무 생각 하지마</div>
              <div className={styles.textLine}>그래야 머리가 비워지고 새로운 것을 담을 수 있어</div>
              <div className={styles.textLine}>내가 스킨케어를 연구하고 개발한다는 것은 상상도 하지 않았어</div>
              <div className={styles.textLine}>바이오와 향장학은 분야가 너무 달라</div>
              <div className={styles.textLine}>하찮다고 생각했어 지금도 같은 생각이야</div>
              <div className={styles.textLine}>쓰레기 보다 못한 스킨케어 를 부숴버리고 싶어</div>
              <div className={styles.textLine + " " + styles.textOrangePrimary}>I don't like lying</div>
              <div className={styles.textLine}>나는 거짓이 싫다</div>
              <div className={styles.textLine}>원하는 것을 이루기 위해서는 미쳐야 한다</div>
              <div className={styles.textLine + " " + styles.textOrangeSecondary}>창조란?</div>
              <div className={styles.textLine}>미쳐야 가질 수 있고 세상에 없는것을 만드는것이야</div>
              <div className={styles.textLine}>피부에 관한 모든 퍼즐을 풀고자 세상에 나왔다</div>
              <div className={styles.textLine}>스킨케어로도 세상을 뒤집어 놓을수있다는 것을 보여줄려고 해</div>
              <div className={styles.textLine + " " + styles.textSectionTitle}>식물 세포 유전자 단백질</div>
              <div className={styles.textLine}>세균이 지배하는 피부에 세균를 지휘하는 마에스트로</div>
              <div className={styles.textLine}>새로운 피부 조직을 변혁 시키는 유일한 유전자 단백질</div>
              <div className={styles.textLine}>나에게 가장 큰 힘은 입증이다 그것이 나에게 있다</div>
              <div className={styles.textLine}>바이오는 입증으로 모든 걸 증명하는 것이다</div>
              <div className={styles.textLine}>Since 2025 August TONYWANG</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
