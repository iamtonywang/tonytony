"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./HomeVideoSection.module.css";

const VIDEO_SRC = "/landing-assets/products-hero-pc.mp4";

/** metadata 전까지 타임라인 계산용 폴백(초) */
const FALLBACK_DURATION_SEC = 64;

const timelineTexts = [
  { text: "TONY WANG", large: true },
  { text: "NIGAJUN", large: true },
  { text: "Global", large: false },
  { text: "first attempt", large: false },
  { text: "식물 세포 유전자 단백질", large: false },
  { text: "SKIN CARE 개발", large: false },
  { text: "글로벌 최초", large: false },
  { text: "식물 세포 유전자 단백질로 개발한", large: false },
  { text: "NIGAJUN", large: true },
  { text: "피부를 갈아 엎으러 나왔어", large: false },
  { text: "피부가 새로 태어난다는 것은", large: false },
  { text: "마켓팅으로", large: false },
  { text: "돈으로 하는게 아냐", large: false },
  { text: "창조적 물질만이 할 수 있어", large: false },
  { text: "NIGAJUN", large: true },
  { text: "May 2026 TONY WANG", large: false },
] as const;

type VisualPhase = "enter" | "active" | "exit";

function getEffectiveDurationSeconds(video: HTMLVideoElement): number {
  const d = video.duration;
  if (Number.isFinite(d) && d > 0) {
    return d;
  }
  return FALLBACK_DURATION_SEC;
}

function computeTimelineIndex(currentTime: number, durationSeconds: number): number {
  const seg = durationSeconds / timelineTexts.length;
  const raw = Math.floor(currentTime / seg);
  return Math.min(Math.max(raw, 0), timelineTexts.length - 1);
}

export default function HomeVideoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleLockRef = useRef(false);

  const [shownIndex, setShownIndex] = useState(0);
  const [visualPhase, setVisualPhase] = useState<VisualPhase>("active");
  const lastComputedIndexRef = useRef(0);
  const shownIndexRef = useRef(0);
  const visualPhaseRef = useRef<VisualPhase>("active");

  useEffect(() => {
    shownIndexRef.current = shownIndex;
  }, [shownIndex]);

  useEffect(() => {
    visualPhaseRef.current = visualPhase;
  }, [visualPhase]);

  const goEnterThenActive = useCallback(() => {
    setVisualPhase("enter");
    visualPhaseRef.current = "enter";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisualPhase("active");
        visualPhaseRef.current = "active";
      });
    });
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setSrc((prev) => prev ?? VIDEO_SRC);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: "120px 0px", threshold: 0.01 }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!src) {
      return;
    }
    goEnterThenActive();
  }, [src, goEnterThenActive]);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const dur = getEffectiveDurationSeconds(video);
    const idx = computeTimelineIndex(video.currentTime, dur);
    lastComputedIndexRef.current = idx;
    setShownIndex(idx);
    shownIndexRef.current = idx;
    setVisualPhase("active");
    visualPhaseRef.current = "active";
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const dur = getEffectiveDurationSeconds(video);
    const next = computeTimelineIndex(video.currentTime, dur);

    if (next === lastComputedIndexRef.current) {
      return;
    }
    lastComputedIndexRef.current = next;

    const phase = visualPhaseRef.current;
    const shown = shownIndexRef.current;

    if (phase === "active" && next !== shown) {
      setVisualPhase("exit");
      visualPhaseRef.current = "exit";
      return;
    }

    if (phase === "enter" && next !== shown) {
      setShownIndex(next);
      shownIndexRef.current = next;
      setVisualPhase("active");
      visualPhaseRef.current = "active";
    }
  }, []);

  useEffect(() => {
    if (visualPhase !== "exit") {
      return;
    }
    const tid = window.setTimeout(() => {
      const target = lastComputedIndexRef.current;
      setShownIndex(target);
      shownIndexRef.current = target;
      goEnterThenActive();
    }, 1800);
    return () => window.clearTimeout(tid);
  }, [visualPhase, goEnterThenActive]);

  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    try {
      video.currentTime = 0;
    } catch {
      /* ignore */
    }
    setIsPlaying(false);
    lastComputedIndexRef.current = 0;
    setShownIndex(0);
    shownIndexRef.current = 0;
    goEnterThenActive();
  }, [goEnterThenActive]);

  const handleToggle = useCallback(async () => {
    const video = videoRef.current;
    if (!video || toggleLockRef.current) {
      return;
    }

    toggleLockRef.current = true;
    try {
      if (video.paused || video.ended) {
        if (video.ended) {
          try {
            video.currentTime = 0;
          } catch {
            /* ignore */
          }
        }
        video.muted = false;
        await video.play();
      } else {
        video.pause();
        try {
          video.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error(error);
      }
      setIsPlaying(false);
    } finally {
      toggleLockRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (isPlaying || !src) {
      return;
    }
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const dur = getEffectiveDurationSeconds(video);
    const next = computeTimelineIndex(video.currentTime, dur);
    lastComputedIndexRef.current = next;
    setShownIndex(next);
    shownIndexRef.current = next;
    setVisualPhase("active");
    visualPhaseRef.current = "active";
  }, [isPlaying, src]);

  const phaseClass =
    visualPhase === "exit"
      ? styles.motionTextExit
      : visualPhase === "enter"
        ? styles.motionTextEnter
        : styles.motionTextActive;

  const item = timelineTexts[shownIndex];

  return (
    <section ref={sectionRef} className={styles.section} aria-label="홈 소개 영상">
      <div className={styles.mediaWrap}>
        {src ? (
          <video
            ref={videoRef}
            className={styles.video}
            src={src}
            preload="none"
            muted
            playsInline
            loop={false}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden />
        )}

        {src ? (
          <div className={styles.motionOverlay} aria-hidden="true">
            <div
              className={`${styles.motionText} ${phaseClass} ${
                item.large ? styles.motionTextLarge : styles.motionTextNormal
              }`}
            >
              {item.text}
            </div>
          </div>
        ) : null}

        {src ? (
          <button
            type="button"
            className={`${styles.playButton} ${isPlaying ? styles.playButtonPlaying : ""}`}
            onClick={handleToggle}
            aria-label={isPlaying ? "영상 일시정지" : "영상 재생"}
          />
        ) : null}
      </div>
    </section>
  );
}
