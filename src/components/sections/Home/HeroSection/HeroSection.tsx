"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

const HERO_LINES = [
  "HEY",
  "TONY WANG",
  "Why?",
  "Did you come out into the world?",
  "NIGAJUN",
  "SKINCARE",
  "I wanted",
  "enjoy it",
  "Okay.",
  "waste",
  "Fake",
  "All",
  "Throw it away",
  "What's the best",
  "I will show you.",
  "NIGAJUN",
  "TONY WANG",
  "TONY WANG",
  "SINCE May 2026",
];

const TYPE_SPEED_MS = 95;
const LINE_HOLD_MS = 1050;
const PRE_EXIT_HOLD_MS = 180;
const EXIT_MS = 820;
const NEXT_LINE_DELAY_MS = 180;
const PENULTIMATE_HOLD_MS = 1800;
const FINAL_LINE_HOLD_UNTIL_ENDED = true;

export default function HeroSection() {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hideText, setHideText] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasPlaybackStarted, setHasPlaybackStarted] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTextEntering, setIsTextEntering] = useState(false);
  const [isTextExiting, setIsTextExiting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let hasMountedVideo = false;
    let timeoutId: number | null = null;
    let observer: IntersectionObserver | null = null;
    let hasScheduledMount = false;

    const mountVideoOverlay = () => {
      if (!isMounted || hasMountedVideo || !videoOverlayRef.current) {
        return;
      }

      const videoEl = document.createElement("video");
      videoEl.className = styles.videoElement;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.preload = "metadata";
      videoEl.setAttribute("aria-hidden", "true");
      console.log("video created");

      // attach desktop/mobile sources with media queries
      const sourcePc = document.createElement("source");
      sourcePc.src = "/landing-assets/home-hero-pc.mp4";
      sourcePc.type = "video/mp4";
      sourcePc.media = "(min-width: 769px)";

      const sourceMobile = document.createElement("source");
      sourceMobile.src = "/landing-assets/home-hero-mobile.mp4";
      sourceMobile.type = "video/mp4";
      sourceMobile.media = "(max-width: 768px)";

      console.log("source pc:", sourcePc.src);
      console.log("source mobile:", sourceMobile.src);

      videoEl.appendChild(sourcePc);
      videoEl.appendChild(sourceMobile);

      videoOverlayRef.current.appendChild(videoEl);
      console.log("video appended");
      videoRef.current = videoEl;
      setHasVideo(true);
      try {
        console.log("video load called");
        videoEl.load();
        console.log("video readyState:", videoEl.readyState);
        // autoplay disabled: start only on button click
      } catch {}
      hasMountedVideo = true;
    };

    const rafId = requestAnimationFrame(() => {
      if (!heroVisualRef.current) {
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry && entry.isIntersecting && !hasScheduledMount) {
            hasScheduledMount = true;
            timeoutId = window.setTimeout(() => {
              setHideText(true);
              mountVideoOverlay();
              if (observer) {
                observer.disconnect();
              }
            }, 1000);
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(heroVisualRef.current);
    });

    return () => {
      isMounted = false;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      if (observer) {
        observer.disconnect();
      }
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
      setHasPlaybackStarted(false);
      setLineIndex(0);
      setTypedText("");
      setIsTextEntering(false);
      setIsTextExiting(false);
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [hasVideo]);

  useEffect(() => {
    if (!hasPlaybackStarted) return;

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });

    const runLines = async () => {
      let current = 0;
      setLineIndex(0);
      setTypedText("");
      setIsTextEntering(false);
      setIsTextExiting(false);

      while (!cancelled && current < HERO_LINES.length) {
        const line = HERO_LINES[current];
        setTypedText("");
        setIsTextEntering(true);
        setIsTextExiting(false);
        setLineIndex(current);

        let typed = "";
        for (const ch of line) {
          if (cancelled) return;
          typed += ch;
          setTypedText(typed);
          await sleep(TYPE_SPEED_MS);
        }

        if (cancelled) return;
        const isPenultimate = current === HERO_LINES.length - 2;
        const isLast = current === HERO_LINES.length - 1;

        await sleep(isPenultimate ? PENULTIMATE_HOLD_MS : LINE_HOLD_MS);
        if (cancelled) return;
        await sleep(PRE_EXIT_HOLD_MS);
        if (cancelled) return;

        if (isLast && FINAL_LINE_HOLD_UNTIL_ENDED) {
          setIsTextEntering(false);
          return;
        }

        setIsTextEntering(false);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        if (cancelled) return;
        setIsTextExiting(true);
        await sleep(EXIT_MS);
        if (cancelled) return;

        setTypedText("");
        setIsTextExiting(false);
        await sleep(NEXT_LINE_DELAY_MS);
        if (cancelled) return;
        current += 1;
        setLineIndex(current);
      }

      if (cancelled) return;
      setTypedText("");
      setIsTextEntering(false);
      setIsTextExiting(false);
      setLineIndex(0);
    };

    runLines();

    return () => {
      cancelled = true;
    };
  }, [hasPlaybackStarted]);

  const handleToggle = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = false;
      const playResult = await video.play().catch(() => null);
      if (playResult === undefined || playResult) {
        setIsPlaying(true);
        setHasPlaybackStarted(true);
      } else {
        setIsPlaying(false);
        setHasPlaybackStarted(false);
      }
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
      setHasPlaybackStarted(false);
      setLineIndex(0);
      setTypedText("");
      setIsTextEntering(false);
      setIsTextExiting(false);
    }
  };

  return (
    <section className={styles.heroSection}>
      <div ref={heroVisualRef} className={styles.heroVisual}>
        <div className={styles.videoArea}>
          <div className={styles.backgroundLayer} />
          <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
        </div>
        <button
          type="button"
          className={styles.playButton}
          onClick={handleToggle}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        />
        <div className={styles.heroOverlay}>
          <p className={`${styles.introText} ${hideText ? styles.introTextHidden : ""}`}>
            TONY WANG<br />
            Plant Cell Genetic Protein Laboratory<br />
            식물세포유전자단백질연구개발<br />
            분자생물학 바이오생명공학연구소<br />
            My job is to develop a plant cell gene protein
          </p>

          <div
            className={`${styles.videoTextWrap} ${hideText ? styles.videoTextWrapVisible : ""}`}
            aria-hidden="true"
          >
            {hasPlaybackStarted && typedText ? (
              <p
                key={lineIndex}
                className={`${styles.videoText} ${isTextEntering ? styles.videoTextEnter : ""} ${isTextExiting ? styles.videoTextExit : ""}`}
              >
                {typedText}
              </p>
            ) : null}
          </div>

          <div className={styles.brandText}>
            TONYWANG
          </div>
        </div>
      </div>
    </section>
  );
}
