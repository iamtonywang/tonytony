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
              <div className={`${styles.whyOverlayLine} ${styles.textLarge}`}>TONYWANG</div>
              <div className={`${styles.whyOverlayLine} ${styles.textMedium}`}>WHY?</div>
              <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                plant cell gene protein complex
              </div>
              <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>Proteo Phyto Complex</div>

              <div className={styles.statementSmallBlock}>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>충격적인 계기가 있었어</div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  그리고 그때 나는 생각했고 결심했어
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  스킨케어로도 세상을 뒤집어 놓을수있다는 것을
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  <span className={styles.desktopOnly}>
                    피부 근본을 바꾸는 P-Code™. 독소를 제거하는 Genesis Protein
                  </span>
                  <span className={styles.mobileOnly}>
                    피부 근본을 바꾸는 P-Code™.
                    <br className={styles.mobileOnlyBreak} />
                    독소를 제거하는 Genesis Protein
                  </span>
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  <span className={styles.desktopOnly}>
                    피부를 가장 깨끗하고 건강했던 &apos;태초의 상태 되돌림
                  </span>
                  <span className={styles.mobileOnly}>
                    피부를 가장 깨끗하고 건강했던
                    <br className={styles.mobileOnlyBreak} />
                    피부가 &apos;태초의 상태 되돌림
                  </span>
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  <span className={styles.desktopOnly}>
                    단순한 복구가 아닌, 피부 근본을 변환하는 P-Code™
                  </span>
                  <span className={styles.mobileOnly}>
                    단순한 복구가 아닌,
                    <br className={styles.mobileOnlyBreak} />
                    피부 근본을 변환하는 P-Code™
                  </span>
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>식물세포 유전자 단백질 복합체</div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>Proteo Phyto Complex</div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>독소 정화 (Toxin Purge)</div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  <span className={styles.desktopOnly}>
                    Toxin Purge 외부 독소는 피부의 유전자 명령을 멈추게 한다.
                  </span>
                  <span className={styles.mobileOnly}>
                    Toxin Purge 외부 독소는
                    <br className={styles.mobileOnlyBreak} />
                    피부의 유전자 명령을 멈추게 한다.
                  </span>
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  <span className={styles.desktopOnly}>
                    독소와 염증 유발 인자를 정밀 정화 하여 무해한 형태로 Purge 한다
                  </span>
                  <span className={styles.mobileOnly}>
                    독소와 염증 유발 인자를 정밀 정화 하여
                    <br className={styles.mobileOnlyBreak} />
                    무해한 형태로 Purge 한다
                  </span>
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  <span className={styles.desktopOnly}>
                    이 과정은 흑피증처럼 만성화된 독소 흔적을 지우는 선결 과제
                  </span>
                  <span className={styles.mobileOnly}>
                    이 과정은 흑피증처럼 만성화된
                    <br className={styles.mobileOnlyBreak} />
                    독소 흔적을 지우는 선결 과제
                  </span>
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  유전자 복원 및 재생 (Skin Regeneration)
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  <span className={styles.desktopOnly}>
                    독소가 사라진 자리에 Proteo Phyto Complex 복합체 는
                  </span>
                  <span className={styles.mobileOnly}>
                    독소가 사라진 자리에
                    <br className={styles.mobileOnlyBreak} />
                    Proteo Phyto Complex 복합체 는
                  </span>
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  <span className={styles.desktopOnly}>
                    섬유아세포와 줄기세포에 직접 &apos;변혁 명령&apos;을 내린다
                  </span>
                  <span className={styles.mobileOnly}>
                    섬유아세포와 줄기세포에
                    <br className={styles.mobileOnlyBreak} />
                    직접 &apos;변혁 명령&apos;을 내린다
                  </span>
                </div>
                <div
                  className={`${styles.whyOverlayLine} ${styles.textSmall} ${styles.mobileHideLine}`}
                >
                  유전자가 활성화되어 콜라겐과 엘라스틴 생성을 재시작하고
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  피부의 건강했던 태초 (Original) 상태로 되돌린다
                </div>
              </div>

              <div className={`${styles.whyOverlayLine} ${styles.textMedium}`}>TONYWANG</div>
              <div
                className={`${styles.whyOverlayLine} ${styles.textMedium} ${styles.brandOrangeText}`}
              >
                화장품 회사가 아니다.
              </div>

              <div className={styles.statementSmallBlock}>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  <span className={styles.desktopOnly}>
                    28년 동안 오직 식물세포유전자 단백질 연구 생명 과학 연구소
                  </span>
                  <span className={styles.mobileOnly}>
                    28년 동안 오직 식물세포유전자 단백질 연구한
                    <br className={styles.mobileOnlyBreak} />
                    BIO 생명 과학 연구소
                  </span>
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  <span className={styles.desktopOnly}>
                    모든 연구는 단 하나 식물세포유전자단백질 개발
                  </span>
                  <span className={styles.mobileOnly}>
                    모든 연구는 단 하나
                    <br className={styles.mobileOnlyBreak} />
                    식물세포유전자단백질 개발
                  </span>
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  난치성 피부질환 치료 단백질 연구
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  염증 유발 인자 악성 균 제어 단백질 연구
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  피부 독소 정화 단백질 연구
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  <span className={styles.desktopOnly}>
                    긴 시간 동안 이 분야에 매진한 이유는 명확해.
                  </span>
                  <span className={styles.mobileOnly}>
                    긴 시간 동안 이 분야에 매진한
                    <br className={styles.mobileOnlyBreak} />
                    이유는 명확해.
                  </span>
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  <span className={styles.desktopOnly}>
                    인류의 삶의 질을 위협하는 난치성 피부질환을 근본적으로 치료하고,
                  </span>
                  <span className={styles.mobileOnly}>
                    인류의 삶의 질을 위협하는
                    <br className={styles.mobileOnlyBreak} />
                    난치성 피부질환을 근본적으로 치료하고,
                  </span>
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  손상된 피부를 건강하게 복원 및 재생할 수 있는
                </div>
                <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                  창조적인 유전자를 연구 개발하는 것
                </div>
              </div>

              <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>세상 밖으로 나온 이유는</div>
              <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>
                <span className={styles.textMedium}>NIGAJUN</span>
                {' '}때문이야
              </div>
              <div className={`${styles.whyOverlayLine} ${styles.textSmall}`}>나의 결실이자 창조 물질</div>
              <div className={`${styles.whyOverlayLine} ${styles.sinceSmall}`}>SINCE May 2026</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.whyGlowLine} aria-hidden="true" />
    </section>
  );
}
