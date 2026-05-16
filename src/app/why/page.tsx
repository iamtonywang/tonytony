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
    text: "인터뷰 감사합니다 오기 전에 언론 기사와 홈페이지를 살펴보니 기존 회사들과 느낌과 색깔이 다른점이 많은 것 같아요 먼저 TONYWANG 에 대해서 간단한 소개 부탁드려요",
  },
  {
    speaker: "TONYWANG",
    text: "그런가요? TONYWANG 은 익히지 않은 생선 같아요 기존 패턴을 거부합니다",
  },
  { speaker: "기자", text: "그렇군요" },
];

/** INTERVIEW 02 — 사용자 제공 원문 (수정·축약 없음) */
const INTERVIEW_02_TURNS: readonly { speaker: "기자" | "TONYWANG"; text: string }[] = [
  { speaker: "기자", text: "Skincare 분야는 처음 진출하시는 건가요?" },
  { speaker: "TONYWANG", text: "네 그렇습니다 처음 해보는겁니다" },
  {
    speaker: "기자",
    text: "그동안 어떤 분야를 하시다 skin care 분야을 하게 되신거죠?",
  },
  {
    speaker: "TONYWANG",
    text: "오로지 단백질만 연구를 했어요 식물세포 중심으로 세포 유전자를 변형시켜 변종 단백질을 연구 개발했어요 28년 시간을....",
  },
];

/** 28년 식물세포 유전자 단백질 연구 — 사용자 제공 원문 (수정·축약 없음) */
const INTERVIEW_03_TURNS: readonly { speaker: "기자" | "TONYWANG"; text: string }[] = [
  { speaker: "기자", text: "식물세포유전자 단백질이요?" },
  { speaker: "TONYWANG", text: "네" },
  {
    speaker: "기자",
    text: "식물 세포 유전자 단백질 분야는 생소한데요\n\n바이오 분야에서 생물학제제,생균치료제.줄기세포 등 바이오 시밀러 연구에 관한 것은 익숙한데 식물세포유전자 단백질 분야는 생소 합니다",
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
    text: "그렇군요 그럼 주로 연구한 단백질은 어디에 적용되나요?",
  },
  {
    speaker: "TONYWANG",
    text: "광범위한 파이프라인을 구축 할수 있어요 형질전환(transformation) 하는 과정에서 변이유전자 로 변환 후 목표 질환에 적용되는 단백질을 개발 하는 것입니다",
  },
];

/** 피부 적용과 피부독소 정화 — 사용자 제공 원문 (수정·축약 없음) */
const INTERVIEW_05_TURNS: readonly { speaker: "기자" | "TONYWANG"; text: string }[] = [
  {
    speaker: "TONYWANG",
    text: "피부 적용 분야는 피부 독소균을 제거하여 문제 성 피부 치료에 변혁 작용을 합니다\n\n흑피증 ,노화 피부 . 트러블, 아토피, 모공,이며 가장 큰 목적은 소멸돤 세포를 생성하여 피부를 복원 시키는 목적입니다\n\n피부 문제를 일으키는 주된 요인은 피부 독소 균 입니다",
  },
  {
    speaker: "TONYWANG",
    text: "피부 조직에 기생하는 독소 세균과 화학 성분에 의한 독소 성분을 제거하여 피부를 정화 시키는 목적입니다",
  },
  {
    speaker: "기자",
    text: "tony wang 논리라면 매우 흥미로운 기전 이네요\n\n다른 연구소나 관련 회사들도 식물 세포 유전자 단백질를 연구 개발하나요?",
  },
  {
    speaker: "TONYWANG",
    text: "한국은 이제 조금씩 활성화 되는 추세인 것 같습니다",
  },
  {
    speaker: "TONYWANG",
    text: "유전자와 단백질 연구가 가장 발달한 나라는 미국, 영국, 독일, 일본,이스라엘 등이 대표적입니다. 이들 국가는 유전자 변형(GMO), 품종 개량, 유전체 분석 등 첨단 생명공학 분야에서 선도적 역할을 하고 있습니다.",
  },
];

