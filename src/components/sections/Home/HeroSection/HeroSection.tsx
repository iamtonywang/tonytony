"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hideText, setHideText] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let hasMountedVideo = false;

    const mountVideoOverlay = () => {
      if (!isMounted || hasMountedVideo || !videoOverlayRef.current) {
        return;
      }

      const videoEl = document.createElement("video");
      videoEl.className = styles.videoElement;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.loop = true;
      videoEl.preload = "metadata";
      videoEl.setAttribute("aria-hidden", "true");
      videoEl.autoplay = true;
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
        console.log("video play called");
        void videoEl.play().catch((e) => {
          console.log("video error:", e);
        });
        setIsPlaying(true);
      } catch {}
      hasMountedVideo = true;
    };

    const rafId = requestAnimationFrame(() => {
      if (!heroVisualRef.current) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry && entry.isIntersecting) {
            setTimeout(() => {
              setHideText(true);
              mountVideoOverlay();
              observer.disconnect();
            }, 2000);
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(heroVisualRef.current);
    });

    return () => {
      isMounted = false;
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      video.currentTime = 0;
      setIsPlaying(false);
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [hasVideo]);

  const handleToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = false;
      video.currentTime = 0;
      void video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <section className={styles.heroSection}>
      <div ref={heroVisualRef} className={styles.heroVisual}>
        <div className={styles.videoArea}>
          <div className={styles.backgroundLayer} />
          <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
        </div>
        <div className={styles.heroOverlay}>
          <h1
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              opacity: hideText ? 0 : 1,
              transition: "opacity 2s ease",
            }}
          >
            <span>TONY WANG</span>
            <br />
            <span>Plant Cell Genetic Protein Laboratory</span>
            <br />
            <span>식물세포유전자단백질연구개발</span>
            <br />
            <span>분자생물학 바이오생명공학연구소</span>
            <br />
            <span>I'm going to solve all the puzzles about skin</span>
          </h1>

          <h2
            style={{
              position: "absolute",
              right: "24px",
              bottom: "24px",
              fontWeight: "500",
            }}
          >
            TONYWANG
          </h2>

          <button
            type="button"
            className={styles.playButton}
            onClick={handleToggle}
            aria-label="Toggle video playback"
          />
        </div>
      </div>
    </section>
  );
}
