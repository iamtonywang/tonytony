"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

const HERO_LINES = [
  "TONY WANG",
  "I organize myself like this",
  "Time for hesitation is stupid and a waste. Just don't think about anything",
  "That's how you can empty your head and put something new in it",
  "I never imagined I'd research and develop skincare",
  "Bio and Hyangsamsa are so different",
  "I thought it was insignificant. I still feel the same way",
  "There was a reason",
  "And that's when I thought and decided",
  "You can turn the world upside down with skincare",
  "I want to prove that it's the first time in the past and present, not in the future",
  "That's the creation",
  "Creation is something that you can have only when you're crazy",
  "I want to break down skin care that's worse than trash",
  "I think it's going to be fun. The more I think about it, the more I feel thrilled",
  "Yeah, I want to have you",
  "Not me, but my alter ego,",
  "NIGAJUN",
  "TONYWANG",
  "SINCE  August 2025 ByTONYWANG",
] as const;

const BACKGROUND_LINES = [
  "Our Work",
  "TONYWANG",
  "식물세포유전자단백질연구개발",
  "분자생물바이오생명공학",
  "My job is to develop a plant cell gene protein",
] as const;

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [linePhase, setLinePhase] = useState<"enter" | "exit">("enter");
  const [showFinalStack, setShowFinalStack] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setActiveLineIndex(0);
      setLinePhase("enter");
      setShowFinalStack(false);
      return;
    }

    const lineCount = HERO_LINES.length;
    const lineVisibleMs = 2100;
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
  const handleToggle = async () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.muted = false;
      await videoEl.play().catch(() => {});
      setIsPlaying(true);
      return;
    }

    videoEl.pause();
    videoEl.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroVisual}>
        <div className={styles.videoArea}>
          <div className={styles.backgroundLayer} />

          {showVideo && (
            <div className={styles.videoOverlay}>
              <video
                ref={videoRef}
                className={styles.videoElement}
                muted
                playsInline
                loop
                preload="metadata"
              >
                <source
                  src="/landing-assets/ourwork-hero-pc.mp4"
                  type="video/mp4"
                  media="(min-width: 769px)"
                />
                <source
                  src="/landing-assets/ourwork-hero-mobile.mp4"
                  type="video/mp4"
                  media="(max-width: 768px)"
                />
              </video>
            </div>
          )}

          <button
            type="button"
            className={styles.playButton}
            onClick={handleToggle}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          />

          {!showVideo && (
            <div className={styles.fallbackOverlay}>
              <p className={styles.heroText}>
                {BACKGROUND_LINES.map((line) => (
                  <span key={line}>
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
                  {HERO_LINES[activeLineIndex]}
                </p>
              ) : (
                <div className={styles.finalStack}>
                  {HERO_LINES.map((line) => (
                    <p key={line} className={styles.finalStackLine}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
