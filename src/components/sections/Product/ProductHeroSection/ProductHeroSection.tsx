"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

export default function ProductHeroSection() {
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTimelineLineIndexRef = useRef(-1);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [isSequenceComplete, setIsSequenceComplete] = useState(false);

  const mountVideoOverlay = useCallback(() => {
    if (!videoOverlayRef.current) {
      return null;
    }

    const existingVideo = videoOverlayRef.current.querySelector("video");
    if (existingVideo) {
      videoRef.current = existingVideo;
      return existingVideo;
    }

    const videoEl = document.createElement("video");
    videoEl.className = styles.videoElement;
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.loop = false;
    videoEl.autoplay = false;
    videoEl.preload = "metadata";
    videoEl.setAttribute("aria-hidden", "true");
    videoEl.addEventListener("ended", () => {
      try {
        videoEl.pause();
        videoEl.currentTime = 0;
      } catch {}
      lastTimelineLineIndexRef.current = -1;
      setIsPlaying(false);
      setActiveLineIndex(0);
      setIsSequenceComplete(false);
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

      if (nextIndex !== lastTimelineLineIndexRef.current) {
        lastTimelineLineIndexRef.current = nextIndex;
        setActiveLineIndex(nextIndex);
      }
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

    return videoEl;
  }, []);

  const handleToggle = async () => {
    const videoEl = videoRef.current;
    if (!videoEl) {
      return;
    }

    if (videoEl.paused) {
      const isEnded =
        videoEl.ended ||
        videoEl.currentTime >= videoEl.duration - 0.05 ||
        isSequenceComplete;

      if (isEnded) {
        try {
          videoEl.currentTime = 0;
        } catch {}
      }
      if (videoEl.currentTime === 0 || isSequenceComplete) {
        lastTimelineLineIndexRef.current = -1;
        setActiveLineIndex(0);
        setIsSequenceComplete(false);
      }
      videoEl.muted = false;
      try {
        await videoEl.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    videoEl.pause();
    videoEl.currentTime = 0;
    lastTimelineLineIndexRef.current = -1;
    setIsPlaying(false);
    setActiveLineIndex(0);
    setIsSequenceComplete(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showVideo) {
      void mountVideoOverlay();
    }
  }, [showVideo, mountVideoOverlay]);

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroVisual}>
        <div className={styles.videoArea}>
          <div className={styles.backgroundLayer} />
          {showVideo ? (
            <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
          ) : null}
        </div>
        <div className={styles.heroOverlay}>
          <div className={styles.heroSequence} aria-hidden="true">
            <p key={activeLineIndex} className={styles.heroText}>
              {HERO_LINES[activeLineIndex]}
            </p>
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
