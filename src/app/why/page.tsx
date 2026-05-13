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

/** 28년 식물세포 유전자 단백질 연구 — 사용자 제공 원문 (수정·축약 없음) */
const INTERVIEW_03_TURNS: readonly { speaker: "기자" | "TONYWANG"; text: string }[] = [
  { speaker: "기자", text: "식물세포유전자 단백질이요?" },
  { speaker: "TONYWANG", text: "네" },
  {
    speaker: "기자",
    text: "식물 세포 유전자 단백질 분야는 생소한데요 바이오 분야에서 생물학제.줄기세포 등 및 바이오 시밀러 연구에 관한 것은 익숙한데 식물세포유전자 단백질 연구는 생소 합니다 설명좀 좀 부탁드립니다",
  },
  {
    speaker: "TONYWANG",
    text: "식물세포유전자단백질은 식물세포의 유전자를 조작해 특정 단백질을 연구합니다 유전자 재조합 기술을 통해 식물세포의 DNA를 변형하거나, 외부 제3의 유전자를 투과해 새로운 유형의 단백질을 개발 하는 것입니다",
  },
];

/** 식물세포 유전자 단백질의 원리 — 사용자 제공 원문 (수정·축약 없음) */
const INTERVIEW_04_TURNS: readonly { speaker: "기자" | "TONYWANG"; text: string }[] = [
  {
    speaker: "기자",
    text: "흠 그렇군요 그럼 주로 연구한 단백질은 어디에 적용되나요?",
  },
  {
    speaker: "TONYWANG",
    text: "광범위한 파이프라인을 구축 할수 있어요 형질전환(transformation) 하는 과정에서 제3의 유전자 로 변환 후 특정 질환에 포커스를 맞춰 식물세포에 원하는 유전자를 적용하여 타겟 질환에 적용되는 단백질을 개발 하는 것입니다",
  },
];

/** 피부 적용과 피부독소 정화 — 사용자 제공 원문 (수정·축약 없음) */
const INTERVIEW_05_TURNS: readonly { speaker: "기자" | "TONYWANG"; text: string }[] = [
  {
    speaker: "TONYWANG",
    text: "피부 적용분야 에서는 피부 독소를 개선하고 염증 반응 감소·재생력 촉진 등 문제성 피부 개선에 특화적인 작용을 합니다",
  },
  {
    speaker: "TONYWANG",
    text: "가장 중요한 것은 피부독소 제거입니다 피부 층에 기생하는 악성 세균과 화학성분에 의한 독소 성분을 제거하여 피부를 정화 시키는 것이 주된 요인입니다",
  },
  {
    speaker: "기자",
    text: "tony wang 논리면 매우 흥미로운 연구 이네요 그렇다면 다른 연구소나 회사들도 식물 세포 유전자 단백질를 연구 개발하나요?",
  },
  {
    speaker: "TONYWANG",
    text: "한국은 이제 조금씩 활성화 되는 추세인 것 같습니다",
  },
  {
    speaker: "TONYWANG",
    text: "유전자와 단백질 연구가 가장 발달한 나라는 미국, 영국, 독일, 중국 등이 대표적입니다. 이들 국가는 유전자 변형(GMO), 품종 개량, 유전체 분석 등 첨단 생명공학 분야에서 선도적 역할을 하고 있습니다. 특히 식뭏세포유전자 분야는 분자 생물학쪽입니다",
  },
];

