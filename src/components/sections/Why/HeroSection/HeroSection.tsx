"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

const WHY_LINES = [
  "TONY WANG",
  "I found it",
  "Benjamin Burton",
  "Telomere",
  "rewind the clock",
  "28 years of cell research",
  "I found it",
  "I got it",
  "I made it my own",
  "Creation",
  "You have to go crazy",
  "so",
  "I can have it",
  "anyone",
  "at least once",
  "Success",
  "Failed",
  "I experienced it",
  "Okay.",
  "This is life",
  "Sigh",
  "Tears",
  "And",
  "a throbbing pain",
  "Let's overcome it",
  "to be able to get",
  "SINCE May 2026",
] as const;

const BACKGROUND_LINES = [
  "WHY?",
  "TONYWANG",
  "식물세포유전자단백질연구개발",
  "분자생물바이오생명공학",
  "I will prove that Tonywang is the best",
] as const;

export default function HeroSection() {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [pendingPlay, setPendingPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [linePhase, setLinePhase] = useState<"enter" | "exit">("enter");
  const [showFinalStack, setShowFinalStack] = useState(false);

  useEffect(() => {
		// Strict Mode: allow this effect twice; cleanup cancels prior timer,
		// then a fresh timer is registered so one valid timer remains.
		const timer = setTimeout(() => setShowVideo(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showVideo) return;
    const el = videoRef.current;
    if (!el) return;
  }, [showVideo]);

  const handleVideoEnded = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.pause();
    videoEl.currentTime = 0;
    setIsPlaying(false);
    setPendingPlay(false);
  };

  useEffect(() => {
    if (!isPlaying) {
      setActiveLineIndex(0);
      setLinePhase("enter");
      setShowFinalStack(false);
      return;
    }

    const lineCount = WHY_LINES.length;
    const lineVisibleMs = 2250;
    const lineExitMs = 360;
    const finalStackDelayMs = 900;
    let visibleTimeout: ReturnType<typeof setTimeout> | null = null;
    let exitTimeout: ReturnType<typeof setTimeout> | null = null;
    let finalTimeout: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const runLine = (index: number) => {
      if (cancelled) return;
      setActiveLineIndex(index);
      setLinePhase("enter");

      visibleTimeout = setTimeout(() => {
        if (cancelled) return;
        setLinePhase("exit");

        exitTimeout = setTimeout(() => {
          if (cancelled) return;

          if (index < lineCount - 1) {
            runLine(index + 1);
            return;
          }

          finalTimeout = setTimeout(() => {
            if (cancelled) return;
            setShowFinalStack(true);
          }, finalStackDelayMs);
        }, lineExitMs);
      }, lineVisibleMs);
    };

    runLine(0);

    return () => {
      cancelled = true;
      if (visibleTimeout) clearTimeout(visibleTimeout);
      if (exitTimeout) clearTimeout(exitTimeout);
      if (finalTimeout) clearTimeout(finalTimeout);
    };
  }, [isPlaying]);
  useEffect(() => {
    if (!showVideo || !pendingPlay) {
      return;
    }

    const videoEl = videoRef.current;
    if (!videoEl) {
      return;
    }

    let cancelled = false;
    const tryPlay = async () => {
      videoEl.muted = false;
      try {
        await videoEl.play();
        if (!cancelled) {
          setIsPlaying(true);
        }
      } catch {
        if (!cancelled) {
          setIsPlaying(false);
        }
      } finally {
        if (!cancelled) {
          setPendingPlay(false);
        }
      }
    };

    void tryPlay();

    return () => {
      cancelled = true;
    };
  }, [showVideo, pendingPlay]);

  const handleToggle = async () => {
    const videoEl = videoRef.current;
    if (!videoEl) {
      if (!showVideo) {
        setPendingPlay(true);
      }
      return;
    }

    if (videoEl.paused) {
      videoEl.muted = false;
      await videoEl.play().catch(() => {});
      return;
    }

    videoEl.pause();
    videoEl.currentTime = 0;
    setIsPlaying(false);
    setPendingPlay(false);
  };

  return (
    <section className={styles.heroSection}>
      <div ref={heroVisualRef} className={styles.heroVisual}>
        <div className={styles.videoArea}>
          <div className={styles.backgroundLayer} />
          <div className={styles.videoOverlay} aria-hidden="true">
            {showVideo && (
              <video
                ref={videoRef}
                className={styles.videoElement}
                muted
                playsInline
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleVideoEnded}
              >
                <source
                  src="/landing-assets/why-hero-pc.mp4"
                  type="video/mp4"
                  media="(min-width: 769px)"
                />
                <source
                  src="/landing-assets/why-hero-mobile.mp4"
                  type="video/mp4"
                  media="(max-width: 768px)"
                />
              </video>
            )}
          </div>
          <div className={styles.heroOverlay}>
            {!showVideo && (
              <div className={styles.fallbackOverlay}>
                <p className={styles.heroText}>
                  {BACKGROUND_LINES.map((line, index) => (
                    <span key={`${line}-${index}`}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
            )}
            {showVideo && isPlaying && (
              <div className={styles.motionOverlay}>
                {!showFinalStack ? (
                  <p
                    key={activeLineIndex}
                    className={`${styles.heroText} ${
                      linePhase === "exit" ? styles.heroTextExit : styles.heroTextEnter
                    }`}
                  >
                    {WHY_LINES[activeLineIndex]}
                  </p>
                ) : (
                  <div className={styles.finalStack}>
                    {WHY_LINES.map((line, index) => (
                      <p key={`${line}-${index}`} className={styles.finalStackLine}>
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          className={styles.playButton}
          onClick={handleToggle}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        />
      </div>
    </section>
  );
}
