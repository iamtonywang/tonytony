"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MainContentSection.module.css";

export default function MainContentSection() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          setAnimKey((prevKey) => prevKey + 1);
        } else {
          setVisible(false);
        }
      },
      { threshold: 0.3 }
    );

    if (overlayRef.current) {
      observer.observe(overlayRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.ourWorkGlowLine} aria-hidden="true" />

      <div className={styles.ourWorkSeoIntro}>
        <h1 className={styles.ourWorkSeoTitle}>TONYWANG</h1>
        <p className={styles.ourWorkSeoLine}>Research Development Plant Cell Gene Protein</p>
        <p className={styles.ourWorkSeoLine}>Molecular Bio-Bioengineering for skin recovery and regeneration</p>
        <p className={styles.ourWorkSeoLine}>Our Work is built on proof, precision, and uncompromising development.</p>
      </div>

      <div className={styles.ourWorkGlowLine} aria-hidden="true" />

      <div className={styles.ourWorkVisualBlock}>
        <div className={styles.ourWorkVisualMedia}>
          <img
            className={styles.ourWorkVisualImage}
            src="/landing-assets/hero-main-pc.webp"
            alt="TONYWANG our work visual"
            draggable={false}
          />
          <div className={styles.ourWorkGradientOverlay} aria-hidden="true" />
          <div
            ref={overlayRef}
            className={`${styles.ourWorkTextOverlay} ${visible ? styles.ourWorkTextOverlayVisible : ""}`}
            aria-hidden="true"
          >
            <div key={animKey} className={styles.ourWorkTextInner}>
              <div className={styles.ourWorkOverlayLine}>TONYWANG</div>
              <div className={styles.ourWorkOverlayLine}>Plant Cell Gene Protein</div>
              <div className={styles.ourWorkOverlayLine}>
                Biopharmaceutical Bacteria, Viruses, Cells mRNA Platform-Based Design
              </div>
              <div className={styles.ourWorkOverlayLine}>
                Natural product-based plant cell gene protein platform technology
              </div>
              <div className={styles.ourWorkOverlayLine}>나는 28년간 인류의 질병</div>
              <div className={styles.ourWorkOverlayLine}>질병을 유발하는 악성균을 치료할 유전자 단백질을 찾고자</div>
              <div className={styles.ourWorkOverlayLine}>모든 것을 걸었고 모든 것을 버렸다</div>
              <div className={styles.ourWorkOverlayLine}>나는 운명이라 생각했다</div>
              <div className={styles.ourWorkOverlayLine}>그래 거창함은 없다 운명이라 생각했다</div>
              <div className={styles.ourWorkOverlayLine}>
                세상에 태어난 이유이고 인류의 질병에 오로지 해결점을 찾고 싶었다
              </div>
              <div className={styles.ourWorkOverlayLine}>28년 생명공학 연구 개발을 하면서</div>
              <div className={styles.ourWorkOverlayLine}>단 한번도</div>
              <div className={styles.ourWorkOverlayLine}>화장품 따위는 만들 생각이 없었다</div>
              <div className={styles.ourWorkOverlayLine}>나의 창작 연구는</div>
              <div className={styles.ourWorkOverlayLine}>줄기세포 NO, 리포좀 NO,</div>
              <div className={styles.ourWorkOverlayLine}>엑소좀 NO, 성장인자 NO,</div>
              <div className={styles.ourWorkOverlayLine}>나노입자 NO, 펩타이드 NO</div>
              <div className={styles.ourWorkOverlayLine}>Plant Cell Gene Protein</div>
              <div className={styles.ourWorkOverlayLine}>바이오 의약품 세균, 바이러스, 세포 mRNA</div>
              <div className={styles.ourWorkOverlayLine}>천연물 기반 식물세포 유전자 단백질 플랫폼</div>
              <div className={styles.ourWorkOverlayLine}>SINCE  August 2025 TONYWANG</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.ourWorkGlowLine} aria-hidden="true" />

      <div className={styles.ourWorkBottomCopy}>
        <p className={styles.ourWorkBottomTitle}>TONYWANG</p>
        <p className={styles.ourWorkBottomSubTitle}>Our Work</p>
        <p className={styles.ourWorkBottomLine}>
          We research and develop plant cell gene protein solutions to precisely regulate skin signaling pathways.
        </p>
        <p className={styles.ourWorkBottomLine}>
          Every result is designed to connect removal, recovery, and regeneration with measurable proof.
        </p>
      </div>

      <div className={styles.ourWorkGlowLine} aria-hidden="true" />
    </section>
  );
}
