"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Nigajun17View.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

// 17 전용 시퀀스(원문/순서 그대로 적용, 마지막 단일 문구는 별도 상수로 처리)
const HERO_SEQUENCE_17: string[] = [
  "TONYWANG",
  "NIGAJUN 17",
  "protein hair cream",
  "It's all false that hair is created",
  "I always cheated on him like that",
  "I don't want to do that.",
  "I can't make that promise",
  "Lies are unforgivable",
  "Isn't it sad that you don't have hair",
  "You can take care of yourself more",
  "Emphasize your personality as much as possible",
  "You love yourself",
  "Respect yourself",
  "Showing off as much as you want",
  "You have more personality than any other model",
  "People respect you",
  "Hair doesn't matter",
  "Put a spell on yourself",
  "You are an attractive person",
];
// TONYWANG만 25px, 나머지 14px
const HERO_EMPHASIS_17: boolean[] = HERO_SEQUENCE_17.map((line) => line === "TONYWANG");
// 마지막 단일 문구(2초 유지)
const HERO_FINAL_BLOCK_17 = "Since August 2025 TONYWANG";

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
  {
    author: "user***",
    preview: "재구매 문의입니다...",
    type: "Inquiry",
    date: "2026.04.14",
    content: "재구매 가능한지 알려주세요.",
  },
  {
    author: "user***",
    preview: "사용법이 궁금해요",
    type: "Review",
    date: "2026.04.15",
    content: "아침 저녁 사용량 가이드 부탁드립니다.",
  },
  {
    author: "user***",
    preview: "만족스러워요",
    type: "Review",
    date: "2026.04.16",
    content: "전반적으로 만족합니다.",
  },
  {
    author: "user***",
    preview: "포장 상태 좋아요",
    type: "Review",
    date: "2026.04.17",
    content: "포장이 꼼꼼했습니다.",
  },
  {
    author: "user***",
    preview: "유통기한 문의",
    type: "Inquiry",
    date: "2026.04.18",
    content: "유통기한 확인 부탁드립니다.",
  },
  {
    author: "user***",
    preview: "추천합니다",
    type: "Review",
    date: "2026.04.19",
    content: "지인에게도 추천했습니다.",
  },
];

