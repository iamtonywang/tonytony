import styles from "./HomeImageHero.module.css";

export default function HomeImageHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroImage} aria-hidden="true" />
      <div className={styles.heroOverlay}>
        <h2 className={styles.heroSubTitle}>plant cell genetic protein</h2>
        <h2 className={styles.heroKoreanTitle}>식물 세포 유전자 단백질 연구소</h2>

        <h1 className={styles.heroTitle}>TONY WANG</h1>
      </div>
    </section>
  );
}
