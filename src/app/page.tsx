import type { Metadata } from "next";

import SignatureLine from "@/components/sections/SignatureLine";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "TONY WANG | Plant Cell Protein Laboratory",
  description:
    "TONY WANG researches plant cell gene proteins and ProteoPhytoComplex, a plant-based protein complex designed to support damaged skin recovery and regeneration.",
};

export default function HomePage() {
  return (
    <>
      <div className={styles.sectionsBackdrop}>
        <div className={styles.founderImage} aria-hidden="true" />

        <SignatureLine />

        <section className={styles.introduction}>
          <h1 className={styles.brandTitle}>TONY WANG</h1>
          <h2 className={styles.laboratoryTitle}>Plant Cell Protein Laboratory</h2>
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
      </div>

      <div className={styles.footerDivider} aria-hidden="true" />
    </>
  );
}
