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
  "I wanted enjoy it",
  "Okay.",
  "waste",
  "Fake",
  "All",
  "Throw it away",
  "What's the best",
  "I will show you.",
  "plant cell genetic protein",
  "Institute Bio-Bioengineering",
  "This is my TONY WANG's belief",
  "It's a very good and valuable work",
  "I Don't Like Lying",
] as const;

const HERO_FINAL_STACK_LINES = [
  "TONY WANG",
  "All right.",
  "I've been studying cells for 28 years",
  "I've never thought about making trashy cosmetics",
  "It's their lies that made me angry",
  "I decided to change all my trashy cosmetics",
  "I decided to make a crazy new creation this time",
  "I researched and developed NIGAJUN",
  "I want to prove that the past and present are the first",
  "I want to show you that I'm the best",
  "I think it's going to be a fun game",
  "I thought about it and decided",
  "You can turn the world around with skincare",
  "What excites me even more is that",
  "It's a bad skincare culture that only lies",
  "I want to break it down",
  "You have to be crazy to win",
  "This is my TONY WANG's belief",
  "You have to be crazy to get what you want",
  "It's a very good and valuable work",
  "TONY WANG",
  "SINCE May 2026",
] as const;

const LINE_HOLD_MS = 1470;
const PRE_EXIT_HOLD_MS = 210;
const EXIT_MS = 780;
const NEXT_LINE_DELAY_MS = 210;
/** Second-to-last line: slightly longer read before exit (scaled with LINE_HOLD_MS vs prior script). */
const PENULTIMATE_HOLD_MS = 2460;
const FINAL_STACK_DELAY_MS = 520;
const FINAL_STACK_FADE_IN_MS = 560;
const FINAL_STACK_VISIBLE_HOLD_MS = 2400;

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
  const [showFinalStack, setShowFinalStack] = useState(false);
  const [finalStackSettled, setFinalStackSettled] = useState(false);

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
      sourcePc.src = "/landing-assets/ourwork-hero-pc.mp4";
      sourcePc.type = "video/mp4";
      sourcePc.media = "(min-width: 769px)";

      const sourceMobile = document.createElement("source");
      sourceMobile.src = "/landing-assets/ourwork-hero-mobile.mp4";
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
      setShowFinalStack(false);
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [hasVideo]);

  useEffect(() => {
    if (!showFinalStack) {
      setFinalStackSettled(false);
      return;
    }

    setFinalStackSettled(false);
    const emphasisDoneMs = FINAL_STACK_FADE_IN_MS + FINAL_STACK_VISIBLE_HOLD_MS;
    const id = window.setTimeout(() => {
      setFinalStackSettled(true);
    }, emphasisDoneMs);

    return () => {
      window.clearTimeout(id);
    };
  }, [showFinalStack]);

  useEffect(() => {
    if (!hasPlaybackStarted) return;

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });

    const runLines = async () => {
      let current = 0;
      setShowFinalStack(false);
      setFinalStackSettled(false);
      setLineIndex(0);
      setTypedText("");
      setIsTextEntering(false);
      setIsTextExiting(false);

      const lineCount = HERO_LINES.length;

      while (!cancelled && current < lineCount) {
        const line = HERO_LINES[current];
        if (cancelled) return;
        setLineIndex(current);
        setTypedText(line);
        setIsTextEntering(true);
        setIsTextExiting(false);

        const isPenultimate = current === lineCount - 2;
        const isLast = current === lineCount - 1;

        await sleep(isPenultimate ? PENULTIMATE_HOLD_MS : LINE_HOLD_MS);
        if (cancelled) return;
        await sleep(PRE_EXIT_HOLD_MS);
        if (cancelled) return;

        setIsTextEntering(false);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        if (cancelled) return;
        setIsTextExiting(true);
        await sleep(EXIT_MS);
        if (cancelled) return;

        setTypedText("");
        setIsTextExiting(false);

        if (isLast) {
          setIsTextEntering(false);
          await sleep(FINAL_STACK_DELAY_MS);
          if (cancelled) return;
          setShowFinalStack(true);
          return;
        }

        await sleep(NEXT_LINE_DELAY_MS);
        if (cancelled) return;
        current += 1;
        setLineIndex(current);
      }

      if (cancelled) return;
      setTypedText("");
      setIsTextEntering(false);
      setIsTextExiting(false);
      setShowFinalStack(false);
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
        setShowFinalStack(false);
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
      setShowFinalStack(false);
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
            {hasPlaybackStarted && !showFinalStack && typedText ? (
              <p
                key={lineIndex}
                className={`${styles.videoText} ${typedText === "HEY" || typedText === "I Don't Like Lying" || typedText === "plant cell genetic protein" ? styles.brandOrangeText : ""} ${typedText === "plant cell genetic protein" ? styles.plantProteinText : ""} ${isTextEntering ? styles.videoTextEnter : ""} ${isTextExiting ? styles.videoTextExit : ""}`}
              >
                {typedText}
              </p>
            ) : null}

            {hasPlaybackStarted && showFinalStack ? (
              <div
                className={`${styles.finalStack} ${finalStackSettled ? styles.finalStackSettled : ""}`}
              >
                {HERO_FINAL_STACK_LINES.map((line, index) => (
                  <p key={`${line}-${index}`} className={styles.finalStackLine}>
                    {line}
                  </p>
                ))}
              </div>
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
