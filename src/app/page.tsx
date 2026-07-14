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
      </div>
    </div>
  );
}
