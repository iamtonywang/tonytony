"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Nigajun28View.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

interface Props {
  product?: ProductMinimal;
}

export default function Nigajun28View({ product }: Props) {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const [hideText, setHideText] = useState(false);

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
      videoEl.src = "/landing-assets/nigajun-28-hero-pc.mp4.mp4";

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
              style={{ backgroundImage: "url('/landing-assets/nigajun-28-hero-pc.webp.webp')" }}
            />
            <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
          </div>
          <div className={styles.heroOverlay}>
            <h1 className={styles.productTitle}>
              {product?.productName ?? "NIGAJUN 28"}
            </h1>

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
              <span>TONYWANG</span>
              <br />
              <span>NIGAJUN 28</span>
              <br />
              <span>Development of Plant Cell Genetic Protein</span>
              <br />
              <span>Molecular Bio-Bio-Bioengineering</span>
              <br />
              <span>Do the best you can in your life</span>
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
      <div className={styles.detailTopGlowLine} aria-hidden="true" />

      <section className={styles.detailIntroSection}>
        <h1 className={styles.detailIntroTitle}>TONYWANG</h1>
        <h2 className={styles.detailIntroLead}>NIGAJUN 28</h2>
        <h3 className={styles.detailIntroSubTitle}>Proteo Phyto Complex</h3>
        <p className={styles.detailIntroText}>New Oral Care</p>
      </section>

      <div className={styles.detailMidGlowLine} aria-hidden="true" />


      <section className={styles.detailVisualSection}>
        <div className={styles.detailVisualMedia}>
          <img
            className={styles.detailVisualImage}
            src="/landing-assets/hero-main-pc.webp"
            alt="TONYWANG product visual"
            draggable={false}
          />
          <div className={styles.detailGradientOverlay} aria-hidden="true" />

          <div className={styles.detailVisualOverlay} draggable={false}>
            <div className={styles.detailOverlayInner}>
              <h1 className={styles.detailTitle}>TONYWANG</h1>

              <p className={styles.detailPriceRow}>
                {typeof product?.finalPriceAmount === "number" ? (
                  <span>· {product.finalPriceAmount.toLocaleString()}</span>
                ) : null}
              </p>

              <p className={styles.detailOverlayText}>TONYWANG</p>
              <p className={styles.detailOverlayText}>수십 년 동안 치약은 같은 방식으로 만들어졌어.</p>
              <p className={styles.detailOverlayText}>세균을 제거하고, 입안을 깨끗하게 만드는 것.</p>
              <p className={styles.detailOverlayText}>하지만 구강 건강은 단순한 세정의 문제가 아냐</p>
              <p className={styles.detailOverlayText}>
                <span className={styles.pcOnly}>
                  구강은 수많은 미생물과 세포가 공존하는 생물학적 생태계이며,
                </span>
                <span className={styles.mobileOnly}>
                  구강은 수많은 미생물과 세포가 공존하는
                  <br />
                  생물학적 생태계이며,
                </span>
              </p>
              <p className={styles.detailOverlayText}>
                <span className={styles.pcOnly}>
                  잇몸 조직은 끊임없이 염증 반응과 회복 과정을 반복하는 생체 조직 이야
                </span>
                <span className={styles.mobileOnly}>
                  잇몸 조직은 끊임없이 염증 반응과 회복 과정을<br />
                  반복하는 생체 조직 이야
                </span>
              </p>
              <p className={styles.detailOverlayText}>Genetic Toothpaste는 바로 이 지점에서 시작했어</p>
              <p className={styles.detailOverlayText}>
                <span className={styles.pcOnly}>
                  치약을 단순한 세정 제품이 아니라 구강 조직의 생물학적
                </span>
                <span className={styles.mobileOnly}>
                  치약을 단순한 세정 제품이 아니라<br />
                  구강 조직의 생물학적
                </span>
              </p>
              <p className={styles.detailOverlayText}>신호를 조절하는 바이오 플랫폼으로 재정의했어.</p>
              <p className={styles.detailOverlayText}>Proteo Phyto Complex로</p>
              <p className={styles.detailOverlayText}>설계된 활성 분자 시스템은 식물세포에서</p>
              <p className={styles.detailOverlayText}>
                <span className={styles.pcOnly}>
                  유래한 단백질, 펩타이드, 폴리페놀 및 항산화 생체 분자가 결합된
                </span>
                <span className={styles.mobileOnly}>
                  유래한 단백질, 펩타이드, 폴리페놀 및 항산화<br />
                  생체 분자가 결합된
                </span>
              </p>
              <p className={styles.detailOverlayText}>Bioactive Molecular 시스템이다</p>
              <p className={styles.detailOverlayText}>Since August 2025 TONYWAN</p>

              <div className={styles.detailCtaRow}>
                <button className={styles.detailBuyButton} disabled>
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.detailBottomGlowLine} aria-hidden="true" />

      <section className={styles.detailCopySection}>
        <p className={styles.detailCopyText}>TONYWANG</p>
        <p className={styles.detailCopyText}>
          Someone needs to shout the truth, correct the wrongs and clean up the dirt with lies and tricks
        </p>
        <p className={styles.detailCopyText}>Since August 2025 TONYWANG</p>
      </section>

      <div className={styles.detailEndGlowLine} aria-hidden="true" />

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