/** 스킨케어 시장에 진출한 이유는? — 사용자 제공 원문 (수정·축약 없음) */
const INTERVIEW_06_TURNS: readonly { speaker: "기자" | "TONYWANG"; text: string }[] = [
  { speaker: "기자", text: "식물세포유전자단백질 연구만 하신건가요?" },
  { speaker: "TONYWANG", text: "네 단백질 분야만 연구했습니다" },
  {
    speaker: "기자",
    text: "회사의 업무 실적에 대해 간략하게 얘기해주세요",
  },
  {
    speaker: "TONYWANG",
    text: "간단히 말씀드리면 저희가 개발한 유전자 단백질로 피부질환, 노화,",
  },
  {
    speaker: "TONYWANG",
    text: "피부 재생 복원, 문제성 피부, 피부 독소 정화 에 특화된 단백질을 개발했고",
  },
  {
    speaker: "TONYWANG",
    text: "아토피 질환은 4년동안 미국 FDA에 임상가이드라인에 따라 국내 GLP기관하고 임상을 했고 전 임상을 통과했어요 더 이상은 민감한 부분이라 양해 바랍니다",
  },
  {
    speaker: "기자",
    text: "TONYWANG 자료는 인터넷에서 많지 않아여 이유가 있나요?",
  },
  {
    speaker: "TONYWANG",
    text: "각자의 운영스타일 이겠죠 더 중요한 것은 연구소는 연구 개발한 물질로 상업화 하기보단 물질을 기술 수출하여 수익을 발생시키는 구조입니다",
  },
  {
    speaker: "TONYWANG",
    text: "그러다 보니 보안 문제나 민감한 문제가 있어 노출을 꺼리는 부분도 있습니다",
  },
  {
    speaker: "TONYWANG",
    text: "물론 다른 회사는 언론에 자주 노출하여 회사 브랜드를 강화하는 곳도 있습니다",
  },
  {
    speaker: "TONYWANG",
    text: "하지만 저희는 그런 성향이 아닙니다 조용한게 좋아요",
  },
  {
    speaker: "기자",
    text: "흠 그런데 왜 이렇게 늦게 스킨케어로 대중들 앞에 나오게 되었나요? 매우 궁금합니다",
  },
  {
    speaker: "TONYWANG",
    text: "아토피 신약물질로 4년간 임상시험을 하는 과정에서 새롭게 발견된 기전현상을 보게 되었어요\n\n죽은 시험 동물들 피부가 부패 되지 않고 피부가 유지되는 현상을 보게 되었어요",
  },
  {
    speaker: "TONYWANG",
    text: "시체는 썩어야 되는데 부패되지 않고 피부조직 세포가 소멸 되는 않는 것을 보게 되었어요",
  },
  { speaker: "기자", text: "그런 현상이 정말 일어 난건가요?" },
  {
    speaker: "TONYWANG",
    text: "네 그래서 조직을 검사하고 세포를 측정하고 검사한 결과 몇가지 단백질로 인해 발생하는 것을 알게 되었습니다",
  },
  {
    speaker: "TONYWANG",
    text: "그 일이 있고 자꾸 생각나고 머리에서 떠나지 않더군요\n\n기전을 발견하고 머리에서 떠나지 않더군요 아토피가 아닌 얼굴 피부에 적용하면 어떨까?\n\n고민하다 스킨케어 시장을 들여다 보게 됐어요",
  },
  {
    speaker: "TONYWANG",
    text: "무분별하고 무 책임한 표현이 많다는 것을 알게 되었어여",
  },
];

