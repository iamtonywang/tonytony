"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Nigajun44View.module.css";
import type { ProductBoardItem, ProductMinimal } from "@/app/products/_server/types";
import { formatBoardRowAuthor } from "@/app/products/boardMask";

function maskBoardAuthor(author: string) {
  if (!author) return "User";
  if (author.length <= 2) return author[0] + "*";
  return author[0] + "*".repeat(author.length - 2) + author.slice(-1);
}

interface Props {
  product?: ProductMinimal;
  boardItems: ProductBoardItem[];
}

const HERO_SEQUENCE = [
  "TONYWANG",
  "NIGAJUN 44",
  "It's not age that your skin is getting old,",
  "it's because your cells are tired",
  "Okay.",
  "I spent 28 years studying cells",
  "Everyone must have had a crazy challenge",
  "at least once in their lives",
  "And.",
  "With countless sighs, tears,",
  "and heart-wrenching pain",
  "It is divided into those",
  "who challenge and those who give up",
  "Yes, this is life",
  "It's a trail of time that everyone",
  "experiences in a panoramic life",
  "The failure and success we have in the",
  "8.2 billion population is a part of that",
  "The only genetic protein",
  "that transforms new skin tissue",
  "Plant Cell Gene Protein",
  "SINCE  August 2025 TONYWANG",
];

const HERO_EMPHASIS = [
  "TONYWANG",
  "NIGAJUN 44",
  "Okay.",
  "And.",
  "Yes, this is life",
];

const HERO_FINAL_BLOCK = [
  "TONYWANG",
  "NIGAJUN 44",
  "It's not age that your skin is getting old,",
  "it's because your cells are tired",
  "Okay.",
  "I spent 28 years studying cells",
  "Everyone must have had a crazy challenge",
  "at least once in their lives",
  "And.",
  "With countless sighs, tears,",
  "and heart-wrenching pain",
  "It is divided into those",
  "who challenge and those who give up",
  "Yes, this is life",
  "It's a trail of time that everyone",
  "experiences in a panoramic life",
  "The failure and success we have in the",
  "8.2 billion population is a part of that",
  "The only genetic protein",
  "that transforms new skin tissue",
  "Plant Cell Gene Protein",
  "SINCE  August 2025 TONYWANG",
].join("\n");

const PINNED_NOTICE = {
  author: "TONYWANG",
  preview: "공지 내용",
  type: "Notice",
  date: "2026.04.10",
  content: "공지 내용",
} as const;

function HeroSection({ product }: { product?: ProductMinimal }) {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const isTogglePendingRef = useRef(false);
  const [hideText, setHideText] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [linePhase, setLinePhase] = useState<"enter" | "exit">("enter");
  const [showFinalBlock, setShowFinalBlock] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

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
      videoEl.addEventListener("loadedmetadata", () => {
        const duration = videoEl.duration;
        if (Number.isFinite(duration) && duration > 0) {
          setVideoDuration(duration);
        }
      });
      videoEl.addEventListener("play", () => {
        setIsPlaying(true);
      });
      videoEl.addEventListener("pause", () => {
        setIsPlaying(false);
      });
      videoEl.addEventListener("ended", () => {
        try {
          videoEl.pause();
          videoEl.currentTime = 0;
        } catch {}
        setHideText(true);
        setActiveLineIndex(0);
        setLinePhase("enter");
        setShowFinalBlock(false);
        setIsPlaying(false);
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

  useEffect(() => {
    if (!hideText || !isPlaying) {
      setActiveLineIndex(0);
      setLinePhase("enter");
      setShowFinalBlock(false);
      return;
    }

    if (videoDuration === null) {
      return;
    }

    if (!Number.isFinite(videoDuration) || videoDuration <= 0) {
      return;
    }

    if (showFinalBlock) {
      return;
    }

    const isLast = activeLineIndex >= HERO_SEQUENCE.length - 1;
    const availableDuration = Math.max(8, videoDuration - 5);
    const stepDuration = availableDuration / HERO_SEQUENCE.length;
    const exitAt = stepDuration * 0.72;
    const nextAt = stepDuration;

    const lineVisibleMs = Math.max(300, Math.round(exitAt * 1000));
    const nextStepMs = Math.max(lineVisibleMs + 100, Math.round(nextAt * 1000));

    setLinePhase("enter");

    const exitTimer = window.setTimeout(() => {
      setLinePhase("exit");
    }, lineVisibleMs);

    const nextTimer = window.setTimeout(() => {
      if (isLast) {
        setShowFinalBlock(true);
        return;
      }

      setActiveLineIndex((prev) => Math.min(prev + 1, HERO_SEQUENCE.length - 1));
    }, nextStepMs);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(nextTimer);
    };
  }, [hideText, isPlaying, activeLineIndex, showFinalBlock, videoDuration]);

  return (
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
          {!hideText && (
            <div className={styles.heroFallbackText}>
              <p>TONYWANG</p>
              <p>NIGAJUN 44</p>
              <p>Plant Cell Gene Recombination</p>
              <p>Protein Laboratory</p>
            </div>
          )}
          {hideText && (
            <div className={styles.heroMotionOverlay}>
              {isPlaying && !showFinalBlock ? (
                <p
                  className={`${styles.heroSequenceLine} ${
                    linePhase === "enter" ? styles.heroSequenceEnter : styles.heroSequenceExit
                  } ${
                    HERO_EMPHASIS.includes(HERO_SEQUENCE[activeLineIndex])
                      ? styles.heroSequenceEmphasis
                      : ""
                  }`}
                >
                  {HERO_SEQUENCE[activeLineIndex]}
                </p>
              ) : isPlaying && showFinalBlock ? (
                <div className={styles.heroFinalBlock}>
                  {HERO_FINAL_BLOCK.split("\n").map((line, idx) => (
                    <p
                      key={`${line}-${idx}`}
                      className={`${styles.heroFinalLine} ${
                        HERO_EMPHASIS.includes(line) ? styles.heroFinalLineEmphasis : ""
                      }`}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          )}
          <button
            type="button"
            className={styles.playButton}
            onClick={async () => {
              if (isTogglePendingRef.current) {
                return;
              }

              const video = videoOverlayRef.current?.querySelector("video") as HTMLVideoElement | null;
              if (!video) {
                return;
              }

              isTogglePendingRef.current = true;
              try {
                if (video.paused || video.ended) {
                  if (video.ended) {
                    try {
                      video.currentTime = 0;
                    } catch {}
                  }
                  video.muted = false;
                  await video.play();
                  setHideText(true);
                  setIsPlaying(true);
                  setActiveLineIndex(0);
                  setLinePhase("enter");
                  setShowFinalBlock(false);
                } else {
                  video.pause();
                  setIsPlaying(false);
                }
              } catch (error) {
                if (!(error instanceof DOMException && error.name === "AbortError")) {
                  console.error(error);
                }
                setIsPlaying(false);
              } finally {
                isTogglePendingRef.current = false;
              }
            }}
            aria-label="Toggle video playback"
          />
        </div>
      </div>
    </section>
  );
}

function DetailVisualSection({ product }: { product?: ProductMinimal }) {
  return (
    <section className={styles.detailVisualSection}>
      <div className={styles.detailVisualMedia}>
        <img
          className={styles.detailVisualImage}
          src="/landing-assets/hero-main-pc.webp"
          alt="TONYWANG product visual"
          draggable={false}
          loading="lazy"
          decoding="async"
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
  );
}

function BoardSection({
  boardItems,
  productSlug,
}: {
  boardItems: ProductBoardItem[];
  productSlug: string | null;
}) {
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
    const slug = productSlug?.trim() ?? "";
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
    const slug = productSlug?.trim() ?? "";
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

  return (
    <>
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
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.2)",
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
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.2)",
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
              }}
              onClick={() => setOpenBoardIndex((prev) => (prev === 0 ? null : 0))}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexShrink: 0,
                  minWidth: 110,
                }}
              >
                <span className={styles.boardType}>[{PINNED_NOTICE.type}]</span>
                <span className={styles.boardPreviewAuthor}>
                  {formatBoardRowAuthor(PINNED_NOTICE.author)}
                </span>
              </div>
              <div
                className={styles.boardPreviewText}
                style={{
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {PINNED_NOTICE.preview}
              </div>
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                  }}
                  onClick={() => setOpenBoardIndex((prev) => (prev === rowIndex ? null : rowIndex))}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      flexShrink: 0,
                      minWidth: 110,
                    }}
                  >
                    <span className={styles.boardType}>[{item.type}]</span>
                    <span className={styles.boardPreviewAuthor}>
                      {item.isPrivate ? maskBoardAuthor(item.author) : item.author}
                    </span>
                  </div>
                  <div
                    className={styles.boardPreviewText}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {preview}
                  </div>
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
    </>
  );
}

