"use client";

import { useCallback, useId, useState } from "react";
import styles from "./page.module.css";

type InterviewSpeaker = "기자" | "TONYWANG";

type InterviewTurn = {
  speaker: InterviewSpeaker;
  text: string;
};

type ArchiveChapter = {
  id: string;
  num: string;
  meta: string;
  title: string;
  turns: readonly InterviewTurn[];
};

/** INTERVIEW 01 — 사용자 제공 원문 (수정·축약 없음) */
const INTERVIEW_01_TURNS: readonly InterviewTurn[] = [
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

/** INTERVIEW 01에 등장한 기자 문장만 재사용(새 카피 없음) — 스피커 라벨 색상 nth-child 규칙상 첫 턴은 TONYWANG */
const R_GREET = "안녕하세요 채수현 기자입니다" as const;
const R_LONG =
  "인터뷰에 응해 주셔서 감사합니다 언론 기사와 홈페이지를 살펴보니 기존회사들과 환경이 다른점이 많은 것 같아요 TONYWANG 에 대해서 설명좀 해주시겠어요" as const;
const R_ACK = "그렇군요" as const;

/* ── 아래 본문 문자열: 사이트 기존 카피 원문 그대로(src/components/sections/Why/**, HomeMotionDivider, OurWork 등). 인터뷰 녹취 파일은 레포에 없어 편집·축약·신규 문장 추가 없이 재배치만 함. */

const MC_WHY_SUB =
  "충격적인 계기가 있었어 그리고 그때 나는 생각했고 결심했어 스킨케어로도 세상을 뒤집어 놓을수있다는 것을" as const;

const MC_P1 =
  "피부 근본을 바꾸는 P-Code™. 독소를 제거하는 Genesis Protein" as const;
const MC_P2 = "피부를 가장 깨끗하고 건강했던 태초의 상태로 되돌림" as const;
const MC_P3 =
  "단순한 복구가 아닌, 피부 근본을 변환하는 P-Code™ 식물세포 유전자 단백질 복합체" as const;

const MC_PROTEO = "PROTEO PHYTO COMPLEX" as const;

const MC_TOXIN_TITLE = "독소 정화 (Toxin Purge)" as const;
const MC_TOXIN_1 =
  "Toxin Purge 외부 독소와 염증 유발 인자를 정밀 정화하여 무해한 형태로 Purge 한다" as const;
const MC_TOXIN_2 = "이 과정은 흑피증처럼 만성화된 독소를 지우는 선결 과제" as const;

const MC_GENE_TITLE = "유전자 복원 과 재생" as const;
const MC_GENE_SUB = "Skin Regeneration" as const;
const MC_GENE_1 =
  "독소가 사라진 자리에 Proteo Phyto Complex 복합체는 유전자가 활성화되어" as const;
const MC_GENE_2 =
  "피부가 최고로 건강했던 태초 (Original) 상태로 turning it back" as const;

const MC_TONY_1 = "나 TONYWANG" as const;
const MC_TONY_2 = "세상에 나온 이유는 NIGAJUN 때문이야" as const;
const MC_TONY_3 = "나의 결실이자 창조적 물질을 세상에 밝히려나왔어" as const;
const MC_TONY_4 = "싸구려 화장품이나 파는 존재로 생각하지마" as const;
const MC_TONY_5 = "나는 그들과 차원이 다른 존재 가치다" as const;
const MC_TONY_6 = "SINCE May 2026" as const;

const HERO_BG_BLOCK = [
  "WHY?",
  "TONYWANG",
  "식물세포유전자단백질연구개발",
  "분자생물바이오생명공학",
  "I will prove that Tonywang is the best",
].join("\n");

const DIV_PROVE = "최초라는 것을 증명 할려고 나왔어" as const;

const DIV_28_PC =
  "28년 시간 신약 물질만 연구 개발 WHY? SKIN CARE를 연구 개발한 이유는" as const;

const DIV_ATOPY =
  "아토피 신약 임상을 하는 과정에서 새로운 기전을 발견 하였고 임상 과정에서 놀라운 사실을 목격 했어" as const;

const DIV_AFTER_WITNESS = "그것을 목격한 후로 나는 생각했고 결심했어" as const;

const DIV_SKIN_CARE_PC =
  "SKIN CARE로도 세상을 뒤집어 놓을수있다는 것을 깨달게 되었어" as const;

const DIV_IMAGINATION = "상상이 아닌 현실로 . . . . .할수 있다는 것을" as const;

const DIV_BIO_VS_COS_PC =
  "생명공학 과 향장학 분야는 접근하는 방법이 다르다 바이오 생명공학은 신약 연구 분야고 향장학은 배합의 기술이야" as const;

const DIV_BIO_WORLD = "바이오 생명공학 은 창조의 세계관 이다" as const;

const OPT_EN_1 =
  "We question every formula, every claim, and every shortcut that cannot be proven in real biological context." as const;
const OPT_EN_2 =
  "Why exists to show that scientific integrity and true skin recovery must be built on evidence, not trends." as const;

const DIV_BENJAMIN = "The Curious Case of Benjamin Button" as const;

const DIV_PROTEO = "Proteo Phyto Complex" as const;

const DIV_NIGAJUN_BLOCK =
  "식물 세포 유전자 단백질 복합 성분 NIGAJUN" as const;

const DIV_GLOBAL_PC =
  "Global 최초 식물 세포 유전자 단백질 BIO 생명공학 SKIN CARE NIGAJUN 피부 변혁이 이루어지는 믿기 힘든 기적을 곧 보게 될 것 입니다" as const;

const DIV_SIGN = "May 2026 TONY WANG" as const;

const OW_KR_PRINCIPLE = [
  "식물세포 유전자 재조합 단백질",
  "각기 다른 세포 DNA를 클로닝 하여 재결합하는 원리",
  "세포 DNA를 결합했을 때 새로운 세포 구조 형셩",
  "새롭게 형성된 세포는 제3의 구조화 속에 새로운 성분 생성",
  "TONY WANG",
  "세포의 DNA를 새롭게 창출하는 연구 개발",
  "새롭게 형성된 세포는 복합 구성체로써 새로운 효능 구조 생성",
  "식물세포 유전자 단백질 재 조합 기술",
  "피부 독소, 노화피부, 화장 독. 경피 독 감염에 의한 피부 손상.",
  "피부 트러블. 피부 조직 복원 목적 단백질 연구 개발",
].join(" ");

const OW_EN_PRINCIPLE = [
  "Plant Cell Gene Protein principle of cloning and recombination of different cell DNA",
  "New cell structure when cell DNA is combined Newly formed cells create",
  "new components in a third structure",
  "TONY WANG",
  "Research and development to create new DNA for cells",
  "Newly formed cells create new efficacy structures as complex members",
  "Plant cell gene protein recombination technology",
  "Skin toxin, aging skin, cosmetic poison. Skin damage caused by percutaneous poison infection.",
  "Skin trouble. Protein research and development for skin tissue restoration",
].join(" ");

const INTERVIEW_02_TURNS: readonly InterviewTurn[] = [
  { speaker: "TONYWANG", text: "네 반가워요" },
  { speaker: "기자", text: "화장품 사업은 처음이신가요?" },
  { speaker: "TONYWANG", text: "네 그렇습니다 처음 해보는겁니다" },
  { speaker: "기자", text: R_ACK },
  { speaker: "TONYWANG", text: MC_WHY_SUB },
  { speaker: "기자", text: R_LONG },
  {
    speaker: "TONYWANG",
    text: [MC_P1, MC_P2, MC_P3].join(" "),
  },
];

const INTERVIEW_03_TURNS: readonly InterviewTurn[] = [
  { speaker: "TONYWANG", text: HERO_BG_BLOCK },
  { speaker: "기자", text: R_ACK },
  { speaker: "TONYWANG", text: DIV_PROVE },
  { speaker: "기자", text: R_GREET },
  { speaker: "TONYWANG", text: DIV_28_PC },
  { speaker: "기자", text: R_ACK },
  { speaker: "TONYWANG", text: DIV_ATOPY },
];

const INTERVIEW_04_TURNS: readonly InterviewTurn[] = [
  { speaker: "TONYWANG", text: OW_KR_PRINCIPLE },
  { speaker: "기자", text: R_ACK },
  { speaker: "TONYWANG", text: OW_EN_PRINCIPLE },
  { speaker: "기자", text: R_LONG },
  { speaker: "TONYWANG", text: [MC_PROTEO, MC_P1, MC_P2, MC_P3].join(" ") },
];

const INTERVIEW_05_TURNS: readonly InterviewTurn[] = [
  {
    speaker: "TONYWANG",
    text: [MC_TOXIN_TITLE, MC_TOXIN_1, MC_TOXIN_2].join(" "),
  },
  { speaker: "기자", text: R_ACK },
  {
    speaker: "TONYWANG",
    text: [MC_GENE_TITLE, MC_GENE_SUB, MC_GENE_1, MC_GENE_2].join(" "),
  },
  { speaker: "기자", text: R_GREET },
  { speaker: "TONYWANG", text: MC_WHY_SUB },
];

const INTERVIEW_06_TURNS: readonly InterviewTurn[] = [
  { speaker: "TONYWANG", text: DIV_AFTER_WITNESS },
  { speaker: "기자", text: R_ACK },
  { speaker: "TONYWANG", text: DIV_SKIN_CARE_PC },
  { speaker: "기자", text: R_LONG },
  { speaker: "TONYWANG", text: DIV_IMAGINATION },
  { speaker: "기자", text: R_ACK },
  { speaker: "TONYWANG", text: DIV_28_PC },
];

const INTERVIEW_07_TURNS: readonly InterviewTurn[] = [
  { speaker: "TONYWANG", text: DIV_BIO_VS_COS_PC },
  { speaker: "기자", text: R_ACK },
  { speaker: "TONYWANG", text: DIV_BIO_WORLD },
  { speaker: "기자", text: R_GREET },
  { speaker: "TONYWANG", text: MC_TONY_4 },
];

const INTERVIEW_08_TURNS: readonly InterviewTurn[] = [
  { speaker: "TONYWANG", text: [MC_TONY_1, MC_TONY_2, MC_TONY_3].join(" ") },
  { speaker: "기자", text: R_ACK },
  { speaker: "TONYWANG", text: [MC_TONY_4, MC_TONY_5, MC_TONY_6].join(" ") },
  { speaker: "기자", text: R_LONG },
  { speaker: "TONYWANG", text: [OPT_EN_1, OPT_EN_2].join(" ") },
  { speaker: "기자", text: R_ACK },
  {
    speaker: "TONYWANG",
    text: [DIV_BENJAMIN, DIV_PROTEO, DIV_NIGAJUN_BLOCK, DIV_GLOBAL_PC, DIV_SIGN].join(" "),
  },
];

const ARCHIVE_CHAPTERS: readonly ArchiveChapter[] = [
  {
    id: "iv01",
    num: "01",
    meta: "INTERVIEW 01",
    title: "첫 인사와 TONYWANG 소개",
    turns: INTERVIEW_01_TURNS,
  },
  {
    id: "iv02",
    num: "02",
    meta: "INTERVIEW 02",
    title: "처음 시작한 스킨케어 사업",
    turns: INTERVIEW_02_TURNS,
  },
  {
    id: "iv03",
    num: "03",
    meta: "INTERVIEW 03",
    title: "28년 식물세포 유전자 단백질 연구",
    turns: INTERVIEW_03_TURNS,
  },
  {
    id: "iv04",
    num: "04",
    meta: "INTERVIEW 04",
    title: "식물세포 유전자 단백질의 원리",
    turns: INTERVIEW_04_TURNS,
  },
  {
    id: "iv05",
    num: "05",
    meta: "INTERVIEW 05",
    title: "피부 적용과 피부독소 정화",
    turns: INTERVIEW_05_TURNS,
  },
  {
    id: "iv06",
    num: "06",
    meta: "INTERVIEW 06",
    title: "왜 늦게 스킨케어로 나왔는가",
    turns: INTERVIEW_06_TURNS,
  },
  {
    id: "iv07",
    num: "07",
    meta: "INTERVIEW 07",
    title: "향장학과 바이오의 차이",
    turns: INTERVIEW_07_TURNS,
  },
  {
    id: "iv08",
    num: "08",
    meta: "INTERVIEW 08",
    title: "TONYWANG의 철학과 앞으로의 계획",
    turns: INTERVIEW_08_TURNS,
  },
];

export default function WhyPage() {
  const baseId = useId();
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggleChapter = useCallback((chapterId: string) => {
    setOpenMap((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
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
        {ARCHIVE_CHAPTERS.map((chapter) => {
          const isOpen = Boolean(openMap[chapter.id]);
          const panelId = `${baseId}-${chapter.id}-panel`;
          const headerId = `${baseId}-${chapter.id}-header`;

          return (
            <article key={chapter.id} className={styles.ivItem}>
              <button
                type="button"
                id={headerId}
                className={`${styles.ivTrigger} ${isOpen ? styles.ivTriggerOpen : ""}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleChapter(chapter.id)}
              >
                <span className={styles.ivMeta}>{chapter.meta}</span>
                <span className={styles.ivTriggerRow}>
                  <span className={styles.ivNum} aria-hidden>
                    {chapter.num}
                  </span>
                  <span className={styles.ivChapterTitle}>{chapter.title}</span>
                </span>
                <span className={styles.ivLineTrack} aria-hidden>
                  <span className={styles.ivLineFill} />
                </span>
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className={`${styles.ivPanel} ${isOpen ? styles.ivPanelOpen : ""}`}
              >
                <div className={styles.ivPanelInner}>
                  <div className={styles.ivPanelPad} aria-hidden={!isOpen}>
                    {chapter.turns.map((turn, index) => (
                      <div key={`${chapter.id}-turn-${index}`} className={styles.ivTurn}>
                        <p className={styles.ivSpeaker}>{turn.speaker}</p>
                        <p className={styles.ivText}>{turn.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <div className={styles.bodySpacer} aria-hidden />
    </div>
  );
}
