"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Nigajun17View.module.css";
import type { ProductBoardItem, ProductMinimal } from "@/app/products/_server/types";
import { maskBoardAuthor } from "@/app/products/boardMask";

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
  boardItems: ProductBoardItem[];
}

const PINNED_NOTICE = {
  author: "TONYWANG",
  preview: "공지 내용",
  type: "Notice",
  date: "2026.04.10",
  content: "공지 내용",
} as const;

export default function Nigajun17View({ product, boardItems }: Props) {
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
  const [boardTab, setBoardTab] = useState<"inquiry" | "review">("inquiry");
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryContent, setInquiryContent] = useState("");
  const inquirySendingRef = useRef(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const reviewSendingRef = useRef(false);
  const [inquiryIsPrivate, setInquiryIsPrivate] = useState(false);
  const [reviewIsPrivate, setReviewIsPrivate] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const filteredBoardItems = useMemo(() => {
    if (boardTab === "inquiry") {
      return boardItems.filter((i) => i.type === "Inquiry");
    }
    return boardItems.filter((i) => i.type === "Review");
  }, [boardItems, boardTab]);

  useEffect(() => {
    setOpenBoardIndex(null);
  }, [boardTab]);

  const handleInquirySubmit = async () => {
    const slug = product?.slug?.trim() ?? "";
    if (!slug) {
      window.alert("상품 정보가 없습니다.");
      return;
    }
    const content = inquiryContent.trim();
    if (!content) return;
    if (inquirySendingRef.current) return;
    inquirySendingRef.current = true;
    try {
      const res = await fetch("/api/products/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content, isPrivate: inquiryIsPrivate }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (data.ok) {
        setInquiryIsPrivate(false);
        window.location.reload();
        return;
      }
      window.alert(data.message ?? "저장에 실패했습니다.");
    } catch {
      window.alert("네트워크 오류가 발생했습니다.");
    } finally {
      inquirySendingRef.current = false;
    }
  };

  const handleReviewSubmit = async () => {
    const slug = product?.slug?.trim() ?? "";
    if (!slug) {
      window.alert("상품 정보가 없습니다.");
      return;
    }
    const content = reviewContent.trim();
    if (!content) return;
    if (reviewSendingRef.current) return;
    reviewSendingRef.current = true;
    try {
      const res = await fetch("/api/products/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content, isPrivate: reviewIsPrivate }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (data.ok) {
        setReviewIsPrivate(false);
        window.location.reload();
        return;
      }
      window.alert(data.message ?? "리뷰 등록에 실패했습니다.");
    } catch {
      window.alert("네트워크 오류가 발생했습니다.");
    } finally {
      reviewSendingRef.current = false;
    }
  };

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

              <p className={styles.heroPrice}>
                {typeof product?.finalPriceAmount === "number"
                  ? `₩${product.finalPriceAmount.toLocaleString()}`
                  : null}
              </p>

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
          <button
            type="button"
            className={`${styles.boardActionBtn} ${boardTab === "inquiry" ? styles.boardActionBtnActive : ""}`}
            onClick={() => {
              setBoardTab("inquiry");
              setShowInquiryForm(true);
            }}
          >
            Inquiry
          </button>
          <button
            type="button"
            className={`${styles.boardActionBtn} ${boardTab === "review" ? styles.boardActionBtnActive : ""}`}
            onClick={() => {
              setBoardTab("review");
              setShowReviewForm(true);
            }}
          >
            Review
          </button>
        </div>
      </div>

      {boardTab === "inquiry" && showInquiryForm ? (
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto 16px",
            padding: "0 16px",
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>문의 작성</label>
          <textarea
            value={inquiryContent}
            onChange={(e) => setInquiryContent(e.target.value)}
            rows={5}
            style={{
              width: "100%",
              boxSizing: "border-box",
              minHeight: 200,
              padding: 16,
              fontSize: 16,
              lineHeight: 1.7,
              borderRadius: 4,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              resize: "none",
            }}
            placeholder="내용을 입력하세요"
          />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 8,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={inquiryIsPrivate}
              onChange={(e) => setInquiryIsPrivate(e.target.checked)}
            />
            비밀글
          </label>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button type="button" onClick={handleInquirySubmit} style={{ padding: "6px 14px", fontSize: 14, cursor: "pointer" }}>
              작성
            </button>
          </div>
        </div>
      ) : null}

      {boardTab === "review" && showReviewForm ? (
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto 16px",
            padding: "0 16px",
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>리뷰 작성</label>
          <textarea
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            rows={5}
            style={{
              width: "100%",
              boxSizing: "border-box",
              minHeight: 200,
              padding: 16,
              fontSize: 16,
              lineHeight: 1.7,
              borderRadius: 4,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              resize: "none",
            }}
            placeholder="리뷰 내용을 입력하세요"
          />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 8,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={reviewIsPrivate}
              onChange={(e) => setReviewIsPrivate(e.target.checked)}
            />
            비밀글
          </label>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button type="button" onClick={handleReviewSubmit} style={{ padding: "6px 14px", fontSize: 14, cursor: "pointer" }}>
              리뷰 등록
            </button>
          </div>
        </div>
      ) : null}

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

          {filteredBoardItems.map((item, i) => {
            const rowIndex = i + 1;
            const preview =
              item.isPrivate
                ? "비밀글입니다"
                : item.content.length > 8
                  ? item.content.slice(0, 8) + "..."
                  : item.content;
            return (
              <div key={item.id} className={styles.boardItem}>
                <button
                  type="button"
                  className={styles.boardRow}
                  onClick={() => setOpenBoardIndex((prev) => (prev === rowIndex ? null : rowIndex))}
                >
                  <span className={styles.boardType}>[{item.type}]</span>
                  <span className={styles.boardPreviewAuthor}>
                    {item.isPrivate ? maskBoardAuthor(item.author) : item.author}
                  </span>
                  <span
                    className={styles.boardPreviewText}
                    style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {preview}
                  </span>
                </button>
                {openBoardIndex === rowIndex ? (
                  <div className={styles.boardExpanded}>
                    <div className={styles.boardMeta}>{item.type}</div>
                    <div className={styles.boardDate}>{item.date}</div>
                    <div className={styles.boardContent}>
                      {item.isPrivate && !item.canViewFullContent ? "비밀글입니다" : item.content}
                    </div>
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



