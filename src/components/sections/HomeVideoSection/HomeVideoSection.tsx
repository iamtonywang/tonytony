"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./HomeVideoSection.module.css";

const VIDEO_SRC_PC = "/landing-assets/products-hero-pc.mp4";
const VIDEO_SRC_MOBILE = "/landing-assets/products-hero-mobile.mp4";
const MOBILE_MEDIA_QUERY = "(max-width: 768px)";

/** metadata 전까지 타임라인 계산용 폴백(초) */
const FALLBACK_DURATION_SEC = 64;

const timelineTexts = [
  "TONY WANG",
  "NIGAJUN",
  "Global",
  "first attempt",
  "plant cell genetic protein",
  "Development of SKIN CARE",
  "For the first time in the world",
  "Developed with plant cell gene protein",
  "NIGAJUN",
  "I came out to change my skin",
  "The fact that your skin is newly born",
  "through advertising",
  "through marketing",
  "with money",
  "I'm not doing it",
  "creative",
  "Only matter can do it",
  "NIGAJUN",
  "May 2026 TONY WANG",
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
  const videoMountRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [deviceVideoSrc, setDeviceVideoSrc] = useState<string | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleLockRef = useRef(false);
  const userPlaybackRef = useRef(false);

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
    const media = window.matchMedia(MOBILE_MEDIA_QUERY);
    const applyDeviceSrc = () => {
      setDeviceVideoSrc(media.matches ? VIDEO_SRC_MOBILE : VIDEO_SRC_PC);
    };

    applyDeviceSrc();
    media.addEventListener("change", applyDeviceSrc);
    return () => media.removeEventListener("change", applyDeviceSrc);
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !deviceVideoSrc) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setSrc((prev) => prev ?? deviceVideoSrc);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: "0px 0px", threshold: 0.01 }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [deviceVideoSrc]);

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
    if (!userPlaybackRef.current) {
      video.muted = true;
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
      video.pause();
      video.currentTime = 0;
    } catch {
      /* ignore */
    }
    setIsPlaying(false);
    userPlaybackRef.current = false;
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
        userPlaybackRef.current = true;
        video.muted = false;
        video.volume = 1;

        if (!video.currentSrc) {
          video.src = src ?? deviceVideoSrc ?? VIDEO_SRC_PC;
        }

        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          video.load();
        }

        video.muted = false;
        video.volume = 1;
        await video.play();
      } else {
        userPlaybackRef.current = false;
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
  }, [deviceVideoSrc, src]);

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

  useEffect(() => {
    if (!src) {
      return;
    }
    const mount = videoMountRef.current;
    if (!mount || mount.querySelector("video")) {
      return;
    }

    const videoEl = document.createElement("video");
    videoEl.className = styles.video;
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.loop = false;
    videoEl.preload = "none";
    videoEl.src = src;

    const onLoadedMetadata = () => {
      handleLoadedMetadata();
    };
    const onPlay = () => {
      setIsPlaying(true);
    };
    const onPause = () => {
      setIsPlaying(false);
    };
    const onEnded = () => {
      handleEnded();
    };
    const onTimeUpdate = () => {
      handleTimeUpdate();
    };

    videoEl.addEventListener("loadedmetadata", onLoadedMetadata);
    videoEl.addEventListener("play", onPlay);
    videoEl.addEventListener("pause", onPause);
    videoEl.addEventListener("ended", onEnded);
    videoEl.addEventListener("timeupdate", onTimeUpdate);

    mount.appendChild(videoEl);
    videoRef.current = videoEl;

    return () => {
      videoEl.removeEventListener("loadedmetadata", onLoadedMetadata);
      videoEl.removeEventListener("play", onPlay);
      videoEl.removeEventListener("pause", onPause);
      videoEl.removeEventListener("ended", onEnded);
      videoEl.removeEventListener("timeupdate", onTimeUpdate);
      try {
        videoEl.pause();
      } catch {
        /* ignore */
      }
      if (videoEl.parentNode === mount) {
        mount.removeChild(videoEl);
      }
      videoRef.current = null;
    };
  }, [src, handleLoadedMetadata, handleTimeUpdate, handleEnded]);

  const phaseClass =
    visualPhase === "exit"
      ? styles.motionTextExit
      : visualPhase === "enter"
        ? styles.motionTextEnter
        : styles.motionTextActive;

  const activeText = timelineTexts[shownIndex] ?? "";

  return (
    <section ref={sectionRef} className={styles.section} aria-label="홈 소개 영상">
      <div className={styles.mediaWrap}>
        {src ? (
          <div ref={videoMountRef} className={styles.videoSlot} aria-hidden="true" />
        ) : (
          <div className={styles.placeholder} aria-hidden />
        )}

        {src ? (
          <div className={styles.motionOverlay} aria-hidden="true">
            <div className={`${styles.motionText} ${phaseClass}`}>{activeText}</div>
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
