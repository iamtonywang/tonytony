import Image from "next/image";

import SignatureLine from "@/components/sections/SignatureLine";
import styles from "./page.module.css";

export default function OurWorkPage() {
  return (
    <div className={styles.ourwork}>
      <SignatureLine />

      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <Image
            src="/landing-assets/tonywang-ourwork-hero.webp"
            alt="Portrait representing creative work and human experience"
            fill
            priority
            sizes="(max-width: 768px) min(430px, 100vw), min(720px, 100vw)"
            className={styles.heroImage}
          />
          <div className={styles.heroScrim} aria-hidden="true" />
        </div>
        <div className={styles.heroCopy}>
          <h1 className={styles.brandTitle}>TONY WANG</h1>
          <p className={styles.sectionTitle}>OUR WORK</p>
        </div>
      </section>

      <SignatureLine />

      <section className={styles.section}>
        <p className={styles.bodyCopy}>
          Everyone experiences at least one crazy challenge in life.
        </p>
        <p className={styles.bodyCopy}>
          Countless sighs, tears, relentless failures, unbearable pain, hard-earned success, and
          moments of giving up...
        </p>
        <p className={styles.bodyCopy}>These are the paths that divide us.</p>
        <p className={styles.bodyCopy}>Yes, this is life.</p>
      </section>

      <SignatureLine />

      <section className={styles.section}>
        <p className={styles.bodyCopy}>
          They are the marks left by time in the panoramic journey of every human life.
        </p>
      </section>

      <SignatureLine />

      <section className={styles.section}>
        <p className={styles.bodyCopy}>
          Among the 8.2 billion people on this planet, each of us carries a story of failure and
          success.
        </p>
      </section>

      <SignatureLine />

      <section className={styles.section}>
        <h2 className={styles.brandTitle}>So, what is creation?</h2>
      </section>

      <SignatureLine />

      <section className={styles.section}>
        <p className={styles.sectionTitle}>
          To create, you have to be willing to go a little crazy.
        </p>
        <p className={styles.sectionTitle}>
          You have to build something the world has never seen before.
        </p>
      </section>

      <div className={styles.footerDivider} aria-hidden="true" />
    </div>
  );
}
