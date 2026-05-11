import styles from "./page.module.css";

export default function OurWorkPage() {
  return (
    <div className={styles.ourWorkPage}>
      <section className={styles.fadeHeroSection} aria-hidden="true">
        <div className={styles.fadePortrait} />
      </section>
    </div>
  );
}
