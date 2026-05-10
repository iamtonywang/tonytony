import styles from "./HomeHero.module.css";

export default function HomeHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroImage} />
      <div className={styles.heroOverlay}>
        <p className={styles.heroSubText}>
          Plant Cell Gene Recombination Protein Laboratory
        </p>

        <h1 className={styles.heroTitle}>TONY WANG</h1>

        <p className={styles.heroDescription}>
          Plant cell gene recombinant protein synthesis technology applied to dermatological formulations.
          Interdisciplinary bioengineering from plant signal proteins to peptide complexes.
        </p>

        <h2 className={styles.heroBrand}>NIGAJUN</h2>
      </div>
    </section>
  );
}
