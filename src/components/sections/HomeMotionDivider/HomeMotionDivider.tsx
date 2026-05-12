import styles from "./HomeMotionDivider.module.css";

export default function HomeMotionDivider() {
  return (
    <section className={styles.dividerSection}>
      <div className={styles.motionLine} aria-hidden="true" />

      <div className={styles.dividerCopy}>
        <p className={styles.manifestoKicker}>WHY NOW?</p>

        <p className={`${styles.manifestoKr} ${styles.manifestoTightPc}`}>
          최초라는 것을 증명 할려고 나왔어
        </p>

        <p className={styles.manifestoKr}>
          <span className={styles.manifestoEnInline}>TONY WANG</span>{" "}
          내가 연구하고 그리고 개발한 것이 과거와 현재시간에서 절대적 존재 인것을 증명하고 싶어
        </p>

        <p className={styles.manifestoKr}>
          생명공학 과 향장학 분야는 접근하는 방법이 다르다 바이오 생명공학은 신약 연구 분야고 향장학은 배합의 기술이야
        </p>

        <p className={`${styles.manifestoKr} ${styles.manifestoTightPc}`}>
          바이오 생명공학 은 창조의 세계관 이다
        </p>

        <div className={styles.manifestoHairline} aria-hidden="true" />

        <p className={`${styles.manifestoYear} ${styles.manifestoTightPc}`}>
          28 years
        </p>

        <p className={styles.manifestoKr}>
          28년 시간 신약 물질만 연구 개발하던 내가{" "}
          <span className={styles.manifestoWhyInline}>WHY?</span> SKIN CARE를 연구 개발한 이유는
        </p>

        <p className={styles.manifestoKr}>
          아토피 신약 임상을 하는 과정에서 새로운 기전을 발견 하였고 임상 과정에서 놀라운 사실을 목격 했어
        </p>

        <p className={styles.manifestoKr}>그것을 목격한 후로 나는 생각했고 결심했어</p>

        <p className={styles.manifestoKr}>
          스킨케어로도 세상을 뒤집어 놓을수있다는 것을 깨달게 되었어
        </p>

        <p className={styles.manifestoBenjamin}>The Curious Case of Benjamin Button</p>

        <p className={styles.manifestoKr}>상상이 아닌 현실로 . . . . .할수 있다는 것을</p>

        <div className={styles.manifestoHairline} aria-hidden="true" />

        <p className={styles.manifestoGold}>Proteo Phyto Complex</p>

        <p className={styles.manifestoKr}>식물 세포 유전자 단백질 복합 성분 NIGAJUN</p>

        <p className={styles.manifestoKr}>
          글로벌 최초 식물 세포 유전자 단백질로 개발한 NIGAJUN 피부를 모조리 갈아 엎으러 나왔다
        </p>

        <p className={styles.manifestoEnLine}>
          I came to the world to solve all the puzzles about skin
        </p>

        <p className={styles.manifestoEnMeta}>
          stem cells, liposome, Exosome, growth factor, nanoparticles, peptide
        </p>

        <p className={styles.manifestoEnLine}>We don&apos;t use these false ingredients</p>

        <p className={styles.manifestoEnLine}>
          Biotechnology skincare developed with the world&apos;s first plant cell gene protein
        </p>

        <p className={styles.manifestoEnLine}>I came out to change my skin</p>

        <p className={`${styles.manifestoSignature} ${styles.manifestoTightPc}`}>
          May 2026 TONY WANG
        </p>
      </div>

      <div className={styles.bottomMotionLine} aria-hidden="true" />
    </section>
  );
}
