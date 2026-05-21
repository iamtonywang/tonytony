"use client";

import { useCallback, useId, useState } from "react";

import { INTERVIEW_CHAPTERS } from "../_data/interviewChapters";
import styles from "../page.module.css";
import {
  IvSpeakerLabel,
  renderEnglishMessiriLine,
  renderIvTextMessiri,
} from "../whyCopy";

const INITIAL_OPEN = [false, false, false, false, false, false, false, false] as const;

export default function InterviewChaptersClient() {
  const baseId = useId();
  const [openStates, setOpenStates] = useState<boolean[]>([...INITIAL_OPEN]);

  const toggleChapter = useCallback((index: number) => {
    setOpenStates((prev) => prev.map((v, i) => (i === index ? !v : v)));
  }, []);

  return (
    <section
      className={`${styles.archiveSection} ${styles.archivePanel} ${styles.archiveChapters}`}
      aria-label="Interview chapters"
    >
      {INTERVIEW_CHAPTERS.map((chapter, chapterIndex) => {
        const isOpen = openStates[chapterIndex] ?? false;
        const headerId = `${baseId}-iv${chapter.num}-header`;
        const panelId = `${baseId}-iv${chapter.num}-panel`;
        const ivKey = `iv${chapter.num}`;

        return (
          <article
            key={chapter.num}
            className={`${styles.ivItem} ${isOpen ? styles.ivItemOpen : ""}`}
          >
            <button
              type="button"
              id={headerId}
              className={`${styles.ivTrigger} ${isOpen ? styles.ivTriggerOpen : ""}`}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleChapter(chapterIndex)}
            >
              <span className={styles.ivTriggerRow}>
                <span className={styles.ivTriggerPad} aria-hidden />
                <span className={styles.ivChapterStack}>
                  <span className={styles.ivChapterKicker}>
                    <span className={styles.elMessiriText}>INTERVIEW CHAPTER</span>
                  </span>
                  <span className={styles.ivChapterTitle}>
                    {renderEnglishMessiriLine(chapter.title, chapter.titleKey)}
                  </span>
                </span>
                <span className={styles.ivAccordionIcon} aria-hidden>
                  {isOpen ? "\u2212" : "+"}
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
              className={`${styles.ivPanel} ${isOpen ? styles.ivPanelOpen : ""}`}
            >
              <div className={styles.ivPanelInner}>
                <div
                  className={`${styles.ivPanelPad} ${styles.dialogueBody}`}
                  aria-hidden={!isOpen}
                >
                  {chapter.turns.map((turn, index) => (
                    <div key={`${ivKey}-${index}`} className={styles.ivTurn}>
                      <IvSpeakerLabel
                        speaker={turn.speaker}
                        speakerClass={styles.ivSpeaker}
                        elClass={styles.elMessiriText}
                      />
                      <p className={styles.ivText}>
                        {renderIvTextMessiri(turn.text, ivKey, index)}
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
  );
}
