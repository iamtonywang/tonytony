"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const [hideText, setHideText] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let hasMountedVideo = false;
    let timeoutId: number | null = null;

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

      videoOverlayRef.current.appendChild(videoEl);
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
            // keep mount timing as-is; add fade-out timing only for center copy
            timeoutId = window.setTimeout(() => {
              setHideText(true);
            }, 2000);
            mountVideoOverlay();
            observer.disconnect();
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
      cancelAnimationFrame(rafId);
    };
  }, []);

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
            We don’t make products.
            <br />
            We engineer outcomes.
          </h1>

          <h2
            style={{
              position: "absolute",
              right: "24px",
              bottom: "24px",
              fontWeight: 500,
            }}
          >
            TONYWANG
          </h2>
        </div>
      </div>
    </section>
  );
}
