"use client";

import { useEffect, useRef } from "react";
import styles from "./Nigajun17View.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

interface Props {
  product?: ProductMinimal;
}

export default function Nigajun17View({ product }: Props) {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    let hasMountedVideo = false;
    let timeoutId: number | null = null;
    let hasScheduled = false;

    const mountVideoOverlay = () => {
      if (!isMounted || hasMountedVideo || !videoOverlayRef.current) {
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
          videoEl.currentTime = videoEl.duration;
        } catch {}
      });

      // connect asset source (single pc asset as default)
      videoEl.src = "/landing-assets/nigajun-17-hero-pc.mp4.mp4";

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
          if (entry && entry.isIntersecting && !hasScheduled) {
            hasScheduled = true;
            timeoutId = window.setTimeout(() => {
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
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <article className={styles.detailPage}>
      <section className={styles.heroSection}>
        <div ref={heroVisualRef} className={styles.heroVisual}>
          <div className={styles.videoArea}>
            <div
              className={styles.backgroundLayer}
              style={{ backgroundImage: "url('/landing-assets/nigajun-17-hero-pc.webp.webp')" }}
            />
            <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
          </div>
          <div className={styles.heroOverlay}>
            <h1 className={styles.productTitle}>
              {product?.productName ?? "NIGAJUN 17"}
            </h1>
            <button
              type="button"
              className={styles.playButton}
              onClick={() => {
                const video = videoOverlayRef.current?.querySelector("video") as HTMLVideoElement | null;
                if (!video) {
                  return;
                }
                try {
                  if (video.paused) {
                    video.muted = false;
                    void video.play();
                  } else {
                    video.pause();
                    video.currentTime = 0;
                  }
                } catch {}
              }}
              aria-label="Toggle video playback"
            />
          </div>
        </div>
      </section>

      <section className={styles.coreInfoSection}>
        <h2 className={styles.sectionTitle}>Core Information</h2>
        <p className={styles.sectionText}>
          {product?.shortDescription ?? "Core product information placeholder."}
          {typeof product?.finalPriceAmount === "number" ? (
            <span> {" "}· {product.finalPriceAmount.toLocaleString()}원</span>
          ) : null}
        </p>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.sectionTitle}>CTA</h2>
        <button type="button" className={styles.ctaButton} disabled>
          Coming Soon
        </button>
      </section>

      <section className={styles.boardSection}>
        <h2 className={styles.sectionTitle}>Board</h2>
        <p className={styles.sectionText}>Review and inquiry area placeholder.</p>
      </section>

      <section className={styles.informationSection}>
        <h2 className={styles.sectionTitle}>Information</h2>
        <p className={styles.sectionText}>Detailed information placeholder.</p>
      </section>
    </article>
  );
}