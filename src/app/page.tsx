import type { Metadata } from "next";
import Image from "next/image";

import SignatureLine from "@/components/sections/SignatureLine";
import styles from "./page.module.css";

const HOME_URL = "https://www.iamtonywang.com";
const HOME_TITLE = "TONY WANG | DERMAPHYTON Global Institute";
const HOME_DESCRIPTION =
  "TONY WANG researches Plant Cell Gene Protein and ProteoPhytoComplex at DERMAPHYTON Global Institute.";
const HOME_OG_IMAGE = `${HOME_URL}/landing-assets/tonywang-home-main-hero-v2.webp`;

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
        height: 1400,
        alt: "Tony Wang, founder of DERMAPHYTON Global Institute",
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

      <section className={styles.hero}>
        <div className={styles.heroFadeX}>
          <div className={styles.heroFadeY}>
            <div className={styles.heroMedia}>
              <Image
                src="/landing-assets/tonywang-home-main-hero-v2.webp"
                alt="Tony Wang, founder of DERMAPHYTON Global Institute"
                fill
                priority
                sizes="(max-width: 768px) min(430px, 100vw), min(720px, 100vw)"
                className={styles.heroImage}
              />
            </div>
            <div className={styles.heroScrim} aria-hidden="true" />
          </div>
        </div>
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>TONY WANG</h1>
          <p className={styles.heroInstitute}>DERMAPHYTON Global Institute</p>
          <h2 className={styles.heroSubtitle}>Plant Cell Gene Protein</h2>
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
