"use client";

import { useCallback, useId, useState } from "react";
import styles from "./page.module.css";

/**
 * Verbatim strings from Why stack (MainContentSection, HeroSection, OptionalSection).
 * Reporter prompts are editorial framing only; TONYWANG lines are copied without edits.
 */

const SEO_TITLE = "TONYWANG";

const SEO_LINES = [
  "Research Development Plant Cell Gene Protein",
  "Molecular Bio-Bioengineering for verified skin innovation",
  "WHY asks one question: what is truly proven and truly valuable?",
] as const;

const BACKGROUND_LINES = [
  "WHY?",
  "TONYWANG",
  "식물세포유전자단백질연구개발",
  "분자생물바이오생명공학",
  "I will prove that Tonywang is the best",
] as const;

const WHY_SUBTEXT =
  "충격적인 계기가 있었어 그리고 그때 나는 생각했고 결심했어 스킨케어로도 세상을 뒤집어 놓을수있다는 것을";

const P_CODE_HEAD = "P-Code™";

const P_CODE_LINES = [
  "피부 근본을 바꾸는 P-Code™. 독소를 제거하는 Genesis Protein",
  "피부를 가장 깨끗하고 건강했던 태초의 상태로 되돌림",
  "단순한 복구가 아닌, 피부 근본을 변환하는 P-Code™ 식물세포 유전자 단백질 복합체",
] as const;

const PROTEO_LINE = "PROTEO PHYTO COMPLEX";

const TOXIN_TITLE = "독소 정화 (Toxin Purge)";

const TOXIN_LINES = [
  "Toxin Purge 외부 독소와 염증 유발 인자를 정밀 정화하여 무해한 형태로 Purge 한다",
  "이 과정은 흑피증처럼 만성화된 독소를 지우는 선결 과제",
] as const;

const GENE_TITLE = "유전자 복원 과 재생";

const GENE_SUB = "Skin Regeneration";

const GENE_LINES = [
  "독소가 사라진 자리에 Proteo Phyto Complex 복합체는 유전자가 활성화되어",
  "피부가 최고로 건강했던 태초 (Original) 상태로 turning it back",
] as const;

const TONY_LINES = [
  "나 TONYWANG",
  "세상에 나온 이유는 NIGAJUN 때문이야",
  "나의 결실이자 창조적 물질을 세상에 밝히려나왔어",
  "싸구려 화장품이나 파는 존재로 생각하지마",
  "나는 그들과 차원이 다른 존재 가치다",
  "SINCE May 2026",
] as const;

const WHY_MOTION_LINES = [
  "TONY WANG",
  "I found it",
  "Benjamin Burton",
  "Telomere",
  "rewind the clock",
  "28 years of cell research",
  "I found it",
  "I got it",
  "I made it my own",
  "Creation",
  "You have to go crazy",
  "so",
  "I can have it",
  "anyone",
  "at least once",
  "Success",
  "Failed",
  "I experienced it",
  "Okay.",
  "This is life",
  "Sigh",
  "Tears",
  "And",
  "a throbbing pain",
  "Let's overcome it",
  "to be able to get",
  "SINCE May 2026",
] as const;

const OPTIONAL_BLOCK = [
  "TONYWANG",
  "Why",
  "We question every formula, every claim, and every shortcut that cannot be proven in real biological context.",
  "Why exists to show that scientific integrity and true skin recovery must be built on evidence, not trends.",
].join("\n\n");

type Exchange = {
  reporter: string;
  tonywang: string;
  manifesto?: boolean;
};

type InterviewChapter = {
  id: string;
  meta: string;
  num: string;
  title: string;
  exchanges: Exchange[];
};

