"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

const WHY_LINES = [
  "TONYWANG",
  "If only I could go back like Benjamin Burton.",
  "If you could increase shorter telomeres?",
  "What if you could rewind that watch?",
  "It's not age that your skin is getting old, it's because your cells are tired",
  "Okay.",
  "I spent 28 years studying cells",
  "Everyone must have had a crazy challenge at least once in their lives",
  "And.",
  "With countless sighs, tears, and heart-wrenching pain",
  "I realized that I had failed and failed like crazy",
  "It is divided into those who challenge and those who give up",
  "Yes, this is life",
  "It's a trail of time that everyone experiences in a panoramic life",
  "The failure and success we have in the 8.2 billion population is a part of that",
  "The only genetic protein that transforms new skin tissue",
  "Plant Cell Gene Protein",
  "SINCE  August 2025 TONYWANG",
] as const;

export default function HeroSection() {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
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
    let hasMountedVideo = false;

    const mountVideoOverlay = () => {
      if (hasMountedVideo || !videoOverlayRef.current) {
        return;
      }

      const videoEl = document.createElement("video");
      videoEl.className = styles.videoElement;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.loop = true;
      videoEl.preload = "metadata";
      videoEl.setAttribute("aria-hidden", "true");
      videoEl.addEventListener("play", () => setIsPlaying(true));
      videoEl.addEventListener("pause", () => setIsPlaying(false));
      videoEl.addEventListener("ended", () => setIsPlaying(false));

      const sourcePc = document.createElement("source");
      sourcePc.src = "/landing-assets/why-hero-pc.mp4";
      sourcePc.type = "video/mp4";
      sourcePc.media = "(min-width: 769px)";

      const sourceMobile = document.createElement("source");
      sourceMobile.src = "/landing-assets/why-hero-mobile.mp4";
      sourceMobile.type = "video/mp4";
      sourceMobile.media = "(max-width: 768px)";

      videoEl.appendChild(sourcePc);
      videoEl.appendChild(sourceMobile);

      videoRef.current = videoEl;
      videoOverlayRef.current.appendChild(videoEl);
      hasMountedVideo = true;
    };

    if (showVideo) {
      mountVideoOverlay();
    }
  }, [showVideo, styles.videoElement]);

  const handleToggle = async () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.muted = false;
      await videoEl.play().catch(() => {});
      return;
    }

    videoEl.pause();
    videoEl.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <section className={styles.heroSection}>
      <div ref={heroVisualRef} className={styles.heroVisual}>
        <div className={styles.videoArea}>
          <div className={styles.backgroundLayer} />
          {showVideo && (
            <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
          )}
        </div>
        <button
          type="button"
          className={styles.playButton}
          onClick={handleToggle}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        />
        {!showVideo && (
          <div className={styles.fallbackOverlay}>
            <p className={styles.heroText}>
              {WHY_LINES.map((line) => (
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
                {WHY_LINES[activeLineIndex]}
              </p>
            ) : (
              <div className={styles.finalStack}>
                {WHY_LINES.map((line) => (
                  <p key={line} className={styles.finalStackLine}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
