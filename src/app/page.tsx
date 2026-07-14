import Image from "next/image";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <div className={styles.topHairline} aria-hidden />
      <div className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/landing-assets/hero-founder.webp"
          alt=""
          width={1254}
          height={1254}
          priority
          sizes="100vw"
        />
        <div className={styles.heroOverlay}>
          <p className={styles.heroTitle}>TONY WANG</p>
          <p className={styles.heroSubtitle}>plant cell genetic protein</p>
          <p className={styles.heroQuestion}>What is creation?</p>
          <p className={styles.heroLine}>
            I made something that didn&apos;t exist in the world
          </p>
          <p className={styles.heroLine}>I came to the world to change my skin</p>
          <p className={styles.heroLine}>
            Precisely regulate skin cell signal transmission and activate ECM reconstruction
          </p>
          <p className={styles.heroLine}>NIGAJUN</p>
          <p className={styles.heroLine}>I thought about it and made up my mind</p>
        </div>
      </div>
    </div>
  );
}
