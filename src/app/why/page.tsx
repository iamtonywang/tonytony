import InterviewChaptersClient from "./_components/InterviewChaptersClient";
import styles from "./page.module.css";
import { renderEnglishMessiriLine } from "./whyCopy";

export default function WhyPage() {
  return (
    <div className={styles.whyPage}>
      <section className={styles.whyUnifiedLanding} aria-label="WHY landing">
        <div className={styles.whyUnifiedLandingInner}>
          <div className={styles.whyUnifiedHairline} aria-hidden />
          <div className={styles.whyUnifiedCopy}>
            <h1 className={styles.whyUnifiedHeroTitle}>
              <span className={styles.elMessiriText}>TONY WANG</span>
            </h1>
            <h3 className={styles.whyUnifiedSubTitle}>
              <span className={styles.elMessiriText}>plant cell genetic protein</span>
            </h3>
            <h2 className={styles.whyUnifiedKoreanTitle}>
              식물 세포 유전자 단백질 연구
            </h2>
            <div className={styles.whyUnifiedDescription}>
              <p>
                {renderEnglishMessiriLine(
                  "What we prove in the lab becomes the structure your skin can trust.",
                  "landing-d0",
                )}
              </p>
              <p>
                {renderEnglishMessiriLine(
                  "Cloning and recombination across different cell DNA, the third structure where new cells",
                  "landing-d1a",
                )}
                <br />
                {renderEnglishMessiriLine(
                  "assemble new efficacy — documented step by step.",
                  "landing-d1b",
                )}
              </p>
              <p>
                {renderEnglishMessiriLine(
                  "Precisely regulate skin cell signal transmission and activate ECM reconstruction",
                  "landing-d2",
                )}
              </p>
            </div>
          </div>
          <div className={styles.whyUnifiedHairline} aria-hidden />
          <div className={styles.whyUnifiedEnding}>
            <h2 className={styles.whyUnifiedEndingTitle}>
              <span className={styles.elMessiriText}>TONY WANG</span>
            </h2>
            <p className={styles.whyUnifiedEndingText}>
              {renderEnglishMessiriLine("I thought about it and made up my mind", "landing-end")}
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
          <p className={styles.archiveIntroKicker}>
            <span className={styles.elMessiriText}>WHY ARCHIVE INTRO</span>
          </p>
          <p className={styles.archiveIntroLead}>
            {renderEnglishMessiriLine(
              "TONYWANG It tells the story of the past and the remaining time of the journey",
              "archive-lead",
            )}
          </p>
          <p className={styles.archiveIntroBody}>
            {renderEnglishMessiriLine(
              "The excellence of material in the values of the study",
              "archive-body-a",
            )}
            <br />
            <br />
            {renderEnglishMessiriLine("And trust and truth", "archive-body-b")}
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
        className={styles.interviewArchiveHeadlineSection}
        aria-label="Archive editorial headline"
      >
        <div className={styles.interviewArchiveHeadlineInner}>
          <p className={styles.interviewArchiveHeadlineKicker}>
            <span className={styles.elMessiriText}>WHY ARCHIVE INTRO</span>
          </p>
          <p className={styles.interviewArchiveHeadlineTitle}>
            {renderEnglishMessiriLine(
              "TONYWANG연구소 연구 개발 및 STORY",
              "archive-headline",
            )}
          </p>
        </div>
      </section>

      <section
        className={styles.interviewArchiveNoteSection}
        aria-label="Interview archive note"
      >
        <div className={styles.interviewArchiveNoteInner}>
          <div className={styles.interviewArchiveNoteHairline} aria-hidden />
          <div className={styles.interviewArchiveNoteBody}>
            <p className={styles.interviewArchiveNoteBodyPara}>
              본문 인터뷰 내용은 제품 홍보 목적이 아님을 밝힙니다
            </p>
            <p className={styles.interviewArchiveNoteBodyPara}>
              {renderEnglishMessiriLine(
                "TONYWANG연구소 는 과대 홍보로 제품 판매 를 하지 않습니다",
                "archive-note-p1",
              )}
            </p>
            <p className={styles.interviewArchiveNoteBodyPara}>
              상품 가치는 고객이 결정 합니다
            </p>
          </div>
          <div className={styles.interviewArchiveNoteBreakVisual}>
            <img
              src="/landing-assets/why-note-break-visual-01.webp"
              alt=""
              width={1600}
              height={639}
              className={styles.interviewArchiveNoteBreakVisualImage}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
          <div className={styles.interviewArchiveNoteBody}>
            <p className={styles.interviewArchiveNoteBodyPara}>
              {renderEnglishMessiriLine(
                "고객은 Smart하고 중립적인 위치에 있습니다",
                "archive-note-p4",
              )}
            </p>
            <p className={styles.interviewArchiveNoteBodyPara}>
              {renderEnglishMessiriLine("TONYWANG은 유저을 믿고 신뢰 합니다", "archive-note-p5")}
            </p>
            <p className={styles.interviewArchiveNoteBodyPara}>
              {renderEnglishMessiriLine(
                "제품 사용한 유저 만이 TONYWANG 가치를 세상에 알릴 존재 라는걸 .....",
                "archive-note-p6",
              )}
            </p>
          </div>
        </div>
      </section>

      <InterviewChaptersClient />

      <div className={styles.bodySpacer} aria-hidden />
      <div className={styles.footerClosingNote}>
        <p className={styles.footerClosingNotePara}>
          The value of the product is determined by the customer
        </p>
        <p className={styles.footerClosingNotePara}>
          The customer is in a smart and neutral position
        </p>
        <p className={styles.footerClosingNotePara}>
          TONYWANG trusts and trusts users
        </p>
        <p className={styles.footerClosingNotePara}>
          Only the users who used the product will know the value of TONYWANG to the world...
        </p>
        <p
          className={`${styles.footerClosingNotePara} ${styles.footerClosingSignature}`}
        >
          May 2026 TONY WANG
        </p>
      </div>
      <div className={styles.footerBoundaryLine} aria-hidden />
    </div>
  );
}