const CHAPTERS: InterviewChapter[] = [
  {
    id: "iv-01",
    meta: "INTERVIEW 01",
    num: "01",
    title: "TONYWANG은 누구인가",
    exchanges: [
      {
        reporter:
          "기록으로 남기고 싶은 브랜드의 기술 정의와 질문의 초점을, 원문 그대로 적어 주십시오.",
        tonywang: [SEO_TITLE, ...SEO_LINES].join("\n"),
      },
      {
        reporter:
          "연구실이 외부에 걸어두고 싶은 문장과 선언을 그대로 옮겨 주십시오.",
        tonywang: BACKGROUND_LINES.join("\n"),
      },
    ],
  },
  {
    id: "iv-02",
    meta: "INTERVIEW 02",
    num: "02",
    title: "왜 스킨케어 시장에 왔는가",
    exchanges: [
      {
        reporter:
          "스킨케어를 선택하게 된 계기와 결심을, 당시 말씀을 그대로 전달해 주십시오.",
        tonywang: WHY_SUBTEXT,
      },
    ],
  },
  {
    id: "iv-03",
    meta: "INTERVIEW 03",
    num: "03",
    title: "식물세포 유전자 단백질",
    exchanges: [
      {
        reporter: "핵심 코드 네이밍을 원문 그대로 적어 주십시오.",
        tonywang: P_CODE_HEAD,
      },
      {
        reporter:
          "P-Code™가 피부에 대해 말하는 세 문장을, 편집 없이 이어 주십시오.",
        tonywang: P_CODE_LINES.join("\n\n"),
      },
      {
        reporter: "복합체의 공식 명칭을 그대로 밝혀 주십시오.",
        tonywang: PROTEO_LINE,
      },
      {
        reporter: "독소 정화 단계의 제목과 설명을 원문 순서대로 전달해 주십시오.",
        tonywang: [TOXIN_TITLE, "", ...TOXIN_LINES].join("\n"),
      },
      {
        reporter:
          "유전자 복원·재생 블록의 제목, 부제, 본문을 편집 없이 이어 주십시오.",
        tonywang: [GENE_TITLE, "", GENE_SUB, "", ...GENE_LINES].join("\n"),
      },
    ],
  },
  {
    id: "iv-04",
    meta: "INTERVIEW 04",
    num: "04",
    title: "28년 연구",
    exchanges: [
      {
        reporter:
          "영상 위에 올라가는 문장들을, 등장 순서를 바꾸지 않고 그대로 옮겨 주십시오.",
        tonywang: WHY_MOTION_LINES.join("\n"),
      },
    ],
  },
  {
    id: "iv-05",
    meta: "INTERVIEW 05",
    num: "05",
    title: "TONYWANG 철학",
    exchanges: [
      {
        reporter:
          "브랜드의 선언을 한 줄씩, 원문을 잃지 않고 순서대로 전달해 주십시오.",
        tonywang: TONY_LINES.join("\n\n"),
        manifesto: true,
      },
      {
        reporter:
          "페이지 하단에 남겨둔 문단과 호칭을, 줄바꿈을 포함해 그대로 옮겨 주십시오.",
        tonywang: OPTIONAL_BLOCK,
        manifesto: true,
      },
    ],
  },
];

const LANDING_IMAGE_SRC = "/landing-assets/home-hero-main-clean-pc.webp";

export default function WhyPage() {
  const baseId = useId();
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggle = useCallback((id: string) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <div className={styles.whyRoot}>
      <div className={styles.whyInner}>
        <div className={styles.hairline} aria-hidden />

        <header className={styles.landing}>
          <div className={styles.landingFrame}>
            <div className={styles.landingMedia}>
              <img
                className={styles.landingImg}
                src={LANDING_IMAGE_SRC}
                alt="TONYWANG why visual"
                draggable={false}
              />
              <div className={styles.landingOverlay}>
                <p className={styles.landingKicker}>Archive landing</p>
                <p className={styles.landingBrand}>TONY WANG</p>
                <p className={styles.landingTag}>Plant cell · Gene protein · BIO</p>
              </div>
            </div>
          </div>
        </header>

        <section className={styles.intro} aria-labelledby={`${baseId}-intro-h`}>
          <p className={styles.introLabel}>WHY ARCHIVE INTRO</p>
          <h1 id={`${baseId}-intro-h`} className={styles.introTitle}>
            인터뷰 원문을 축약하지 않고, 타이포그래피와 여백으로 읽히게 정리한
            아카이브입니다.
          </h1>
          <div className={styles.introBody}>
            <p>
              각 인터뷰는 닫힌 상태로 시작하며, 열람 시 천천히 본문이 드러납니다.
              기자의 질문은 구획을 돕기 위한 최소한의 프레이밍이며, TONYWANG의
              문장은 기존 페이지에 실려 있던 표현을 그대로 보존합니다.
            </p>
          </div>
        </section>

        <section
          className={styles.archive}
          aria-label="Interview archive"
        >
          {CHAPTERS.map((chapter) => {
            const isOpen = Boolean(openMap[chapter.id]);
            const panelId = `${baseId}-panel-${chapter.id}`;
            const headerId = `${baseId}-hdr-${chapter.id}`;

            return (
              <article key={chapter.id} className={styles.accItem}>
                <button
                  type="button"
                  id={headerId}
                  className={`${styles.accTrigger} ${isOpen ? styles.accTriggerOpen : ""}`}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(chapter.id)}
                >
                  <span className={styles.accTriggerMeta}>{chapter.meta}</span>
                  <span className={styles.accTriggerRow}>
                    <span className={styles.accBigNum} aria-hidden>
                      {chapter.num}
                    </span>
                    <span className={styles.accChapterTitle}>{chapter.title}</span>
                  </span>
                  <span className={styles.accLineTrack} aria-hidden>
                    <span className={styles.accLineFill} />
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className={`${styles.accPanel} ${isOpen ? styles.accPanelOpen : ""}`}
                >
                  <div className={styles.accPanelInner}>
                    <div className={styles.accPanelPad} aria-hidden={!isOpen}>
                      {chapter.exchanges.map((ex, idx) => (
                        <div key={`${chapter.id}-ex-${idx}`} className={styles.exchange}>
                          <p className={styles.labelReporter}>[기자]</p>
                          <p className={styles.reporter}>{ex.reporter}</p>
                          <p className={styles.labelTony}>[TONYWANG]</p>
                          <p
                            className={`${styles.tony} ${ex.manifesto ? styles.tonyManifesto : ""}`}
                          >
                            {ex.tonywang}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
