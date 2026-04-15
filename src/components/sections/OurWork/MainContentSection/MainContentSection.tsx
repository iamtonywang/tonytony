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
              <div className={`${styles.ourWorkOverlayLine} ${styles.tonyOffset} ${styles.textLarge}`}>TONYWANG</div>
              <div className={`${styles.ourWorkOverlayLine} ${styles.textMedium}`}>Our Work</div>
              <div className={styles.statementSmallBlock}>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>벤자민 버튼! 처럼 돌아갈수만 있다면 . . . .</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>피부가 늙는 건 나이가 아니라, 세포가 소멸된 이유야</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>그래</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textLarge}`}>TONYWANG</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>나는 세포를 연구하는 데 28년을 보냈다</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>누구나 인생을 살면서 한번쯤 은 미친 듯이 도전을 해보았을 것이다</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>그리고 . . . . .</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>셀 수 없는 한숨과 눈물 그리고 가슴 저미 는 고통을 받으며</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>미친 듯이 실패하고 실패한 것을 복구하며</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>도전하는 자 포기하는 자 로 나뉜다</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>그래 이게 인생이야</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>파노라마 같은 인생에서 누구나 겪는 세월의 흔적 이고</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>82억 인구 중에 우리가 겪는 실패와 성공도 한 부분이야</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>28년 생명공학 연구 개발을 하면서</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>단 한번도</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textLarge}`}>화장품 따위는 만들 생각이 없었다</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>나의 창작 연구는</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textMedium}`}>줄기세포 NO, 리포좀 NO,</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textMedium}`}>엑소좀 NO, 성장인자 NO,</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textMedium}`}>나노입자 NO, 펩타이드 NO</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>Plant Cell Gene Protein</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>피부 조직을 변혁 하는 유일한 유전자 단백질</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>천연물 기반 식물세포 유전자 단백질 플랫폼</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>식물세포 DNA 클로닝 재조합</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>세포 간 유전자 융합을 통해 제3의 유일 단백질</div>
                <div className={`${styles.ourWorkOverlayLine} ${styles.textSmall}`}>SINCE May 2026</div>
              </div>
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
