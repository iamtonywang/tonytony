"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [hideText, setHideText] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHideText(true);
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
      videoEl.loop = true;
      videoEl.preload = "metadata";
      videoEl.setAttribute("aria-hidden", "true");

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
      setIsPlaying(true);
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
        <div className={styles.heroOverlay}>
          <p className={styles.heroText} style={{ opacity: hideText ? 0 : 1 }}>
            WHY?<br/>
            TONYWANG<br/>
            식물세포유전자단백질연구개발<br/>
            분자생물바이오생명공학<br/>
            I will prove that Tonywang is the best
          </p>

          <div className={styles.brandText}>
            TONYWANG
          </div>
        </div>
      </div>
    </section>
  );
}
