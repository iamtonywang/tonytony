import HomeMotionLine from "@/components/sections/HomeMotionLine/HomeMotionLine";
import styles from "./page.module.css";

type InterviewTurn = {
  interviewer: string;
  tonywang: string;
};

type Chapter = {
  id: string;
  title: string;
  interviews: InterviewTurn[];
};

/**
 * WHY 인터뷰 아카이브 — 8개 챕터 메타 + (기자 / TONYWANG) 쌍 배열.
 * 저장소에 전체 녹취 원문이 없어, 대부분의 interviews는 비어 있습니다.
 * 원문 확보 시 챕터 범위에 맞춰 interviews만 채우면 됩니다(축약·문장 수정 금지).
 *
 * 아래 한 쌍은 이전 요청 본문에 포함된 예시 문구를 그대로 둔 것입니다.
 */
const chapters: Chapter[] = [
  {
    id: "01",
    title: "첫 인사와 TONYWANG 소개",
    interviews: [],
  },
  {
    id: "02",
    title: "처음 시작한 스킨케어 사업",
    interviews: [
      {
        interviewer: "화장품 사업은 처음이신가요?",
        tonywang: "네 그렇습니다 처음 해보는겁니다",
      },
    ],
  },
  {
    id: "03",
    title: "28년 식물세포 유전자 단백질 연구",
    interviews: [],
  },
  {
    id: "04",
    title: "식물세포 유전자 단백질의 원리",
    interviews: [],
  },
  {
    id: "05",
    title: "피부 적용과 피부독소 정화",
    interviews: [],
  },
  {
    id: "06",
    title: "왜 늦게 스킨케어로 나왔는가",
    interviews: [],
  },
  {
    id: "07",
    title: "향장학과 바이오의 차이",
    interviews: [],
  },
  {
    id: "08",
    title: "TONYWANG의 철학과 앞으로의 계획",
    interviews: [],
  },
];

export default function WhyPage() {
  return (
    <div className={styles.whyPage}>
      <HomeMotionLine />

      <section
        className={styles.archive}
        aria-label="WHY 인터뷰 아카이브"
      >
        {chapters.map((chapter) => (
          <details key={chapter.id} className={styles.chapter}>
            <summary className={styles.chapterSummary}>
              <span className={styles.chapterId}>{chapter.id}</span>
              <span className={styles.chapterTitle}>{chapter.title}</span>
            </summary>

            <div className={styles.chapterBody}>
              {chapter.interviews.map((row, index) => (
                <div
                  key={`${chapter.id}-${index}`}
                  className={styles.interviewBlock}
                >
                  <p className={styles.roleLabel}>기자</p>
                  <p className={styles.interviewer}>{row.interviewer}</p>
                  <p className={styles.roleLabel}>TONYWANG</p>
                  <p className={styles.tonywang}>{row.tonywang}</p>
                </div>
              ))}
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}
