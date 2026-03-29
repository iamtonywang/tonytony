"use client";

import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import styles from "./ProductHeroSection.module.css";

const HERO_LINES = [
  "TONYWANG",
  "Research Development Plant Cell Gene Protein",
  "Molecular Bio-Bioengineering",
  "It only sells to those who truly love themselves",
  "If you don't love yourself, get out of here",
  "I want to tell you the true value, not the product",
  "I'm here to solve all the skin problems",
  "TONYWANG",
];

export default function ProductHeroSection({ children }: PropsWithChildren) {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [isSequenceComplete, setIsSequenceComplete] = useState(false);

  const handleToggle = async () => {
    const videoEl = videoRef.current;
    if (!videoEl) {
      return;
    }

    if (videoEl.paused) {
      if (videoEl.currentTime === 0 || isSequenceComplete) {
        setActiveLineIndex(0);
        setIsSequenceComplete(false);
      }
      videoEl.muted = false;
      await videoEl.play().catch(() => {});
      setIsPlaying(true);
      return;
    }

    videoEl.pause();
    videoEl.currentTime = 0;
    setIsPlaying(false);
    setActiveLineIndex(0);
    setIsSequenceComplete(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
      videoEl.loop = false;
      videoEl.preload = "metadata";
      videoEl.setAttribute("aria-hidden", "true");
      videoEl.addEventListener("ended", () => {
        try {
          videoEl.pause();
          videoEl.currentTime = videoEl.duration;
        } catch {}
        setIsPlaying(false);
        setActiveLineIndex(HERO_LINES.length - 1);
        setIsSequenceComplete(true);
      });
      videoEl.addEventListener("timeupdate", () => {
        const duration = videoEl.duration;

        if (!duration || Number.isNaN(duration)) {
          return;
        }

        const segment = duration / HERO_LINES.length;
        const nextIndex = Math.min(
          HERO_LINES.length - 1,
          Math.floor(videoEl.currentTime / segment)
        );

        setActiveLineIndex(nextIndex);
      });
      videoRef.current = videoEl;

      const sourcePc = document.createElement("source");
      sourcePc.src = "/landing-assets/products-hero-pc.mp4";
      sourcePc.type = "video/mp4";
      sourcePc.media = "(min-width: 769px)";

      const sourceMobile = document.createElement("source");
      sourceMobile.src = "/landing-assets/products-hero-mobile.mp4";
      sourceMobile.type = "video/mp4";
      sourceMobile.media = "(max-width: 768px)";

      videoEl.appendChild(sourcePc);
      videoEl.appendChild(sourceMobile);

      videoOverlayRef.current.appendChild(videoEl);
      hasMountedVideo = true;
    };

    if (showVideo) {
      mountVideoOverlay();
    }
  }, [showVideo, styles.videoElement]);

  return (
    <section className={styles.heroSection}>
      <div ref={heroVisualRef} className={styles.heroVisual}>
        <div className={styles.videoArea}>
          <div className={styles.backgroundLayer} />
          {showVideo && (
            <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
          )}
        </div>
        <div className={styles.heroOverlay}>
          <div className={styles.heroSequence} aria-hidden="true">
            <p key={activeLineIndex} className={styles.heroText}>
              {HERO_LINES[activeLineIndex]}
            </p>
          </div>
          <div className={`${styles.bottomStack} ${isSequenceComplete ? styles.bottomStackCenter : ""}`}>
            <div className={styles.brandText}>
              TONYWANG
            </div>
            {children ? <div className={styles.overlayList}>{children}</div> : null}
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
