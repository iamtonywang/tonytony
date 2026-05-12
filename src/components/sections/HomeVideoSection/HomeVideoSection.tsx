"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./HomeVideoSection.module.css";

const VIDEO_SRC = "/landing-assets/products-hero-pc.mp4";

const TIMELINE_STEP_SEC = 4;

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

function computeTimelineIndex(currentTime: number): number {
  const raw = Math.floor(currentTime / TIMELINE_STEP_SEC);
  return Math.min(Math.max(raw, 0), timelineTexts.length - 1);
}

export default function HomeVideoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleLockRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [motionEnter, setMotionEnter] = useState(false);
  const lastIndexRef = useRef(0);

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

  const triggerEnterMotion = useCallback(() => {
    setMotionEnter(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setMotionEnter(false);
      });
    });
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const next = computeTimelineIndex(video.currentTime);
    if (next !== lastIndexRef.current) {
      lastIndexRef.current = next;
      setActiveIndex(next);
      triggerEnterMotion();
    }
  }, [triggerEnterMotion]);

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
    lastIndexRef.current = 0;
    setActiveIndex(0);
    triggerEnterMotion();
  }, [triggerEnterMotion]);

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
    const next = computeTimelineIndex(video.currentTime);
    if (next !== lastIndexRef.current) {
      lastIndexRef.current = next;
      setActiveIndex(next);
      triggerEnterMotion();
    }
  }, [isPlaying, src, triggerEnterMotion]);

  const item = timelineTexts[activeIndex];

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
              className={`${styles.motionText} ${
                motionEnter ? styles.motionTextEnter : ""
              } ${item.large ? styles.motionTextLarge : styles.motionTextNormal}`}
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