export default function Nigajun17View({ product }: Props) {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const [hideText, setHideText] = useState(false);
  // 시퀀스 제어 상태 (hideText는 2초 intro 전용 유지)
  const [hasPlaybackStarted, setHasPlaybackStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);
  const [linePhase, setLinePhase] = useState<"enter" | "hold" | "exit">("enter");
  const [showFinalBlock, setShowFinalBlock] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [pendingPlay, setPendingPlay] = useState(false);
  const [openBoardIndex, setOpenBoardIndex] = useState<number | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

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
      // 이벤트 리스너 연결
      videoEl.addEventListener("loadedmetadata", () => {
        const d = videoEl.duration;
        if (Number.isFinite(d) && d > 0) {
          setVideoDuration(d);
        }
      });
      videoEl.addEventListener("play", () => {
        setHasPlaybackStarted(true);
        setIsPlaying(true);
        setActiveLineIndex(0);
        setLinePhase("enter");
        setShowFinalBlock(false);
      });
      videoEl.addEventListener("pause", () => {
        setIsPlaying(false);
        setActiveLineIndex(0);
        setLinePhase("enter");
        setShowFinalBlock(false);
        setPendingPlay(false);
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
        setPendingPlay(false);
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
            }, 1000);
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

  // pendingPlay 소비: mount 이후 자동 재생 시도
  useEffect(() => {
    if (!pendingPlay) return;
    const videoEl = videoOverlayRef.current?.querySelector("video") as HTMLVideoElement | null;
    if (!videoEl) return;

    let cancelled = false;
    const run = async () => {
      try {
        videoEl.muted = false;
        await videoEl.play();
        if (cancelled) return;
        setHasPlaybackStarted(true);
        setIsPlaying(true);
        setActiveLineIndex(0);
        setLinePhase("enter");
        setShowFinalBlock(false);
      } catch {
        if (!cancelled) setIsPlaying(false);
      } finally {
        if (!cancelled) setPendingPlay(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [pendingPlay]);

  // duration 기반 시퀀스 진행
  useEffect(() => {
    if (!hasPlaybackStarted || !isPlaying) return;
    if (!videoDuration || !Number.isFinite(videoDuration) || videoDuration <= 0) return;

    const total = HERO_SEQUENCE_17.length;
    if (total === 0) return;

    const timers: number[] = [];
    const LAST_HOLD_MS = 2000; // 마지막 단일 문구 유지 시간
    const effective = Math.max(0, videoDuration * 1000 - LAST_HOLD_MS);

    const lastIndex = total - 1;
    const linesToDistribute = Math.max(0, total); // 최종 블록은 별도 처리, 본문 라인 전부 분배

    if (linesToDistribute === 0) {
      // 본문 라인이 전혀 없으면 곧바로 최종 블록 2초만 표시
      setShowFinalBlock(true);
      const tHide = window.setTimeout(() => setShowFinalBlock(false), LAST_HOLD_MS);
      timers.push(tHide);
      return () => { timers.forEach((id) => clearTimeout(id)); };
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

    // 최종 블록: 본문 라인 종료 직후 2초만 표시
    const finalShowAt = Math.round(sliceMs * linesToDistribute);
    const tFinalShow = window.setTimeout(() => {
      setShowFinalBlock(true);
      const tFinalHide = window.setTimeout(() => {
        setShowFinalBlock(false);
      }, LAST_HOLD_MS);
      timers.push(tFinalHide);
    }, finalShowAt);
    timers.push(tFinalShow);

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
              style={{ backgroundImage: "url('/landing-assets/nigajun-17-hero-pc.webp.webp')" }}
            />
            <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
          </div>
          <div className={styles.heroOverlay}>
            <h1 className={styles.productTitle}>
              {product?.productName ?? "NIGAJUN 17"}
            </h1>
            <h1
              className={styles.videoTextWrap}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                opacity: (!hasPlaybackStarted && hideText && !isPlaying) ? 0 : 1,
                transition: "opacity 2s ease",
              }}
            >
              {/* 렌더 분기 */}
              {!hasPlaybackStarted && !hideText && (
                <>
                  <span>TONYWANG</span>
                  <br />
                  <span>NIGAJUN 17</span>
                  <br />
                  <span>Development of Plant Cell Genetic Protein</span>
                  <br />
                  <span>Molecular Bio-Bio-Bioengineering</span>
                  <br />
                  <span>Life is beautiful and tearful</span>
                </>
              )}

              {hasPlaybackStarted && isPlaying && !showFinalBlock && (
                <span
                  className={[
                    styles.videoText,
                    HERO_EMPHASIS_17[activeLineIndex] ? styles.videoTextEmphasis : "",
                    linePhase === "exit" ? styles.videoTextExit : "",
                  ].join(" ")}
                >
                  {HERO_SEQUENCE_17[activeLineIndex]}
                </span>
              )}
              {hasPlaybackStarted && showFinalBlock && (
                <span className={styles.videoFinalBlock}>{HERO_FINAL_BLOCK_17}</span>
              )}
              {!( (!hasPlaybackStarted && !hideText) || (hasPlaybackStarted && isPlaying && !showFinalBlock) || (hasPlaybackStarted && showFinalBlock) ) ? "" : null}
            </h1>
            <button
              type="button"
              className={styles.playButton}
              onClick={async () => {
                const video = videoOverlayRef.current?.querySelector("video") as HTMLVideoElement | null;
                if (!video) {
                  // 2초 이전 클릭 → 의도 저장
                  setPendingPlay(true);
                  return;
                }
                try {
                  if (video.paused) {
                    video.muted = false;
                    await video.play();
                    setHasPlaybackStarted(true);
                    setIsPlaying(true);
                    setActiveLineIndex(0);
                    setLinePhase("enter");
                    setShowFinalBlock(false);
                  } else {
                    video.pause();
                    video.currentTime = 0;
                    setIsPlaying(false);
                    setActiveLineIndex(0);
                    setLinePhase("enter");
                    setShowFinalBlock(false);
                    setPendingPlay(false);
                  }
                } catch {
                  setIsPlaying(false);
                  return;
                }
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
                <span className={styles.pcOnly}>
                  세포는 특정 신호에 반응하여 단백질을 과다 또는 과소 발현하고,
                </span>
                <span className={styles.mobileOnly}>
                  세포는 특정 신호에 반응하여 단백질을<br />
                  과다 또는 과소 발현하고,
                </span>
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
                <span className={styles.pcOnly}>
                  MMP 억제 단백질을 활용하여 모낭 구조 붕괴를 억제하며
                </span>
                <span className={styles.mobileOnly}>
                  MMP 억제 단백질을 활용하여 모낭 구조<br />
                  붕괴를 억제하며
                </span>
              </p>
              <p className={styles.detailOverlayText}>
                <span className={styles.pcOnly}>
                  염증 반응의 악순환을 차단하고 MMP-9 억제 단백질을 통해
                </span>
                <span className={styles.mobileOnly}>
                  염증 반응의 악순환을 차단하고 MMP-9 억제<br />
                  단백질을 통해
                </span>
              </p>
              <p className={styles.detailOverlayText}>
                염증 조직 손상을 완화하여 두피 환경의 균형 지원
              </p>
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

      <div className={styles.boardTopHeader}>
        <h2 className={styles.boardTopTitle}>
          <span className={styles.boardTitleBrand}>TONYWANG</span>
          <span className={styles.boardTitleSub}>Ask me Questions</span>
        </h2>
        <div className={styles.boardNotice}>
          <div className={styles.policyTitle}>Policy</div>

          <p>
            <span className={styles.policyHighlight}>Inquiry</span>
            &nbsp;Login 사용자 사용 합니다
          </p>

          <p>
            <span className={styles.policyHighlight}>Review</span>
            &nbsp;제품 구입 유저만 가능 합니다
          </p>
        </div>
        <div className={styles.boardActions}>
          <button type="button" className={styles.boardActionBtn}>
            Inquiry
          </button>
          <button type="button" className={styles.boardActionBtn}>
            Review
          </button>
        </div>
      </div>

      <section className={styles.boardSection}>
        <div className={styles.boardList}>
          <div className={styles.boardItem}>
            <button
              type="button"
              className={styles.boardRow}
              onClick={() => setOpenBoardIndex((prev) => (prev === 0 ? null : 0))}
            >
              <span className={styles.boardType}>[{PINNED_NOTICE.type}]</span>
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
                  <span className={styles.boardType}>[{item.type}]</span>
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
        <button
          type="button"
          className={styles.informationToggle}
          onClick={() => setIsInfoOpen((prev) => !prev)}
        >
          <span className={styles.informationTitle}>Information</span>
        </button>

        {isInfoOpen && (
          <div className={styles.informationContent}>
            <p>제품 핵심 설명입니다.</p>
            <p>사용 방법 및 특징을 간단히 설명합니다.</p>
            <p>주의사항 또는 추가 정보가 들어갑니다.</p>
          </div>
        )}
      </section>
    </article>
  );
}