export default function WhyPage() {
  const baseId = useId();
  const [iv01Open, setIv01Open] = useState(false);
  const [iv02Open, setIv02Open] = useState(false);
  const [iv03Open, setIv03Open] = useState(false);
  const [iv04Open, setIv04Open] = useState(false);
  const [iv05Open, setIv05Open] = useState(false);
  const panelId = `${baseId}-iv01-panel`;
  const headerId = `${baseId}-iv01-header`;
  const panelId02 = `${baseId}-iv02-panel`;
  const headerId02 = `${baseId}-iv02-header`;
  const panelId03 = `${baseId}-iv03-panel`;
  const headerId03 = `${baseId}-iv03-header`;
  const panelId04 = `${baseId}-iv04-panel`;
  const headerId04 = `${baseId}-iv04-header`;
  const panelId05 = `${baseId}-iv05-panel`;
  const headerId05 = `${baseId}-iv05-header`;

  const toggleIv01 = useCallback(() => {
    setIv01Open((v) => !v);
  }, []);

  const toggleIv02 = useCallback(() => {
    setIv02Open((v) => !v);
  }, []);

  const toggleIv03 = useCallback(() => {
    setIv03Open((v) => !v);
  }, []);

  const toggleIv04 = useCallback(() => {
    setIv04Open((v) => !v);
  }, []);

  const toggleIv05 = useCallback(() => {
    setIv05Open((v) => !v);
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
            <span className={styles.ivTriggerRow}>
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
            <span className={styles.ivTriggerRow}>
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

        <article className={styles.ivItem}>
          <button
            type="button"
            id={headerId03}
            className={`${styles.ivTrigger} ${iv03Open ? styles.ivTriggerOpen : ""}`}
            aria-expanded={iv03Open}
            aria-controls={panelId03}
            onClick={toggleIv03}
          >
            <span className={styles.ivTriggerRow}>
              <span className={styles.ivChapterTitle}>28년 식물세포 유전자 단백질 연구</span>
            </span>
            <span className={styles.ivLineTrack} aria-hidden>
              <span className={styles.ivLineFill} />
            </span>
          </button>

          <div
            id={panelId03}
            role="region"
            aria-labelledby={headerId03}
            className={`${styles.ivPanel} ${iv03Open ? styles.ivPanelOpen : ""}`}
          >
            <div className={styles.ivPanelInner}>
              <div className={styles.ivPanelPad} aria-hidden={!iv03Open}>
                {INTERVIEW_03_TURNS.map((turn, index) => (
                  <div key={`iv03-${index}`} className={styles.ivTurn}>
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
            id={headerId04}
            className={`${styles.ivTrigger} ${iv04Open ? styles.ivTriggerOpen : ""}`}
            aria-expanded={iv04Open}
            aria-controls={panelId04}
            onClick={toggleIv04}
          >
            <span className={styles.ivTriggerRow}>
              <span className={styles.ivChapterTitle}>식물세포 유전자 단백질의 원리</span>
            </span>
            <span className={styles.ivLineTrack} aria-hidden>
              <span className={styles.ivLineFill} />
            </span>
          </button>

          <div
            id={panelId04}
            role="region"
            aria-labelledby={headerId04}
            className={`${styles.ivPanel} ${iv04Open ? styles.ivPanelOpen : ""}`}
          >
            <div className={styles.ivPanelInner}>
              <div className={styles.ivPanelPad} aria-hidden={!iv04Open}>
                {INTERVIEW_04_TURNS.map((turn, index) => (
                  <div key={`iv04-${index}`} className={styles.ivTurn}>
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
            id={headerId05}
            className={`${styles.ivTrigger} ${iv05Open ? styles.ivTriggerOpen : ""}`}
            aria-expanded={iv05Open}
            aria-controls={panelId05}
            onClick={toggleIv05}
          >
            <span className={styles.ivTriggerRow}>
              <span className={styles.ivChapterTitle}>피부 적용과 피부독소 정화</span>
            </span>
            <span className={styles.ivLineTrack} aria-hidden>
              <span className={styles.ivLineFill} />
            </span>
          </button>

          <div
            id={panelId05}
            role="region"
            aria-labelledby={headerId05}
            className={`${styles.ivPanel} ${iv05Open ? styles.ivPanelOpen : ""}`}
          >
            <div className={styles.ivPanelInner}>
              <div className={styles.ivPanelPad} aria-hidden={!iv05Open}>
                {INTERVIEW_05_TURNS.map((turn, index) => (
                  <div key={`iv05-${index}`} className={styles.ivTurn}>
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
