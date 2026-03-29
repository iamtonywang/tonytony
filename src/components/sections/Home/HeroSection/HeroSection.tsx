"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);

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
      try {
        console.log("video load called");
        videoEl.load();
        console.log("video readyState:", videoEl.readyState);
        console.log("video play called");
        void videoEl.play().catch((e) => {
          console.log("video error:", e);
        });
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
          <h1>TONYWANG SCIENCE</h1>
          <p>Science-backed wellness for modern living.</p>
          <Link href="/products" className={styles.cta}>
            Explore Product
          </Link>
        </div>
      </div>
    </section>
  );
}
