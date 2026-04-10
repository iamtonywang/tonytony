"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Nigajun28View.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

// 28 전용 시퀀스(원문/순서 그대로 적용)
const HERO_SEQUENCE_28: string[] = [
  "TONYWANG",
  "NIGAJUN 28",
  "New Oral Care",
  "I don't like the smell",
  "I hate it",
  "Smell is a scary thing",
  "I can't even kiss the woman I love",
  "I'm ashamed of her",
  "How can I get rid of the smell?",
  "I want to talk to people a lot",
  "I want to sit close to the woman I love and talk to",
  "I have bad breath",
  "I don't like the smell",
  "This is so embarrassing.",
  "Oh, my God. How do we solve this problem?",
  "I hate fibroblasts",
  "I want to kiss the woman I love",
  "I'd like to talk to you in person",
  "Proteo Phyto Complex",
  "Genetic Toothpaste",
  "Since August 2025 TONYWANG",
];
// TONYWANG만 25px, 나머지 14px
const HERO_EMPHASIS_28: boolean[] = HERO_SEQUENCE_28.map((line) => line === "TONYWANG");

interface Props {
  product?: ProductMinimal;
}

const PINNED_NOTICE = {
  author: "TONYWANG",
  preview: "공지 내용은 추후 등록 예정입니다...",
  type: "Notice",
  date: "2026.04.10",
  content: "공지 내용은 추후 등록 예정입니다.",
} as const;

const BOARD_ITEMS = [
  {
    author: "user***",
    preview: "피부가 좋아졌어요...",
    type: "Review",
    date: "2026.04.10",
    content: "피부가 많이 좋아졌어요. 재구매 의사 있습니다.",
  },
  {
    author: "user***",
    preview: "배송은 언제 되나요...",
    type: "Inquiry",
    date: "2026.04.11",
    content: "배송 일정이 궁금합니다.",
  },
  {
    author: "user***",
    preview: "향이 은은해서 좋아요",
    type: "Review",
    date: "2026.04.12",
    content: "향이 은은해서 데일리로 쓰기 좋습니다.",
  },
  {
    author: "user***",
    preview: "문의 드립니다",
    type: "Inquiry",
    date: "2026.04.13",
    content: "제품 구성 문의드립니다.",
  },
];

