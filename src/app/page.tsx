import type { Metadata } from "next";
import Image from "next/image";

import SignatureLine from "@/components/sections/SignatureLine";
import styles from "./page.module.css";

const HOME_URL = "https://www.iamtonywang.com";
const HOME_TITLE = "TONY WANG | DERMA PHYTON Global Institute";
const HOME_DESCRIPTION =
  "Plant cell gene protein research by TONY WANG at DERMA PHYTON Global Institute, developing ProteoPhytoComplex and NIGAJUN through proof and innovation.";
const HOME_OG_IMAGE = `${HOME_URL}/landing-assets/tonywang-home-hero-clean-v4.webp`;

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: HOME_URL,
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: HOME_URL,
    siteName: "TONY WANG",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: HOME_OG_IMAGE,
        width: 1200,
        height: 1700,
        alt: "TONY WANG — DERMA PHYTON Global Institute",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [HOME_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TONY WANG",
  alternateName: "DERMA PHYTON Global Institute",
  url: HOME_URL,
  description: HOME_DESCRIPTION,
  inLanguage: "en",
};

export default function HomePage() {
  return (
    <div className={styles.home}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <SignatureLine />

      <section className={styles.heroIdentity} aria-labelledby="home-hero-title">
        <h1 id="home-hero-title" className={styles.heroTitle}>
          TONY WANG
        </h1>
        <h2 className={styles.heroInstitute}>
          DERMA PHYTON Global Institute
        </h2>
        <h3 className={styles.heroSubtitle}>
          Plant cell gene protein
        </h3>
      </section>

      <section className={styles.hero}>
        <div className={styles.heroFadeX}>
          <div className={styles.heroFadeY}>
            <div className={styles.heroFadeShape}>
              <div className={styles.heroMedia}>
                <Image
                  src="/landing-assets/tonywang-home-hero-clean-v4.webp"
                  alt="Tony Wang founder portrait for DERMA PHYTON Global Institute"
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
          <p className={styles.heroMessageLines}>
            <span>긴 설명은 필요하지 않아</span>
            <span>
              거짓은 수치이고 창피한 행위야 성분이 뭐고{" "}
              <br className={styles.mobileOnlyBreak} />
              어떤 구조라고 떠들고 싶지 않아
            </span>
            <span>
              화려한 설명이 소용이 없다는 것을 알기에,,,,,,
            </span>
            <span>
              최고라고 말할 필요도 없어 스스로 얘기 하는건{" "}
              <br className={styles.mobileOnlyBreak} />
              모순이고 창피한 행동이야
            </span>
            <span className={styles.heroMessageBrand}>NIGAJUN</span>
            <span className={styles.heroMessageBrand}>I MADE IT FOR YOU</span>
            <span>
              피부를 위한 모든 퍼즐을 풀고자 세상에 나왔다{" "}
              <br className={styles.mobileOnlyBreak} />
              입증만이 진실이고 그것이 정직한 사실이다
            </span>
            <span>
              수천 마디 거짓 과장된 표현은 필요 없다
            </span>
          </p>
        </div>
      </section>

      <SignatureLine />

      <section className={styles.introduction}>
        <p className={styles.bodyCopy}>
          Plant Cell Gene Protein is a protein that precisely regulates the signaling of damaged
          skin to activate recovery and regeneration.
        </p>
        <p className={styles.bodyCopy}>
          ProteoPhytoComplex plant-based protein complex.
        </p>
      </section>

      <SignatureLine />

      <section className={styles.launch}>
        <h2 className={styles.productTitle}>NIGAJUN</h2>
        <time className={styles.launchDate} dateTime="2026-08">
          Launching August 2026
        </time>
      </section>

      <SignatureLine />

      <section className={styles.manifesto}>
        <p className={styles.brandTitle}>TONY WANG</p>
        <p className={styles.bodyCopy}>
          set out to achieve innovation and creation Area for achieving transformation as a mechanism the absolute realm that only a creator can do
        </p>
        <p className={styles.manifestoBridge}>TONY WANG AND NIGAJUN AND Start We&apos;re going on a long journey now</p>
        <time className={styles.launchDate} dateTime="2026-08">
          August 2026 TONY WANG
        </time>
      </section>

      <div className={styles.footerDivider} aria-hidden="true" />
    </div>
  );
}
