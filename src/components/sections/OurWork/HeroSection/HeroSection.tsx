"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hideText, setHideText] = useState(false);

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

          <div className={styles.heroOverlay}>
            <p className={styles.heroText} style={{ opacity: hideText ? 0 : 1 }}>
              Our Work<br/>
              TONYWANG<br/>
              식물세포유전자단백질연구개발<br/>
              분자생물바이오생명공학<br/>
              My job is to develop a plant cell gene protein
            </p>

            <div className={styles.brandText}>
              TONYWANG
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
