"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Nigajun17View.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

interface Props {
  product?: ProductMinimal;
}

export default function Nigajun17View({ product }: Props) {
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
              style={{ backgroundImage: "url('/landing-assets/nigajun-17-hero-pc.webp.webp')" }}
            />
            <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
          </div>
          <div className={styles.heroOverlay}>
            <h1 className={styles.productTitle}>
              {product?.productName ?? "NIGAJUN 17"}
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
              <span>NIGAJUN 17</span>
              <br />
              <span>Development of Plant Cell Genetic Protein</span>
              <br />
              <span>Molecular Bio-Bio-Bioengineering</span>
              <br />
              <span>Life is beautiful and tearful</span>
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
        <h2 className={styles.detailIntroLead}>NIGAJUN 17 Hyper</h2>
        <h3 className={styles.detailIntroSubTitle}>Proteo Phyto Complex</h3>
        <p className={styles.detailIntroText}>Hair Cream</p>
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

              <p className={styles.detailOverlayText}>나는 모발이 새로 난다고 말할수 없어</p>
              <p className={styles.detailOverlayText}>그것은 매우 큰 거짓이기 때문이다</p>
              <p className={styles.detailOverlayText}>왜 두피 질환과 탈모는 반복되는가.</p>
              <p className={styles.detailOverlayText}>생물학적 관점에서 질환의 핵심은</p>
              <p className={styles.detailOverlayText}>경로(Process) 가 아니라 단백질(Protein)</p>
              <p className={styles.detailOverlayText}>
                세포는 특정 신호에 반응하여 단백질을 과다 또는 과소 발현하고,
              </p>
              <p className={styles.detailOverlayText}>
                이런 불균형이 두피 환경과 모낭 기능의 변화를 유도
              </p>
              <p className={styles.detailOverlayText}>가장 근본적인 개선 전략은</p>
              <p className={styles.detailOverlayText}>
                단백질 조절 신호 경로 제어 세포 기능 정상화
              </p>
              <p className={styles.detailOverlayText}>조직 환경 회복 생물학적 순서</p>
              <p className={styles.detailOverlayText}>
                전사 조절 인자를 통해 모낭 구조 안정성을 지원하고,
              </p>
              <p className={styles.detailOverlayText}>
                MMP 억제 단백질을 활용하여 모낭 구조 붕괴를 억제하며
              </p>
              <p className={styles.detailOverlayText}>
                염증 반응의 악순환을 차단하고 MMP-9 억제 단백질을 통해
              </p>
              <p className={styles.detailOverlayText}>
                염증 조직 손상을 완화하여 두피 환경의 균형 지원
              </p>
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



