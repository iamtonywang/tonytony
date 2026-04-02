"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Nigajun77View.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

interface Props {
  product?: ProductMinimal;
}

export default function Nigajun77View({ product }: Props) {
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
      videoEl.src = "/landing-assets/nigajun-77-hero-pc.mp4.mp4";

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
              style={{ backgroundImage: "url('/landing-assets/nigajun-77-hero-pc.webp.webp')" }}
            />
            <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
          </div>
          <div className={styles.heroOverlay}>
            <h1 className={styles.productTitle}>
              {product?.productName ?? "NIGAJUN 77"}
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
              <span>NIGAJUN 77</span>
              <br />
              <span>Development of Plant Cell Genetic Protein</span>
              <br />
              <span>Molecular Bio-Bio-Bioengineering</span>
              <br />
              <span>What&apos;s the new change?</span>
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
        <h2 className={styles.detailIntroLead}>NIGAJUN 77</h2>
        <h3 className={styles.detailIntroSubTitle}>Proteo Phyto Complex.</h3>
        <p className={styles.detailIntroText}>Lower Body Fat Improvement Cream</p>
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

              <p className={`${styles.detailOverlayText} ${styles.korText}`}>
                종아리는 특별한 지방 조직이다.
              </p>
              <p className={`${styles.detailOverlayText} ${styles.korText}`}>
                움직임이 많지만 지방은 쉽게 사라지지 않는다.
              </p>
              <p className={`${styles.detailOverlayText} ${styles.korText}`}>
                이유는 단순하다.
              </p>
              <p className={`${styles.detailOverlayText} ${styles.korText}`}>
                종아리 지방은 부종이 아니라 대사 환경에 의해 유지된다.
              </p>
              <p className={`${styles.detailOverlayText} ${styles.korText}`}>
                <span className={styles.pcOnly}>
                  지방세포는 단순히 지방을 저장하는<br />
                  저장소가 아니다.
                </span>
                <span className={styles.mobileOnly}>
                  지방세포는 단순히 지방을 저장하는 저장소가 아니다.
                </span>
              </p>
              <p className={`${styles.detailOverlayText} ${styles.korText}`}>
                <span className={styles.pcOnly}>
                  지방세포는 에너지 저장 모드와 에너지 소비 모드 사이를 오가는 대사 세포다.
                </span>
                <span className={styles.mobileOnly}>
                  지방세포는 에너지 저장 모드와 에너지 소비 모드 사이를<br />
                  오가는 대사 세포다.
                </span>
              </p>
              <p className={`${styles.detailOverlayText} ${styles.korText}`}>
                <span className={styles.pcOnly}>
                  문제는 대부분의 종아리 지방이 저장 모드에 고정되어 있다는 것이다.
                </span>
                <span className={styles.mobileOnly}>
                  문제는 대부분의 종아리 지방이 저장 모드에<br />
                  고정되어 있다는 것이다.
                </span>
              </p>
              <p className={`${styles.detailOverlayText} ${styles.korText}`}>
                지방 합성 효소 FAS · ACC 경로가 억제되면서
              </p>
              <p className={`${styles.detailOverlayText} ${styles.korText}`}>
                지방세포는 더 이상 축적 환경을 유지하기 어렵다.
              </p>
              <p className={`${styles.detailOverlayText} ${styles.korText}`}>
                지방 조직 주변에서 나타나는 저등급 염증(low-grade inflammation)
              </p>
              <p className={`${styles.detailOverlayText} ${styles.korText}`}>
                지방 축적을 유지시키는 중요한 조건이다
              </p>

              <p className={styles.detailOverlayText}>
                The calf is a special fat tissue.
              </p>
              <p className={styles.detailOverlayText}>
                <span className={styles.pcOnly}>
                  There is a lot of movement, but fat does not disappear easily. The reason is simple.
                </span>
                <span className={styles.mobileOnly}>
                  There is a lot of movement, but fat does not disappear easily. The reason is simple.
                </span>
              </p>
              <p className={styles.detailOverlayText}>
                Calf fat is maintained by metabolic environment, not by edema.
              </p>
              <p className={styles.detailOverlayText}>
                Fat cells are not just stores of fat.
              </p>
              <p className={styles.detailOverlayText}>
                Adipocytes are metabolic cells that move between the energy storage mode and the energy consumption mode.
              </p>
              <p className={styles.detailOverlayText}>
                <span className={styles.pcOnly}>
                  The problem is that most calf fat is fixed in storage mode.
                </span>
                <span className={styles.mobileOnly}>
                  The problem is that most calf fat is<br />
                  fixed in storage mode.
                </span>
              </p>
              <p className={styles.detailOverlayText}>
                As the fat synthase FAS ACC pathway is suppressed
              </p>
              <p className={styles.detailOverlayText}>
                Adipocytes are no longer able to maintain an accumulation environment.
              </p>
              <p className={styles.detailOverlayText}>
                Low-grade inflammation around adipose tissue
              </p>
              <p className={styles.detailOverlayText}>
                be an important condition for maintaining fat accumulation
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



