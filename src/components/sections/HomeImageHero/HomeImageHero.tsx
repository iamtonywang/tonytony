import styles from "./HomeImageHero.module.css";

export default function HomeImageHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroImage} aria-hidden="true" />
      <div className={styles.heroOverlay}>
        <h1 className={styles.heroTitle}>TONY WANG</h1>

        <h2 className={styles.heroSubTitle}>plant cell genetic protein</h2>
        <h2 className={styles.heroKoreanTitle}>식물 세포 유전자 단백질 연구소</h2>

        <div className={styles.heroProteoBlock}>
          <p className={styles.heroProteoEn}>Proteo Phyto Complex</p>
          <p className={styles.heroProteoKo}>식물 세포 유전자 단백질 복합 성분</p>
        </div>

        <h2 className={styles.heroNigajun}>NIGAJUN</h2>

        <p className={styles.heroBottomDescription}>
          <span className={styles.pcOnly}>
            It is a plant cell gene protein complex that activates recovery and regeneration <br />
            by precisely controlling the signaling of damaged skin. Interact <br />
            with cell membrane receptors to stabilize signal flow, promote recovery <br />
            and defense genes, and rebuild elastin-based ECM struct
          </span>

          <span className={styles.mobileOnly}>
            It is a plant cell gene protein complex<br />
            that activates recovery and regeneration<br />
            by precisely controlling the signaling of damaged skin. Interact<br />
            with cell membrane receptors to stabilize signal flow,<br />
            promote recovery<br />
            and defense genes, and rebuild elastin-based ECM struct
          </span>
        </p>
      </div>
    </section>
  );
}
