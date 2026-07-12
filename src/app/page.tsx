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
      <section className={styles.brandSection} aria-label="Brand copy">
        <p className={styles.brandName}>TONYWANG</p>
        <p className={styles.brandCopy}>plant cell genetic protein</p>
        <p className={styles.brandCopy}>식물 세포 유전자 단백질 연구소</p>
        <p className={styles.brandCopy}>What is creation?</p>
        <p className={styles.brandCopy}>
          I made something that didn&apos;t exist in the world
          <br />
          I came to the world to change my skin
        </p>
        <p className={styles.brandCopy}>
          Precisely regulate skin cell signal transmission and activate ECM reconstruction
        </p>
        <p className={`${styles.brandCopy} ${styles.brandCopyLead}`}>NIGAJUN</p>
        <p className={styles.brandCopy}>I thought about it and made up my mind</p>
      </section>
      <div className={styles.hairline} aria-hidden />
    </>
  );
}
