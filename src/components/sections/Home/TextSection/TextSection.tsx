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
    </section>
  );
}