/** 향장학과 바이오의 차이 — 사용자 제공 원문 (수정·축약 없음) */
const INTERVIEW_07_TURNS: readonly { speaker: "기자" | "TONYWANG"; text: string }[] = [
  {
    speaker: "기자",
    text: "그렇군요 하지만 각자의 회사들도 자기 제품이 좋다고 하는건 당연한거 아닌가요?",
  },
  {
    speaker: "기자",
    text: "품질저하 제품이라고 홍보 할수는 없잔아여 열정을 가지고 하는거라 생각합니다",
  },
  { speaker: "기자", text: "그걸 나쁘,다고 할순 없죠" },
  {
    speaker: "TONYWANG",
    text: "맞습니다 하지만 물질의 우수성을 시험기관에서 입증 후 증명한 후 고객에게 표현해야 한다고 봅니다",
  },
  {
    speaker: "기자",
    text: "스킨케어 제품들도 피부 임상을 많이 하는걸로 있어요",
  },
  {
    speaker: "TONYWANG",
    text: "그건 임상이라고 볼수 없습니다\n\n민간 시험 기관에서 적합성 ,안정성 등은 도포 관찰 시험이며 이를 임상이라고 표현하면 안됩니다\n\n물론 기능성 제품에는 식약처 기준에 따라 함량 시험을 해야 합니다\n\n이것은 함량 적정 시험이지 효능 시험은 아닙니다\n\n환자군을 모집하여 식약처 승인을 받고 FDA 임상 표준 가이드라인 에 맞춰 디자인을 짜서 정상적인 임상을 해야 정식 공식임상입니다\n\n공식 임상은 전 임상 비용만 몇 십억이 발생 하고 기간도 최소 2-3년 소요 됩니다",
  },
  {
    speaker: "TONYWANG",
    text: "향장학은 배합의 기술이고 바이오는 새로운 창조의 연구입니다",
  },
  {
    speaker: "TONYWANG",
    text: "우리가 우선이고 향장학은 아니다 라는 말은 절대 아닙니다\n\n다만 차이점을 얘기하는 것 뿐입니다",
  },
  {
    speaker: "기자",
    text: "그렇군요 지금까지 얘기를 들어보면 바이오 특히 식물세포유전자를 다루는 기술에 자부심이 크신 것 같은데 다른 회사들 또한 각자의 자부심으로 기술 개발하여 발전하고자 합니다",
  },
  {
    speaker: "기자",
    text: "TONYWANG만의 연구 개발에 대해 자부심을 느끼나요?",
  },
  {
    speaker: "TONYWANG",
    text: "생각의 차이라 생각해요 향장학은 어려운 분야가 아닙니다",
  },
  {
    speaker: "TONYWANG",
    text: "아까도 말했지만 배합의 기술입니다 하지만 유전자 단백질은 차원이 다릅니다",
  },
  {
    speaker: "TONYWANG",
    text: "창조의 기술입니다 향장학을 가볍게 보지 않습니다 존중합니다",
  },
  {
    speaker: "TONYWANG",
    text: "그렇지만 분야가 다른건 다르다고 해야하지 않을까요?",
  },
  {
    speaker: "TONYWANG",
    text: "피부를 변화 시킬수 있는 물질은 유전자 단백질이 우수하다고 생각합니다",
  },
];

/** TONYWANG의 철학과 앞으로의 계획 — 사용자 제공 원문 (수정·축약 없음) */
const INTERVIEW_08_TURNS: readonly { speaker: "기자" | "TONYWANG"; text: string }[] = [
  {
    speaker: "기자",
    text: "좋은 말씀 감사합니다 끝으로 하실말씀과 앞으로 계획을 얘기해주세요",
  },
  {
    speaker: "TONYWANG",
    text: "계획은 스킨케어 시장에 진출한거 후회하지말기",
  },
  {
    speaker: "TONYWANG",
    text: "천천히 가기 바이오는 입증이다 이 철칙을 버리지 말기",
  },
  {
    speaker: "TONYWANG",
    text: "제품이 입증되면 사용자들로 인해 전파 될것으로 생각합니다",
  },
  {
    speaker: "TONYWANG",
    text: "TONYWANG은 연구실만 운영한 회사입니다 홍보도 모르고 마켓팅 또한 전혀 모릅니다",
  },
  {
    speaker: "TONYWANG",
    text: "결국 모든건 제품의 입증과 우수성이 시장에서 판단을 받고 신뢰를 얻는것이라 생각 합니다",
  },
  {
    speaker: "TONYWANG",
    text: "사용자 고객분들은 거짓말을 하지 않습니다 그들은 뛰어나고 특화된 제품을 애따게 기다리고있습니다 TONYWANG은 그런분들에게 가장 진정성 있는 제품이 되고 싶을 뿐입니다",
  },
  {
    speaker: "기자",
    text: "오랜시간 시간을 내주어 감사합니다 TONYWANG의 발전을 기원하겠습니다",
  },
  { speaker: "TONYWANG", text: "감사합니다" },
];

function IvSpeakerLabel({
  speaker,
  speakerClass,
  elClass,
}: {
  speaker: "기자" | "TONYWANG";
  speakerClass: string;
  elClass: string;
}) {
  return (
    <p className={speakerClass}>
      {speaker === "TONYWANG" ? (
        <span className={elClass}>TONYWANG</span>
      ) : (
        speaker
      )}
    </p>
  );
}

