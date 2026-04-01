"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Nigajun44View.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

interface Props {
  product?: ProductMinimal;
}

export default function Nigajun44View({ product }: Props) {
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
      videoEl.src = "/landing-assets/nigajun-44-hero-pc.mp4.mp4";

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
              style={{ backgroundImage: "url('/landing-assets/nigajun-44-hero-pc.webp.webp')" }}
            />
            <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
          </div>
          <div className={styles.heroOverlay}>
            <h1 className={styles.productTitle}>
              {product?.productName ?? "NIGAJUN 44"}
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
              <span>TONYWANGNIGAJUN 44</span>
              <br />
              <span>Development of Plant Cell Genetic Protein</span>
              <br />
              <span>Molecular Bio-Bio-Bioengineering</span>
              <br />
              <span>If you don&apos;t know the value, go away</span>
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
        <h2 className={styles.detailIntroLead}>NIGAJUN 44</h2>
        <h3 className={styles.detailIntroSubTitle}>Proteo Phyto Complex</h3>
        <p className={styles.detailIntroText}>
          I welcome you to those who truly want to transform
        </p>
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
              <p className={styles.detailOverlayHeading}>TONYWANG</p>
              <p className={styles.detailOverlayText}>NIGAJUN 44</p>
              <p className={styles.detailOverlayText}>Proteo Phyto Complex</p>
              <p className={styles.detailOverlayText}>
                I welcome you to those who truly want to transform
              </p>

              <p className={styles.detailOverlayText}>
                <span className={styles.pcOnly}>
                  가치를 모르는자 자신을 사랑하지 않는자 의문을 가지는자
                </span>
                <span className={styles.mobileOnly}>
                  가치를 모르는자<br />
                  자신을 사랑하지 않는자<br />
                  의문을 가지는자
                </span>
              </p>

              <p className={styles.detailOverlayText}>
                자격이 없다 여기서 나가라<br />
                진정으로 변혁을 원하는 자 환영한다
              </p>

              <p className={styles.detailOverlayText}>
                피부 독소 개선, 피부 변혁, 트러블 개선 통합적인 CARE 구축.
              </p>
              <p className={styles.detailOverlayText}>
                독소가 제거된 피부는 오염이 안된 1급수 물과 같다.
              </p>
              <p className={styles.detailOverlayText}>고통스러운 피부 트러블 개선 된다</p>

              <p className={styles.detailOverlayText}>긴 설명이 뭐가 필요해 거짓은 필요치 않아</p>
              <p className={styles.detailOverlayText}>
                성분이 뭐고 어떤 구조라고 떠들고 싶지 않아
              </p>

              <p className={styles.detailOverlayText}>최고라고 말할 필요도 없어</p>
              <p className={styles.detailOverlayText}>우리 스스로 얘기하는건 모순이잔아</p>
              <p className={styles.detailOverlayText}>그래 그렇지만</p>
              <p className={styles.detailOverlayText}>다들 자기 것들이 최고라고 얘기해</p>

              <p className={styles.detailOverlayText}>나는 그들과 같은 존재가 되기 싫어</p>

              <p className={styles.detailOverlayText}>I don't like lying</p>

              <p className={styles.detailOverlayText}>나는 거짓이 싫을 뿐이고</p>
              <p className={styles.detailOverlayText}>
                누군가를 속이며 이익을 만들고 싶지 않아
              </p>
              <p className={styles.detailOverlayText}>그것은 매우 역겨운 행동이야</p>
              <p className={styles.detailOverlayText}>그래</p>
              <p className={styles.detailOverlayText}>그런게 너무 싫었고 역겨웠어</p>
              <p className={styles.detailOverlayText}>TONYWANG Since August 2025</p>

              <p className={styles.detailPriceRow}>
                {typeof product?.finalPriceAmount === "number" ? (
                  <span>· {product.finalPriceAmount.toLocaleString()}</span>
                ) : null}
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
        <p className={styles.detailCopyText}>A New Challenge</p>
        <p className={styles.detailCopyText}>Entering the cosmetic market,</p>
        <p className={styles.detailCopyText}>
          I spent another five years transforming
        </p>
        <p className={styles.detailCopyText}>
          the substance through continuous research.
        </p>
        <p className={styles.detailCopyText}>
          The result was the birth of a cosmetic product with remarkable
        </p>
        <p className={styles.detailCopyText}>
          effects: helping prevent skin aging, protecting
        </p>
        <p className={styles.detailCopyText}>
          the skin from toxic cosmetic contamination,
        </p>
        <p className={styles.detailCopyText}>
          <span className={styles.pcOnly}>
            improving skin troubles caused by surfactants, and restoring damaged skin tissue.
          </span>
          <span className={styles.mobileOnly}>
            improving skin troubles caused by surfactants,<br />
            and restoring damaged skin tissue.
          </span>
        </p>
        <p className={styles.detailCopyText}>
          <span className={styles.pcOnly}>
            Yet the market still does not fully understand our recombinant protein technology.
          </span>
          <span className={styles.mobileOnly}>
            Yet the market still does not fully understand<br />
            our recombinant protein technology.
          </span>
        </p>
        <p className={styles.detailCopyText}>
          <span className={styles.pcOnly}>
            The reality is that a research and development system built at the level
          </span>
          <span className={styles.mobileOnly}>
            The reality is that a research and development system<br />
            built at the level
          </span>
        </p>
        <p className={styles.detailCopyText}>
          of bio-pharmaceutical innovation is not properly recognized.
        </p>
        <p className={styles.detailCopyText}>But our conviction remains unchanged.</p>
        <p className={styles.detailCopyText}>We speak only the truth.</p>
        <p className={styles.detailCopyText}>Bio Must Prove Itself Through Results</p>
        <p className={styles.detailCopyText}>TONYWANG Since August 2025</p>
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



