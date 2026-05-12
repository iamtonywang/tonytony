"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./HomeVideoSection.module.css";

const VIDEO_SRC = "/landing-assets/products-hero-pc.mp4";

export default function HomeVideoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleLockRef = useRef(false);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setSrc((prev) => prev ?? VIDEO_SRC);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: "120px 0px", threshold: 0.01 }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    try {
      video.currentTime = 0;
    } catch {
      /* ignore */
    }
    setIsPlaying(false);
  }, []);

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
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error(error);
      }
      setIsPlaying(false);
    } finally {
      toggleLockRef.current = false;
    }
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="홈 소개 영상">
      <div className={styles.mediaWrap}>
        {src ? (
          <video
            ref={videoRef}
            className={styles.video}
            src={src}
            preload="none"
            muted
            playsInline
            loop={false}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleEnded}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden />
        )}

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
