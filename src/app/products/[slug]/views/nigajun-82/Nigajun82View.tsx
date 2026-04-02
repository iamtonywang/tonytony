"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Nigajun82View.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

interface Props {
  product?: ProductMinimal;
}

export default function Nigajun82View({ product }: Props) {
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
      videoEl.src = "/landing-assets/nigajun-82-hero-pc.mp4.mp4";

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
              style={{ backgroundImage: "url('/landing-assets/nigajun-82-hero-pc.webp.webp')" }}
            />
            <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
          </div>
          <div className={styles.heroOverlay}>
            <h1 className={styles.productTitle}>
              {product?.productName ?? "NIGAJUN 82"}
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
              <span>NIGAJUN 82</span>
              <br />
              <span>Development of Plant Cell Genetic Protein</span>
              <br />
              <span>Molecular Bio-Bio-Bioengineering</span>
              <br />
              <span>You have to love yourself</span>
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
        <h1 className={styles.detailIntroTitle}>TONY WANG</h1>
        <h2 className={styles.detailIntroLead}>NIGAJUN 99</h2>
        <h3 className={styles.detailIntroSubTitle}>Proteo Phyto Complex</h3>
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

              <p className={styles.detailDescription}>
                질염은 단순한 오염 상태로 정의되지 않는다.
              </p>
              <p className={styles.detailDescription}>
                질 내부 환경에서 여러 생물학적 조건이 동시에 변화할 때
              </p>
              <p className={styles.detailDescription}>
                병원성 미생물 활동 조건이 형성.
              </p>
              <p className={styles.detailDescription}>
                미생물 군집 구조 변화 점막 단백질 구조 변화
              </p>
              <p className={styles.detailDescription}>
                효소 활성 변화 호르몬 환경 변화
              </p>
              <p className={styles.detailDescription}>
                이러한 변화가 누적되면
              </p>
              <p className={styles.detailDescription}>
                병원성 미생물 증식에 유리한 환경이 형성이 주원인이다
              </p>
              <p className={styles.detailDescription}>
                분비물에 의한 불쾌한 냄새. 가려움.
              </p>
              <p className={styles.detailDescription}>
                단순한 향기제로 이를 개선 할수 없다
              </p>
              <p className={styles.detailDescription}>
                항균 세척제로 원인을 개선한다는 것은 속임수에 불과하다
              </p>

              <p className={styles.detailDescription}>
                vaginitis is not defined as a simple state of contamination.
              </p>
              <p className={styles.detailDescription}>
                <span className={styles.pcOnly}>
                  When multiple biological conditions change simultaneously in the favorable for pathogenic microbial growth.
                </span>
                <span className={styles.mobileOnly}>
                  When multiple biological conditions change<br />
                  simultaneously in the<br />
                  favorable for pathogenic microbial growth.
                </span>
              </p>
              <p className={styles.detailDescription}>
                Changes in microbial community structure Changes in mucosal protein structure
              </p>
              <p className={styles.detailDescription}>
                Enzyme Activity Change Hormone Environment Change
              </p>
              <p className={styles.detailDescription}>
                If these changes accumulate
              </p>
              <p className={styles.detailDescription}>
                The main reason is the formation of an environment favorable for
              </p>
              <p className={styles.detailDescription}>
                pathogenic microbial growth.
              </p>
              <p className={styles.detailDescription}>
                The unpleasant smell caused by secretions.
              </p>
              <p className={styles.detailDescription}>
                Itching. A simple fragrance cannot improve it.
              </p>
              <p className={styles.detailDescription}>
                It is only a trick to improve the cause with antibacterial cleaning agents
              </p>

              <p className={styles.detailDescription}>
                Since August 2025 TONYWANG
              </p>

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
        <p className={styles.detailCopyText}>
          Since August 2025 TONYWANG
        </p>
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



