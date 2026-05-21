import type { InterviewTurn } from "./interviewTurns";
import {
  INTERVIEW_01_TURNS,
  INTERVIEW_02_TURNS,
  INTERVIEW_03_TURNS,
  INTERVIEW_04_TURNS,
  INTERVIEW_05_TURNS,
  INTERVIEW_06_TURNS,
  INTERVIEW_07_TURNS,
  INTERVIEW_08_TURNS,
} from "./interviewTurns";

export type InterviewChapterConfig = {
  num: string;
  titleKey: string;
  title: string;
  turns: readonly InterviewTurn[];
};

export const INTERVIEW_CHAPTERS: readonly InterviewChapterConfig[] = [
  {
    num: "01",
    titleKey: "iv-ch01-title",
    title: "만남 TONYWANG 그리고...",
    turns: INTERVIEW_01_TURNS,
  },
  {
    num: "02",
    titleKey: "iv-ch02-title",
    title: "처음 시작한 스킨케어 사업",
    turns: INTERVIEW_02_TURNS,
  },
  {
    num: "03",
    titleKey: "iv-ch03-title",
    title: "TONYWANG 유전자 단백질",
    turns: INTERVIEW_03_TURNS,
  },
  {
    num: "04",
    titleKey: "iv-ch04-title",
    title: "식물세포 유전자 단백질의 원리",
    turns: INTERVIEW_04_TURNS,
  },
  {
    num: "05",
    titleKey: "iv-ch05-title",
    title: "피부 독소 균 AND 변혁의 시간",
    turns: INTERVIEW_05_TURNS,
  },
  {
    num: "06",
    titleKey: "iv-ch06-title",
    title: "스킨케어 시장에 진출한 이유는?",
    turns: INTERVIEW_06_TURNS,
  },
  {
    num: "07",
    titleKey: "iv-ch07-title",
    title: "향장학 AND SELLS",
    turns: INTERVIEW_07_TURNS,
  },
  {
    num: "08",
    titleKey: "iv-ch08-title",
    title: "여정의 시간",
    turns: INTERVIEW_08_TURNS,
  },
];