export default function WhyPage() {
  const baseId = useId();
  const [iv01Open, setIv01Open] = useState(false);
  const [iv02Open, setIv02Open] = useState(false);
  const [iv03Open, setIv03Open] = useState(false);
  const [iv04Open, setIv04Open] = useState(false);
  const [iv05Open, setIv05Open] = useState(false);
  const [iv06Open, setIv06Open] = useState(false);
  const [iv07Open, setIv07Open] = useState(false);
  const [iv08Open, setIv08Open] = useState(false);
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
  const panelId06 = `${baseId}-iv06-panel`;
  const headerId06 = `${baseId}-iv06-header`;
  const panelId07 = `${baseId}-iv07-panel`;
  const headerId07 = `${baseId}-iv07-header`;
  const panelId08 = `${baseId}-iv08-panel`;
  const headerId08 = `${baseId}-iv08-header`;

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

  const toggleIv06 = useCallback(() => {
    setIv06Open((v) => !v);
  }, []);

  const toggleIv07 = useCallback(() => {
    setIv07Open((v) => !v);
  }, []);

  const toggleIv08 = useCallback(() => {
    setIv08Open((v) => !v);
  }, []);

  return (
    <div className={styles.whyPage}>
      <section className={styles.whyUnifiedLanding} aria-label="WHY landing">
        <div className={styles.whyUnifiedLandingInner}>
          <div className={styles.whyUnifiedHairline} aria-hidden />
          <div className={styles.whyUnifiedCopy}>
            <h1 className={styles.whyUnifiedHeroTitle}>TONY WANG</h1>
            <h3 className={styles.whyUnifiedSubTitle}>plant cell genetic protein</h3>
            <h2 className={styles.whyUnifiedKoreanTitle}>
              식물 세포 유전자 단백질 연구
            </h2>
            <div className={styles.whyUnifiedDescription}>
              <p>
                What we prove in the lab becomes the structure your skin can trust.
              </p>
              <p>
                Cloning and recombination across different cell DNA, the third structure
                where new cells
                <br />
                assemble new efficacy — documented step by step.
              </p>
              <p>
                Precisely regulate skin cell signal transmission and activate ECM reconstruction
              </p>
            </div>
          </div>
          <div className={styles.whyUnifiedHairline} aria-hidden />
          <div className={styles.whyUnifiedEnding}>
            <h2 className={styles.whyUnifiedEndingTitle}>TONY WANG</h2>
            <p className={styles.whyUnifiedEndingText}>
              I thought about it and made up my mind
            </p>
          </div>
          <div className={styles.whyUnifiedHairline} aria-hidden />
        </div>
      </section>

      <section
        className={`${styles.archiveIntroSection} ${styles.archiveIntroAboveVisual}`}
        aria-label="Archive introduction"
      >
        <div className={styles.archiveIntroInner}>
          <p className={styles.archiveIntroKicker}>WHY ARCHIVE INTRO</p>
          <p className={styles.archiveIntroLead}>
            TONYWANG It tells the story of the past and the remaining time of the journey
          </p>
          <p className={styles.archiveIntroBody}>
            The excellence of material in the values of the study
            <br />
            <br />
            And trust and truth
          </p>
        </div>
      </section>

      <section className={styles.interviewVisualSection}>
        <div className={styles.interviewVisualWrap}>
          <img
            src="/landing-assets/tonywang-interview-archive.jpg"
            width={1600}
            height={900}
            sizes="(max-width: 768px) 92vw, min(980px, 82vw)"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            alt="TONYWANG interview archive"
            className={styles.interviewVisualImage}
          />
        </div>
      </section>

      <section
        className={styles.interviewArchiveNoteSection}
        aria-label="Interview archive note"
      >
        <div className={styles.interviewArchiveNoteInner}>
          <p className={styles.interviewArchiveNoteLead}>
            <span className={styles.elMessiriText}>TONYWANG</span>연구소 연구 개발 및{" "}
            <span className={styles.elMessiriText}>STORY</span> 상품과는 관계가 없습니다
          </p>
          <div className={styles.interviewArchiveNoteHairline} aria-hidden />
          <div className={styles.interviewArchiveNoteBody}>
            <p className={styles.interviewArchiveNoteBodyPara}>
              본문 인터뷰 내용은 제품 홍보 목적이 아님을 밝힙니다
            </p>
            <p className={styles.interviewArchiveNoteBodyPara}>
              <span className={styles.elMessiriText}>TONYWANG</span>연구소 는 과대 홍보로 제품
              판매 를 하지 않습니다
            </p>
            <p className={styles.interviewArchiveNoteBodyPara}>
              상품 가치는 고객이 결정 합니다
            </p>
            <p className={styles.interviewArchiveNoteBodyPara}>
              고객은 <span className={styles.elMessiriText}>Smart</span>하고 중립적인 위치에
              있습니다
            </p>
            <p className={styles.interviewArchiveNoteBodyPara}>
              <span className={styles.elMessiriText}>TONYWANG</span>은 유저을 믿고 신뢰 합니다
            </p>
            <p className={styles.interviewArchiveNoteBodyPara}>
              제품 사용한 유저 만이 <span className={styles.elMessiriText}>TONYWANG</span> 가치를
              세상에 알릴 존재 라는걸 .....
            </p>
          </div>
        </div>
      </section>

      <section
        className={`${styles.archiveSection} ${styles.archivePanel} ${styles.archiveChapters}`}
        aria-label="Interview chapters"
      >
        <article
          className={`${styles.ivItem} ${iv01Open ? styles.ivItemOpen : ""}`}
        >
          <button
            type="button"
            id={headerId}
            className={`${styles.ivTrigger} ${iv01Open ? styles.ivTriggerOpen : ""}`}
            aria-expanded={iv01Open}
            aria-controls={panelId}
            onClick={toggleIv01}
          >
            <span className={styles.ivTriggerRow}>
              <span className={styles.ivTriggerPad} aria-hidden />
              <span className={styles.ivChapterStack}>
                <span className={styles.ivChapterKicker}>INTERVIEW CHAPTER</span>
                <span className={styles.ivChapterTitle}>
                  만남 <span className={styles.elMessiriText}>TONYWANG</span> 그리고...
                </span>
              </span>
              <span className={styles.ivAccordionIcon} aria-hidden>
                {iv01Open ? "\u2212" : "+"}
              </span>
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
              <div
                className={`${styles.ivPanelPad} ${styles.dialogueBody}`}
                aria-hidden={!iv01Open}
              >
                {INTERVIEW_01_TURNS.map((turn, index) => (
                  <div key={`iv01-${index}`} className={styles.ivTurn}>
                    <IvSpeakerLabel
                      speaker={turn.speaker}
                      speakerClass={styles.ivSpeaker}
                      elClass={styles.elMessiriText}
                    />
                    <p className={styles.ivText}>{turn.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article
          className={`${styles.ivItem} ${iv02Open ? styles.ivItemOpen : ""}`}
        >
          <button
            type="button"
            id={headerId02}
            className={`${styles.ivTrigger} ${iv02Open ? styles.ivTriggerOpen : ""}`}
            aria-expanded={iv02Open}
            aria-controls={panelId02}
            onClick={toggleIv02}
          >
            <span className={styles.ivTriggerRow}>
              <span className={styles.ivTriggerPad} aria-hidden />
              <span className={styles.ivChapterStack}>
                <span className={styles.ivChapterKicker}>INTERVIEW CHAPTER</span>
                <span className={styles.ivChapterTitle}>처음 시작한 스킨케어 사업</span>
              </span>
              <span className={styles.ivAccordionIcon} aria-hidden>
                {iv02Open ? "\u2212" : "+"}
              </span>
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
              <div
                className={`${styles.ivPanelPad} ${styles.dialogueBody}`}
                aria-hidden={!iv02Open}
              >
                {INTERVIEW_02_TURNS.map((turn, index) => (
                  <div key={`iv02-${index}`} className={styles.ivTurn}>
                    <IvSpeakerLabel
                      speaker={turn.speaker}
                      speakerClass={styles.ivSpeaker}
                      elClass={styles.elMessiriText}
                    />
                    <p className={styles.ivText}>{turn.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article
          className={`${styles.ivItem} ${iv03Open ? styles.ivItemOpen : ""}`}
        >
          <button
            type="button"
            id={headerId03}
            className={`${styles.ivTrigger} ${iv03Open ? styles.ivTriggerOpen : ""}`}
            aria-expanded={iv03Open}
            aria-controls={panelId03}
            onClick={toggleIv03}
          >
            <span className={styles.ivTriggerRow}>
              <span className={styles.ivTriggerPad} aria-hidden />
              <span className={styles.ivChapterStack}>
                <span className={styles.ivChapterKicker}>INTERVIEW CHAPTER</span>
                <span className={styles.ivChapterTitle}>
                  <span className={styles.elMessiriText}>TONYWANG</span> 유전자 단백질
                </span>
              </span>
              <span className={styles.ivAccordionIcon} aria-hidden>
                {iv03Open ? "\u2212" : "+"}
              </span>
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
              <div
                className={`${styles.ivPanelPad} ${styles.dialogueBody}`}
                aria-hidden={!iv03Open}
              >
                {INTERVIEW_03_TURNS.map((turn, index) => (
                  <div key={`iv03-${index}`} className={styles.ivTurn}>
                    <IvSpeakerLabel
                      speaker={turn.speaker}
                      speakerClass={styles.ivSpeaker}
                      elClass={styles.elMessiriText}
                    />
                    <p className={styles.ivText}>{turn.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article
          className={`${styles.ivItem} ${iv04Open ? styles.ivItemOpen : ""}`}
        >
          <button
            type="button"
            id={headerId04}
            className={`${styles.ivTrigger} ${iv04Open ? styles.ivTriggerOpen : ""}`}
            aria-expanded={iv04Open}
            aria-controls={panelId04}
            onClick={toggleIv04}
          >
            <span className={styles.ivTriggerRow}>
              <span className={styles.ivTriggerPad} aria-hidden />
              <span className={styles.ivChapterStack}>
                <span className={styles.ivChapterKicker}>INTERVIEW CHAPTER</span>
                <span className={styles.ivChapterTitle}>식물세포 유전자 단백질의 원리</span>
              </span>
              <span className={styles.ivAccordionIcon} aria-hidden>
                {iv04Open ? "\u2212" : "+"}
              </span>
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
              <div
                className={`${styles.ivPanelPad} ${styles.dialogueBody}`}
                aria-hidden={!iv04Open}
              >
                {INTERVIEW_04_TURNS.map((turn, index) => (
                  <div key={`iv04-${index}`} className={styles.ivTurn}>
                    <IvSpeakerLabel
                      speaker={turn.speaker}
                      speakerClass={styles.ivSpeaker}
                      elClass={styles.elMessiriText}
                    />
                    <p className={styles.ivText}>{turn.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article
          className={`${styles.ivItem} ${iv05Open ? styles.ivItemOpen : ""}`}
        >
          <button
            type="button"
            id={headerId05}
            className={`${styles.ivTrigger} ${iv05Open ? styles.ivTriggerOpen : ""}`}
            aria-expanded={iv05Open}
            aria-controls={panelId05}
            onClick={toggleIv05}
          >
            <span className={styles.ivTriggerRow}>
              <span className={styles.ivTriggerPad} aria-hidden />
              <span className={styles.ivChapterStack}>
                <span className={styles.ivChapterKicker}>INTERVIEW CHAPTER</span>
                <span className={styles.ivChapterTitle}>
                  피부 독소 균 <span className={styles.elMessiriText}>AND</span> 변혁의 시간
                </span>
              </span>
              <span className={styles.ivAccordionIcon} aria-hidden>
                {iv05Open ? "\u2212" : "+"}
              </span>
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
              <div
                className={`${styles.ivPanelPad} ${styles.dialogueBody}`}
                aria-hidden={!iv05Open}
              >
                {INTERVIEW_05_TURNS.map((turn, index) => (
                  <div key={`iv05-${index}`} className={styles.ivTurn}>
                    <IvSpeakerLabel
                      speaker={turn.speaker}
                      speakerClass={styles.ivSpeaker}
                      elClass={styles.elMessiriText}
                    />
                    <p className={styles.ivText}>{turn.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article
          className={`${styles.ivItem} ${iv06Open ? styles.ivItemOpen : ""}`}
        >
          <button
            type="button"
            id={headerId06}
            className={`${styles.ivTrigger} ${iv06Open ? styles.ivTriggerOpen : ""}`}
            aria-expanded={iv06Open}
            aria-controls={panelId06}
            onClick={toggleIv06}
          >
            <span className={styles.ivTriggerRow}>
              <span className={styles.ivTriggerPad} aria-hidden />
              <span className={styles.ivChapterStack}>
                <span className={styles.ivChapterKicker}>INTERVIEW CHAPTER</span>
                <span className={styles.ivChapterTitle}>스킨케어 시장에 진출한 이유는?</span>
              </span>
              <span className={styles.ivAccordionIcon} aria-hidden>
                {iv06Open ? "\u2212" : "+"}
              </span>
            </span>
            <span className={styles.ivLineTrack} aria-hidden>
              <span className={styles.ivLineFill} />
            </span>
          </button>

          <div
            id={panelId06}
            role="region"
            aria-labelledby={headerId06}
            className={`${styles.ivPanel} ${iv06Open ? styles.ivPanelOpen : ""}`}
          >
            <div className={styles.ivPanelInner}>
              <div
                className={`${styles.ivPanelPad} ${styles.dialogueBody}`}
                aria-hidden={!iv06Open}
              >
                {INTERVIEW_06_TURNS.map((turn, index) => (
                  <div key={`iv06-${index}`} className={styles.ivTurn}>
                    <IvSpeakerLabel
                      speaker={turn.speaker}
                      speakerClass={styles.ivSpeaker}
                      elClass={styles.elMessiriText}
                    />
                    <p className={styles.ivText}>{turn.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article
          className={`${styles.ivItem} ${iv07Open ? styles.ivItemOpen : ""}`}
        >
          <button
            type="button"
            id={headerId07}
            className={`${styles.ivTrigger} ${iv07Open ? styles.ivTriggerOpen : ""}`}
            aria-expanded={iv07Open}
            aria-controls={panelId07}
            onClick={toggleIv07}
          >
            <span className={styles.ivTriggerRow}>
              <span className={styles.ivTriggerPad} aria-hidden />
              <span className={styles.ivChapterStack}>
                <span className={styles.ivChapterKicker}>INTERVIEW CHAPTER</span>
                <span className={styles.ivChapterTitle}>
                  향장학 <span className={styles.elMessiriText}>AND</span>{" "}
                  <span className={styles.elMessiriText}>SELLS</span>
                </span>
              </span>
              <span className={styles.ivAccordionIcon} aria-hidden>
                {iv07Open ? "\u2212" : "+"}
              </span>
            </span>
            <span className={styles.ivLineTrack} aria-hidden>
              <span className={styles.ivLineFill} />
            </span>
          </button>

          <div
            id={panelId07}
            role="region"
            aria-labelledby={headerId07}
            className={`${styles.ivPanel} ${iv07Open ? styles.ivPanelOpen : ""}`}
          >
            <div className={styles.ivPanelInner}>
              <div
                className={`${styles.ivPanelPad} ${styles.dialogueBody}`}
                aria-hidden={!iv07Open}
              >
                {INTERVIEW_07_TURNS.map((turn, index) => (
                  <div key={`iv07-${index}`} className={styles.ivTurn}>
                    <IvSpeakerLabel
                      speaker={turn.speaker}
                      speakerClass={styles.ivSpeaker}
                      elClass={styles.elMessiriText}
                    />
                    <p className={styles.ivText}>{turn.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article
          className={`${styles.ivItem} ${iv08Open ? styles.ivItemOpen : ""}`}
        >
          <button
            type="button"
            id={headerId08}
            className={`${styles.ivTrigger} ${iv08Open ? styles.ivTriggerOpen : ""}`}
            aria-expanded={iv08Open}
            aria-controls={panelId08}
            onClick={toggleIv08}
          >
            <span className={styles.ivTriggerRow}>
              <span className={styles.ivTriggerPad} aria-hidden />
              <span className={styles.ivChapterStack}>
                <span className={styles.ivChapterKicker}>INTERVIEW CHAPTER</span>
                <span className={styles.ivChapterTitle}>여정의 시간</span>
              </span>
              <span className={styles.ivAccordionIcon} aria-hidden>
                {iv08Open ? "\u2212" : "+"}
              </span>
            </span>
            <span className={styles.ivLineTrack} aria-hidden>
              <span className={styles.ivLineFill} />
            </span>
          </button>

          <div
            id={panelId08}
            role="region"
            aria-labelledby={headerId08}
            className={`${styles.ivPanel} ${iv08Open ? styles.ivPanelOpen : ""}`}
          >
            <div className={styles.ivPanelInner}>
              <div
                className={`${styles.ivPanelPad} ${styles.dialogueBody}`}
                aria-hidden={!iv08Open}
              >
                {INTERVIEW_08_TURNS.map((turn, index) => (
                  <div key={`iv08-${index}`} className={styles.ivTurn}>
                    <IvSpeakerLabel
                      speaker={turn.speaker}
                      speakerClass={styles.ivSpeaker}
                      elClass={styles.elMessiriText}
                    />
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
