import styles from "./HomeMotionLine.module.css";

export default function HomeMotionLine() {
  return (
    <section className={styles.lineSection} aria-label="랜딩">
      <div className={styles.motionLine} aria-hidden="true" />

      <div className={styles.landingCopy}>
        <h1 className={styles.heroTitle}>TONY WANG</h1>

        <h3 className={styles.heroSubTitle}>plant cell genetic protein</h3>

        <h2 className={styles.heroKoreanTitle}>식물 세포 유전자 단백질 연구소</h2>

        <div className={styles.heroDescription}>
          <p>What is creation?</p>
          <p>
            I made something that didn&apos;t exist in the world
            <br />
            I came to the world to change my skin
          </p>
          <p>The only genetic protein that improves new skin tissue</p>
          <p>Precisely regulate skin cell signal transmission and activate ECM reconstruction</p>
          <p>
            and regenerative genes to remove toxins from the skin, restore skin, and heal problems
          </p>
        </div>

        <div className={styles.bottomLandingLine} aria-hidden="true" />

        <div className={styles.endingCopy}>
          <h2 className={styles.endingTitle}>NIGAJUN</h2>

          <p className={styles.endingText}>
            I thought about it and made up my mind
            <br />
            I realized that skincare can turn the world upside down
          </p>

          <div className={styles.endingBottomLine} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
