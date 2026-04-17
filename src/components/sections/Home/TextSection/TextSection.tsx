import styles from "./TextSection.module.css";

export default function TextSection() {
  return (
    <section
      className={styles.textSection}
    >
      <div className={styles.sectionSeparator} aria-hidden="true" />
      <div className={styles.seoBlock} draggable={false}>
        <h1 className={styles.brandTitle}>TONYWANG</h1>
        <p className={styles.subLine}>plant cell genetic protein</p>
        <p className={styles.subLine}>Institute Bio-Bioengineering</p>
        <h2 className={styles.korTitle}>식물세포유전자단백질</h2>
        <p className={styles.korSubLine}>바이오생명공학연구소</p>
        <p className={styles.enStatement}>My job is to develop a plant cell gene protein</p>
      </div>
      <div className={styles.statementGlowLine} aria-hidden="true" />
      <div className={styles.statementVisualBlock}>
        <div className={styles.typoBlock}>
          <p className={styles.typoPrimary}>TONYWANG</p>
          <div className={styles.typoSecondaryBlock}>
            <p className={styles.typoSecondary}><span className={styles.typoEmphasis25}>난잡한 화장품</span>이나 만드는 회사가 아니다</p>
            <p className={styles.typoSecondary}><span className={styles.typoEmphasis25}>28년 동안</span> 오직 식물세포유전자 단백질<br className={styles.mobileBr} /> 한 분야만 연구한 생명 과학 연구소</p>
            <p className={styles.typoSecondary}>모든 연구는 단 하나 <span className={styles.typoEmphasisOrange}>식물세포유전자단백질</span><br className={styles.mobileBr} /> 개발이다</p>
            <p className={`${styles.typoSecondary} ${styles.typoSecondaryLead}`}><span className={styles.typoEmphasisOrange20}>노화</span> 방지 단백질</p>
            <p className={styles.typoSecondary}><span className={styles.typoEmphasis20}>난치성</span> 피부질환 치료 단백질</p>
            <p className={styles.typoSecondary}>염증 유발 인자 <span className={styles.typoEmphasis20}>악성 균</span> 치료 단백질</p>
            <p className={styles.typoSecondary}><span className={styles.typoEmphasisOrange20}>피부 독소</span> 정화 치료 단백질</p>
            <p className={styles.typoSecondary}>긴 시간 동안 이 분야에 매진한 이유는 명확하다</p>
            <p className={styles.typoSecondary}>인체를 위협하는 <span className={styles.typoEmphasis20}>난치성 질환</span>을 근본적으로 치료하고, <span className={styles.typoEmphasisOrange20}>손상된 피부</span>를 복원하는 단백질 연구 개발</p>
          </div>
        </div>
        <div className={styles.statementVisualMedia}>
        </div>
      </div>
      <div className={styles.statementBottomGlowLine} aria-hidden="true" />
      <div className={styles.statementBottomText} draggable={false}>
        <p className={styles.bottomTitle}>TONYWANG</p>
        <p className={styles.bottomSubTitle}>ProteoPhytoComplex</p>

        <p>ProteoPhyto Complex is a protein-peptide complex derived from plant cells independently developed by TONYWANG</p>

        <p className={styles.bottomTightBlock}>
          <span>It is a protein-peptide complex derived from plant cells that precisely regulates signal</span>
          <span>transmission of damaged skin to activate recovery and regeneration</span>
        </p>

        <p className={styles.bottomTightBlock}>
          <span>Interact with cell membrane receptors to stabilize signal flow,</span>
          <span>promote recovery and defense genes, and rebuild collagen and elastin-based ECM structures</span>
        </p>

        <p>Precisely regulate skin cell signaling, and activate ECM reconstruction and regenerative genes to build an integrated CARE from removing toxins, recovery, and trouble healing in the skin.</p>

        <p className={styles.bottomTightBlock}>
          <span>Substance definition: A group of signal transmission-like human-specific proteins</span>
          <span>that are responsible for growth and defense within plant cells and have high homology</span>
          <span>with human skin amino acid sequences (including peptides) by refining</span>
        </p>

        <p className={styles.bottomSignature}>TONYWANG</p>
      </div>
      <div className={styles.statementBottomEndGlowLine} aria-hidden="true" />
      <p className={styles.statementBottomClosing} draggable={false}>
        I will always sell the truth and the value By TONYWANG
      </p>
      <div className={styles.statementBottomGlowLine} aria-hidden="true" />
    </section>
  );
}
