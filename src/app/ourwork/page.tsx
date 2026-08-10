import Image from "next/image";

import SignatureLine from "@/components/sections/SignatureLine";
import styles from "./page.module.css";

export default function OurWorkPage() {
  return (
    <div className={styles.ourwork}>
      <SignatureLine />

      <section className={styles.hero}>
        <div className={styles.heroFadeX}>
          <div className={styles.heroFadeY}>
            <div className={styles.heroFadeShape}>
              <div className={styles.heroMedia}>
                <Image
                  src="/landing-assets/tonywang-ourwork-hero-clean-v4.webp"
                  alt="Portrait representing creative work and human experience"
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
        <div className={styles.heroMessage}>
          <div className={styles.heroMessageLines}>
            <span>우리는 낡고 허술한 시대에 살고 있어</span>
            <span>무엇이 진실이고 무엇이 거짓인지 때론 모르고 살아 간다</span>
            <span>진실이 거짓이고 거짓이 진실이 되는 세상</span>
            <span>자본의 힘이 진실이고 때론 없다는 것이 거짓도 되기도 한다</span>
            <span>매우 안타깝고 괴로운 것이다</span>
            <span>TONY WANG 은 입증만 있다 입증이란 가장 무겁고 책임감이 따른다</span>
            <span>그것이 나의 힘이자 자본의 힘과는 비교도 할 수 없는 성역이다</span>
            <span>이제 Innovation and Creation 이루기 위해 출발한다</span>
            <span>하나의 메커니즘으로 변혁을 만들기 위해 세상에 나온 것이다</span>
            <span className={`${styles.heroMessageBrand} ${styles.heroMessageBrandStart}`}>NIGAJUN</span>
            <span className={styles.heroMessageBrand}>One day in August 2026 TONY WANG</span>
          </div>
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
