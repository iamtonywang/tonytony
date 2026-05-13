"use client";

import { useCallback, useId, useState } from "react";
import styles from "./page.module.css";

/** INTERVIEW 01 — 사용자 제공 원문 (수정·축약 없음) */
const INTERVIEW_01_TURNS: readonly { speaker: "기자" | "TONYWANG"; text: string }[] = [
  { speaker: "TONYWANG", text: "안녕하세요 TONYWANG입니다" },
  { speaker: "기자", text: "안녕하세요 채수현 기자입니다" },
  { speaker: "TONYWANG", text: "네 반가워요" },
  {
    speaker: "기자",
    text: "인터뷰에 응해 주셔서 감사합니다 언론 기사와 홈페이지를 살펴보니 기존회사들과 환경이 다른점이 많은 것 같아요 TONYWANG 에 대해서 설명좀 해주시겠어요",
  },
  {
    speaker: "TONYWANG",
    text: "그런가요? 사실 TONYWANG 은 전부 날것 같은 다시 말하면 익히지 않은 생선가 같아요 의도 하지 않은 건데 사실 기존 패턴들을 굉장히 싫어합니다",
  },
  { speaker: "기자", text: "그렇군요" },
];

/** INTERVIEW 02 — 사용자 제공 원문 (수정·축약 없음) */
const INTERVIEW_02_TURNS: readonly { speaker: "기자" | "TONYWANG"; text: string }[] = [
  { speaker: "기자", text: "화장품 사업은 이번이 처음 진출하시는 건가요?" },
  { speaker: "TONYWANG", text: "네 그렇습니다 처음 해보는겁니다" },
  {
    speaker: "기자",
    text: "그럼 지난 시간은 어떤 업무를 하시다 화장품 사업을 하게 되신거죠?",
  },
  {
    speaker: "TONYWANG",
    text: "지난 28년 동안 단백질만 연구 했어요 식물세포 중심으로 세포 유전자를 변형시켜 새로운 제3의 단백질을 연구 개발했어요",
  },
];

export default function WhyPage() {
  const baseId = useId();
  const [iv01Open, setIv01Open] = useState(false);
  const [iv02Open, setIv02Open] = useState(false);
  const panelId = `${baseId}-iv01-panel`;
  const headerId = `${baseId}-iv01-header`;
  const panelId02 = `${baseId}-iv02-panel`;
  const headerId02 = `${baseId}-iv02-header`;

  const toggleIv01 = useCallback(() => {
    setIv01Open((v) => !v);
  }, []);

  const toggleIv02 = useCallback(() => {
    setIv02Open((v) => !v);
  }, []);

  return (
    <div className={styles.whyPage}>
      <section className={styles.whyLanding} aria-label="WHY landing">
        <div className={styles.whyLandingTopLine} aria-hidden />
        <div className={styles.whyLandingInner}>
          <h1 className={styles.whyLandingTitle}>TONY WANG</h1>
          <p className={styles.whyLandingSub}>WHY INTERVIEW ARCHIVE</p>
        </div>
      </section>

      <section
        className={styles.transitionSection}
        aria-label="Transition editorial"
      >
        <div className={styles.transitionNoise} aria-hidden />
        <div className={styles.transitionGlow} aria-hidden />

        <div className={styles.transitionInner}>
          <div className={styles.statementWrap}>
            <p className={styles.statementLine}>WHY IS NOT A STORY.</p>
            <p className={`${styles.statementLine} ${styles.statementLineMuted}`}>
              IT IS A RECORD OF 28 YEARS.
            </p>
          </div>

          <div className={styles.hairlineShort} aria-hidden />

          <div className={styles.subCopy}>
            <p className={styles.subLine}>THIS IS NOT MARKETING.</p>
            <p className={`${styles.subLine} ${styles.subLineMuted}`}>
              THIS IS AN INTERVIEW ARCHIVE.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.archiveSection} aria-label="Interview archive">
        <article className={styles.ivItem}>
          <button
            type="button"
            id={headerId}
            className={`${styles.ivTrigger} ${iv01Open ? styles.ivTriggerOpen : ""}`}
            aria-expanded={iv01Open}
            aria-controls={panelId}
            onClick={toggleIv01}
          >
            <span className={styles.ivMeta}>INTERVIEW 01</span>
            <span className={styles.ivTriggerRow}>
              <span className={styles.ivNum} aria-hidden>
                01
              </span>
              <span className={styles.ivChapterTitle}>첫 인사와 TONYWANG 소개</span>
            </span>
            <span className={styles.ivLineTrack} aria-hidden>
              <span className={styles.ivLineFill} />
            </span>
          </button>

          <div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            className={`${styles.ivPanel} ${iv01Open ? styles.ivPanelOpen : ""}`}
          >
            <div className={styles.ivPanelInner}>
              <div className={styles.ivPanelPad} aria-hidden={!iv01Open}>
                {INTERVIEW_01_TURNS.map((turn, index) => (
                  <div key={`iv01-${index}`} className={styles.ivTurn}>
                    <p className={styles.ivSpeaker}>{turn.speaker}</p>
                    <p className={styles.ivText}>{turn.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className={styles.ivItem}>
          <button
            type="button"
            id={headerId02}
            className={`${styles.ivTrigger} ${iv02Open ? styles.ivTriggerOpen : ""}`}
            aria-expanded={iv02Open}
            aria-controls={panelId02}
            onClick={toggleIv02}
          >
            <span className={styles.ivMeta}>INTERVIEW 02</span>
            <span className={styles.ivTriggerRow}>
              <span className={styles.ivNum} aria-hidden>
                02
              </span>
              <span className={styles.ivChapterTitle}>처음 시작한 스킨케어 사업</span>
            </span>
            <span className={styles.ivLineTrack} aria-hidden>
              <span className={styles.ivLineFill} />
            </span>
          </button>

          <div
            id={panelId02}
            role="region"
            aria-labelledby={headerId02}
            className={`${styles.ivPanel} ${iv02Open ? styles.ivPanelOpen : ""}`}
          >
            <div className={styles.ivPanelInner}>
              <div className={styles.ivPanelPad} aria-hidden={!iv02Open}>
                {INTERVIEW_02_TURNS.map((turn, index) => (
                  <div key={`iv02-${index}`} className={styles.ivTurn}>
                    <p className={styles.ivSpeaker}>{turn.speaker}</p>
                    <p className={styles.ivText}>{turn.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>

      <div className={styles.bodySpacer} aria-hidden />
    </div>
  );
}
