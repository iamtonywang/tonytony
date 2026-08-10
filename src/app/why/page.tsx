import Image from "next/image";

import SignatureLine from "@/components/sections/SignatureLine";
import styles from "./page.module.css";

export default function WhyPage() {
  return (
    <div className={styles.why}>
      <SignatureLine />

      <section className={styles.hero}>
        <div className={styles.heroFadeX}>
          <div className={styles.heroFadeY}>
            <div className={styles.heroFadeShape}>
              <div className={styles.heroMedia}>
                <Image
                  src="/landing-assets/tonywang-why-hero-v4.webp"
                  alt="Two people representing identity, purpose, and the question of WHY"
                  fill
                  priority
                  sizes="(max-width: 768px) min(430px, 100vw), min(720px, 100vw)"
                  className={styles.heroImage}
                />
              </div>
              <div className={styles.heroScrim} aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className={styles.heroCopy}>
          <h1 className={styles.brandTitle}>TONY WANG</h1>
          <p className={styles.sectionTitle}>WHY?</p>
        </div>
      </section>

      <SignatureLine />

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Why has TONY WANG appeared only now?</p>
        <p className={styles.bodyCopy}>
          To reveal. To expose. To prove. To inspire. To make one thing unmistakably clear.
        </p>
        <p className={styles.bodyCopy}>Innovation and Creation.</p>
        <p className={styles.bodyCopy}>This is where it begins.</p>
        <p className={styles.bodyCopy}>To create transformation through a single mechanism.</p>
      </section>

      <SignatureLine />

      <section className={styles.section}>
        <h2 className={styles.brandTitle}>NIGAJUN</h2>
        <p className={styles.bodyCopy}>
          A realm reserved only for those who have earned it through sweat.
        </p>
      </section>

      <SignatureLine />

      <section className={styles.section}>
        <h2 className={styles.brandTitle}>What is Creation?</h2>
        <p className={styles.bodyCopy}>
          Creation demands obsession. Creation demands madness. Creation means bringing into existence what the world has never seen. We came to solve the puzzle of skin.
        </p>
      </section>

      <SignatureLine />

      <section className={styles.section}>
        <p className={styles.bodyCopy}>
          If you seek transformation, Welcome. If you cannot recognize value, if all you have are doubts, Walk away. We are not here to explain. We are not here to convince you. We create.
        </p>
      </section>

      <div className={styles.footerDivider} aria-hidden="true" />
    </div>
  );
}
