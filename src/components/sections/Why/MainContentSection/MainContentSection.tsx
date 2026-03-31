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
      <div className={styles.whyGlowLine} aria-hidden="true" />

      <div className={styles.whySeoIntro}>
        <h1 className={styles.whySeoTitle}>TONYWANG</h1>
        <p className={styles.whySeoLine}>Research Development Plant Cell Gene Protein</p>
        <p className={styles.whySeoLine}>Molecular Bio-Bioengineering for verified skin innovation</p>
        <p className={styles.whySeoLine}>WHY asks one question: what is truly proven and truly valuable?</p>
      </div>

      <div className={styles.whyGlowLine} aria-hidden="true" />

      <div className={styles.whyVisualBlock}>
        <div className={styles.whyVisualMedia}>
          <img
            className={styles.whyVisualImage}
            src="/landing-assets/hero-main-pc.webp"
            alt="TONYWANG why visual"
            draggable={false}
          />
          <div className={styles.whyGradientOverlay} aria-hidden="true" />
          <div
            ref={overlayRef}
            className={`${styles.whyTextOverlay} ${visible ? styles.whyTextOverlayVisible : ""}`}
            aria-hidden="true"
          >
            <div key={animKey} className={styles.whyTextInner}>
              <div className={styles.whyOverlayLine}>TONYWANG</div>
              <div className={styles.whyOverlayLine}>Plant Cell Gene Protein</div>
              <div className={styles.whyOverlayLine}>
                Biopharmaceutical Bacteria, Viruses, Cells mRNA Platform-Based Design
              </div>
              <div className={styles.whyOverlayLine}>
                Natural product-based plant cell gene protein platform technology
              </div>
              <div className={styles.whyOverlayLine}>벤자민 버튼! 처럼 돌아갈수만 있다면 . . . .</div>
              <div className={styles.whyOverlayLine}>짧아진 텔로미어를 늘릴수 있다면 ?</div>
              <div className={styles.whyOverlayLine}>그 시계를 되감을 수 있다면?</div>
              <div className={styles.whyOverlayLine}>피부가 늙는 건 나이가 아니라, 세포가 지쳐버렸기 때문이야</div>
              <div className={styles.whyOverlayLine}>그래</div>
              <div className={styles.whyOverlayLine}>나는 세포를 연구하는 데 28년을 보냈다</div>
              <div className={styles.whyOverlayLine}>누구나 인생을 살면서 한번쯤 은 미친 듯이 도전을 해보았을 것이다</div>
              <div className={styles.whyOverlayLine}>그리고 . . . . . .</div>
              <div className={styles.whyOverlayLine}>셀 수 없는 한숨과 눈물 그리고 가슴 저미 는 고통을 받으며</div>
              <div className={styles.whyOverlayLine}>미친 듯이 실패하고 좌절하면서 실패한 것을 깨달고</div>
              <div className={styles.whyOverlayLine}>도전하는 자 포기하는 자 로 나뉜다</div>
              <div className={styles.whyOverlayLine}>그래 이게 인생이야</div>
              <div className={styles.whyOverlayLine}>파노라마 같은 인생에서 누구나 겪는 세월의 흔적 이고</div>
              <div className={styles.whyOverlayLine}>82억 인구 중에 우리가 겪는 실패와 성공도 한 부분이야</div>
              <div className={styles.whyOverlayLine}>새로운 피부 조직을 변혁 하는 유일한 유전자 단백질</div>
              <div className={styles.whyOverlayLine}>Plant Cell Gene Protein</div>
              <div className={styles.whyOverlayLine}>바이오 의약품 세균, 바이러스, 세포 mRNA 플랫폼</div>
              <div className={styles.whyOverlayLine}>천연물 기반 식물세포 유전자 단백질 플랫폼</div>
              <div className={styles.whyOverlayLine}>식물세포 DNA 클로닝 재조합</div>
              <div className={styles.whyOverlayLine}>세포 간 유전자 융합을 통해 제3의 단백질 창출</div>
              <div className={styles.whyOverlayLine}>SINCE  August 2025 TONYWANG</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.whyGlowLine} aria-hidden="true" />
    </section>
  );
}