export default function Nigajun28View({ product }: Props) {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const [hideText, setHideText] = useState(false);
  // 시퀀스 제어 상태 (hideText는 2초 intro 전용 유지)
  const [hasPlaybackStarted, setHasPlaybackStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);
  const [linePhase, setLinePhase] = useState<"enter" | "hold" | "exit">("enter");
  const [showFinalBlock, setShowFinalBlock] = useState(false); // 28은 최종 블록 미사용(단일 마지막 문구)
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [openBoardIndex, setOpenBoardIndex] = useState<number | null>(null);

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
      // loadedmetadata: 유효 duration 저장
      videoEl.addEventListener("loadedmetadata", () => {
        const d = Number.isFinite(videoEl.duration) ? videoEl.duration : NaN;
        if (!Number.isNaN(d) && d > 0 && d !== Infinity) {
          setVideoDuration(d);
        }
      });
      // play: 실제 재생 성공 시만 시퀀스 시작
      videoEl.addEventListener("play", () => {
        setIsPlaying(true);
        setHasPlaybackStarted(true);
        setActiveLineIndex(0);
        setLinePhase("enter");
        setShowFinalBlock(false);
      });
      // pause: 상태 초기화(0초 복귀는 버튼/ended에서 처리)
      videoEl.addEventListener("pause", () => {
        setIsPlaying(false);
        setActiveLineIndex(0);
        setLinePhase("enter");
        setShowFinalBlock(false);
      });
      videoEl.addEventListener("ended", () => {
        try {
          videoEl.pause();
          videoEl.currentTime = 0;
        } catch {}
        setIsPlaying(false);
        setActiveLineIndex(0);
        setLinePhase("enter");
        setShowFinalBlock(false);
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

  // duration 기반 시퀀스 진행
  useEffect(() => {
    if (!hasPlaybackStarted || !isPlaying) return;
    if (!videoDuration || !Number.isFinite(videoDuration) || videoDuration <= 0) return;

    const total = HERO_SEQUENCE_28.length;
    if (total === 0) return;

    const timers: number[] = [];
    const LAST_HOLD_MS = 2000; // 마지막 단일 문구 유지 시간
    const effective = Math.max(0, videoDuration * 1000 - LAST_HOLD_MS);

    const lastIndex = total - 1;
    const linesToDistribute = Math.max(0, total - 1); // 마지막 문구 제외하고 분배

    if (linesToDistribute === 0) {
      const showLast = window.setTimeout(() => {
        setActiveLineIndex(lastIndex);
        setLinePhase("enter");
      }, 0);
      timers.push(showLast);
      return () => {
        timers.forEach((id) => clearTimeout(id));
      };
    }

    const sliceMs = effective / linesToDistribute;
    const enterMs = sliceMs * 0.2;
    const holdMs = sliceMs * 0.6;

    // 앞 라인들 스케줄링(마지막 제외)
    for (let i = 0; i < linesToDistribute; i++) {
      const base = Math.max(0, Math.round(sliceMs * i));
      const tEnter = window.setTimeout(() => {
        setActiveLineIndex(i);
        setLinePhase("enter");
      }, base);
      timers.push(tEnter);

      const tHold = window.setTimeout(() => {
        setLinePhase("hold");
      }, base + Math.round(enterMs));
      timers.push(tHold);

      const tExit = window.setTimeout(() => {
        setLinePhase("exit");
      }, base + Math.round(enterMs + holdMs));
      timers.push(tExit);
    }

    // 마지막 문구: 앞 라인 종료 직후 표시, 2초 유지(상태 전환만)
    const lastStart = Math.round(sliceMs * linesToDistribute);
    const tLast = window.setTimeout(() => {
      setActiveLineIndex(lastIndex);
      setLinePhase("enter");
    }, lastStart);
    timers.push(tLast);

    return () => {
      timers.forEach((id) => clearTimeout(id));
    };
  }, [hasPlaybackStarted, isPlaying, videoDuration]);
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
              className={styles.videoTextWrap}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                opacity: hideText && !isPlaying ? 0 : 1,
                transition: "opacity 2s ease",
              }}
            >
              {/* 재생 전: 기존 intro 문구 유지 */}
              {!isPlaying && (
                <>
                  <span>TONYWANG</span>
                  <br />
                  <span>NIGAJUN 28</span>
                  <br />
                  <span>Development of Plant Cell Genetic Protein</span>
                  <br />
                  <span>Molecular Bio-Bio-Bioengineering</span>
                  <br />
                  <span>Do the best you can in your life</span>
                </>
              )}

              {/* 재생 중: 항상 1줄만 출력, 최종 블록 미사용 */}
              {isPlaying && !showFinalBlock && (
                <span
                  className={[
                    styles.videoText,
                    HERO_EMPHASIS_28[activeLineIndex] ? styles.videoTextEmphasis : "",
                    linePhase === "exit" ? styles.videoTextExit : "",
                  ].join(" ")}
                >
                  {HERO_SEQUENCE_28[activeLineIndex]}
                </span>
              )}
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
                <Link href={`/purchase/${product?.slug ?? ""}`} className={styles.detailBuyButton}>
                  Buy Now
                </Link>
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
        <div className={styles.boardHeader}>
          <h2 className={styles.sectionTitle}>Board</h2>
          <button type="button" className={styles.writeButton}>
            Write
          </button>
        </div>

        <div className={styles.boardList}>
          <div className={styles.boardItem}>
            <button
              type="button"
              className={styles.boardRow}
              onClick={() => setOpenBoardIndex((prev) => (prev === 0 ? null : 0))}
            >
              <span className={styles.boardPreviewAuthor}>{PINNED_NOTICE.author}</span>
              <span className={styles.boardPreviewText}>{PINNED_NOTICE.preview}</span>
            </button>
            {openBoardIndex === 0 ? (
              <div className={styles.boardExpanded}>
                <div className={styles.boardMeta}>{PINNED_NOTICE.type}</div>
                <div className={styles.boardDate}>{PINNED_NOTICE.date}</div>
                <div className={styles.boardContent}>{PINNED_NOTICE.content}</div>
              </div>
            ) : null}
          </div>

          {BOARD_ITEMS.map((item, i) => {
            const rowIndex = i + 1;
            return (
              <div key={`board-row-${rowIndex}`} className={styles.boardItem}>
                <button
                  type="button"
                  className={styles.boardRow}
                  onClick={() => setOpenBoardIndex((prev) => (prev === rowIndex ? null : rowIndex))}
                >
                  <span className={styles.boardPreviewAuthor}>{item.author}</span>
                  <span className={styles.boardPreviewText}>{item.preview}</span>
                </button>
                {openBoardIndex === rowIndex ? (
                  <div className={styles.boardExpanded}>
                    <div className={styles.boardMeta}>{item.type}</div>
                    <div className={styles.boardDate}>{item.date}</div>
                    <div className={styles.boardContent}>{item.content}</div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.informationSection}>
        <h2 className={styles.sectionTitle}>Information</h2>
        <p className={styles.sectionText}>Detailed information placeholder.</p>
      </section>
    </article>
  );
}



