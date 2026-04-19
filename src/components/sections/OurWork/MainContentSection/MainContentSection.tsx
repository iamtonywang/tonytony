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
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
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

      <div className={styles.ourWorkMidCopy}>
        <p><span className={styles.highlightOrange}>벤자민 버튼!</span>{" "}처럼 돌아갈수만 있다면 . . . .</p>
        <p>피부가 늙는 건 나이가 아니라, 세포가 <span className={styles.highlight}>소멸된</span> 원인이야</p>
        <p><span className={styles.highlight}>YES</span> TONYWANG</p>
        <p>나는 세포를 연구하는 데 <span className={styles.highlightOrange}>28</span>년을 보냈다</p>
        <p>누구나 인생을 살면서 한번쯤 은 <span className={styles.highlight}>미친 듯이</span> 도전을 해보았을 것이다</p>
        <p><span className={styles.highlight}>파노라마</span> 같은 인생에서 누구나 겪는 세월의 흔적 이고</p>
        <p>82억 인구 중에 우리가 겪는 <span className={styles.highlight}>실패와 성공</span>도 한 부분이야</p>
        <p>28년 생명공학 연구 개발을 하면서</p>
        <p>단 한번도 <span className={styles.highlightOrangeSmall}>화장품 따위는</span> 만들 생각이 없었다</p>
        <p>나는 이런 하찮은 것들은 취급하지도 않는다</p>
        <p>줄기세포, 리포좀 엑소좀 성장인자 나노입자 펩타이드</p>
        <p><span className={styles.highlight}>나의 연구 개발은</span> Plant Cell Gene Protein 이다</p>
        <p>식물세포 DNA 클로닝 재조합 세포 간 유전자 융합을 통해 제3의 단백질 창출</p>
        <p>새로운 피부 조직을 <span className={styles.highlightOrange}>변혁</span> 하는 유일한<br className={styles.mobileBreak} />유전자 단백질 Plant Cell Gene Protein</p>
        <p>SINCE May 2026</p>
      </div>

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
            <div key={animKey} className={styles.ourWorkTextInner} />
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
