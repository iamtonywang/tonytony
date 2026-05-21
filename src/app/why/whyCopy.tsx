import { Fragment, type ReactNode } from "react";

import styles from "./page.module.css";

function isLatinWordChar(ch: string): boolean {
  return /[A-Za-z0-9._\-™®%‰+’'’]/.test(ch);
}

function isLatinParenInner(inner: string): boolean {
  if (!inner.trim()) return false;
  if (/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(inner)) return false;
  return /^[A-Za-z0-9.,\s/_\-™®%+:]+$/u.test(inner.trim());
}

function consumeLatinPhrase(text: string, start: number): [string, number] | null {
  if (start >= text.length || !/[A-Za-z]/.test(text[start])) return null;

  let j = start + 1;
  while (j < text.length && isLatinWordChar(text[j])) {
    j++;
  }
  let end = j;

  for (;;) {
    let k = end;
    while (k < text.length && (text[k] === " " || text[k] === "\t")) {
      k++;
    }
    if (k >= text.length) break;
    if (/[A-Za-z]/.test(text[k])) {
      let m = k + 1;
      while (m < text.length && isLatinWordChar(text[m])) {
        m++;
      }
      end = m;
      continue;
    }

    let d = k;
    if (
      d < text.length &&
      (text[d] === "\u2014" || text[d] === "\u2013" || text[d] === "-" || text[d] === "/")
    ) {
      d++;
      while (d < text.length && (text[d] === " " || text[d] === "\t")) {
        d++;
      }
      if (d < text.length && /[A-Za-z]/.test(text[d])) {
        let m = d + 1;
        while (m < text.length && isLatinWordChar(text[m])) {
          m++;
        }
        end = m;
        continue;
      }
    }

    break;
  }

  return [text.slice(start, end), end];
}

/** Wrap exposed Latin / English fragments in WHY copy with El Messiri (한글 원문 문자열 불변). */
export function renderEnglishMessiriLine(text: string, keySeed: string): ReactNode {
  const out: ReactNode[] = [];
  let part = 0;
  let i = 0;

  const pushPlain = (s: string): void => {
    if (!s) return;
    out.push(<Fragment key={`${keySeed}-p-${part++}`}>{s}</Fragment>);
  };

  while (i < text.length) {
    if (
      text[i] === "(" &&
      i + 1 < text.length &&
      /[A-Za-z]/.test(text[i + 1])
    ) {
      const close = text.indexOf(")", i + 1);
      if (close !== -1) {
        const inner = text.slice(i + 1, close);
        if (isLatinParenInner(inner)) {
          pushPlain("(");
          out.push(
            <span key={`${keySeed}-e-${part++}`} className={styles.elMessiriText}>
              {inner}
            </span>,
          );
          pushPlain(")");
          i = close + 1;
          continue;
        }
      }
    }

    const run = consumeLatinPhrase(text, i);
    if (run) {
      const [segment, next] = run;
      out.push(
        <span key={`${keySeed}-e-${part++}`} className={styles.elMessiriText}>
          {segment}
        </span>,
      );
      i = next;
      continue;
    }

    let j = i + 1;
    while (
      j < text.length &&
      !/[A-Za-z]/.test(text[j]) &&
      !(text[j] === "(" && j + 1 < text.length && /[A-Za-z]/.test(text[j + 1]))
    ) {
      j++;
    }
    pushPlain(text.slice(i, j));
    i = j;
  }

  return <>{out}</>;
}

export function renderIvTextMessiri(text: string, ivKey: string, turnIdx: number): ReactNode {
  const lines = text.split("\n");
  return lines.map((line, li) => (
    <Fragment key={`${ivKey}-nl-${turnIdx}-${li}`}>
      {li > 0 ? <br /> : null}
      {renderEnglishMessiriLine(line, `${ivKey}-t-${turnIdx}-L-${li}`)}
    </Fragment>
  ));
}

export function IvSpeakerLabel({
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