export default function Nigajun44View({ product, boardItems }: Props) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <article className={styles.detailPage}>
      <HeroSection product={product} />
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

      <DetailVisualSection product={product} />

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
            The reality is that a research and development<br />
            system built at the level
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

      <BoardSection boardItems={boardItems} productSlug={product?.slug ?? null} />

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
            <div className={styles.infoBlock}>
              <div className={styles.infoTitle}>사용방법 및 보관·규칙사항</div>
              <div className={styles.infoText}>
                필수 사용 사항
                <br />
                저녁 취침 전 사용
              </div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoTitle}>절대 금지 사항</div>
              <div className={styles.infoText}>타사 제품 혼용 금지</div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoTitle}>보관 사항</div>
              <div className={styles.infoText}>97% 단백질 · 필수 냉장 보관</div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoTitle}>권장 사항</div>
              <div className={styles.infoText}>
                44일 Soft 메이크업 사용 차단용 화장품 사용 금지
              </div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoTitle}>사용 시 주의사항</div>
              <div className={styles.infoText}>
                [사용할 때의 주의사항]
                <br />
                화장품 사용 시 또는 사용 후 직사광선에 의하여
                <br />
                사용 부위가 붉은 반점, 부어오름 또는 가려움증 등의
                <br />
                이상 증상이나 부작용이 있는 경우에는
                <br />
                전문의 등과 상담할 것
                <br />
                상처가 있는 부위 등에는 사용을 자제할 것
              </div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoTitle}>보관 및 취급 시 주의사항</div>
              <div className={styles.infoText}>
                어린이의 손이 닿지 않는 곳에 보관할 것
                <br />
                직사광선을 피해서 보관할 것
              </div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoTitle}>제품 전체 정보</div>
              <div className={styles.infoText}>
                제품명 nigajun 44
                <br />
                용량 50ML
                <br />
                제품주요사항 얼굴 피부용
                <br />
                사용 기한 제조일로부터 18개월 / 개봉 후 8개월
                <br />
                사용 방법 아침·저녁 적당량을 얼굴 전체에 두텁게 흡수
                <br />
                제품 개발사 TONYWANG
                <br />
                화장품 제조업자 제품 내 별도 표기
                <br />
                화장품 판매업자 제품 내 별도 표기
                <br />
                제조국 대한민국
                <br />
                기능성 심사 필 여부 _
                <br />
                소비자 상담실 070 4488 8800
                <br />
                품질보증기준 본 제품은 공정거래위원회 고시 소비자분쟁해결 기준에 의거 교환 또는 보상 받을 수 있습니다.
              </div>
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
