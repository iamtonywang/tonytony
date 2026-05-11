import styles from "./page.module.css";

export default function OurWorkPage() {
  return (
    <div className={styles.ourWorkPage}>
      <section className={styles.fadeHeroSection} aria-hidden="true">
        <div className={styles.fadePortrait} />
        <div className={styles.heroTextOverlay}>
          <h1 className={styles.heroMainText}>plant cell genetic protein</h1>
          <p className={styles.heroSubText}>식물 세포 유전자 단백질</p>
        </div>
      </section>
    </div>
  );
}
