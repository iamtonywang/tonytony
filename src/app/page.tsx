import styles from "./page.module.css";

const HERO_IMAGE_SRC = "/landing-assets/hero-founder.webp";

export default function HomePage() {
  return (
    <>
      <div className={styles.hairline} aria-hidden />
      <section className={styles.heroSection} aria-label="Founder hero">
        <div className={styles.heroMediaWrap}>
          <img
            src={HERO_IMAGE_SRC}
            alt="TONY WANG founder editorial portrait"
            className={styles.heroImage}
            width={1254}
            height={1254}
            decoding="async"
            draggable={false}
          />
          <div className={styles.heroBrandOverlay}>
            <p className={styles.heroBrandTitle}>TONYWANG</p>
          </div>
        </div>
      </section>
      <div className={styles.hairline} aria-hidden />
    </>
  );
}
