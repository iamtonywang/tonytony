import styles from "./HomeImageHero.module.css";

export default function HomeImageHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroImage} aria-hidden="true" />
      <div className={styles.heroOverlay}>
        <h2 className={styles.heroSubTitle}>plant cell genetic protein</h2>
        <h2 className={styles.heroKoreanTitle}>식물 세포 유전 단백질 연구소</h2>

        <h1 className={styles.heroTitle}>TONY WANG</h1>

        <p className={styles.heroDescription}>
          Plant cell gene recombinant protein synthesis technology is the principle of cloning and recombining cell DNA When different cell DNAs are combined, they form a new cell structure Newly formed cells form components in a third structure TONYWANG is working on research and development to create new DNA for cells Newly formed cells develop new efficacy as complex members Bio&apos;s Gene Recombination Technology we team is aging skin, makeup poison, skin damage caused by percutaneou poison infection. Skin trouble. Skin tissue Research and develop proteins for restoration
        </p>
      </div>
    </section>
  );
}
