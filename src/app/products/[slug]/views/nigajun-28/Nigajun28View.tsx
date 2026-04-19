"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Nigajun28View.module.css";
import type { ProductBoardItem, ProductMinimal } from "@/app/products/_server/types";
import { formatBoardRowAuthor } from "@/app/products/boardMask";

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
  "SINCE May 2026",
];
// TONYWANG만 25px, 나머지 14px
const HERO_EMPHASIS_28: boolean[] = HERO_SEQUENCE_28.map((line) => line === "TONYWANG");

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

export default function Nigajun28View({ product, boardItems }: Props) {
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


      <section className={styles.detailLowerCopySection}>
        <div className={styles.detailLowerCopyInner}>
          <h1 className={styles.detailLowerTitle}></h1>

          <p className={styles.detailLowerText}>
            <span className={styles.pcOnly}>
              <span className={styles.highlight20}>NIGAJUN 28</span>
              <br />
              <br />
              수십 년 동안 <span className={styles.highlight20Orange}>치약은 같은 방식</span>으로 만들어졌어.{" "}
              <span className={styles.highlight20}>세균을</span> 제거하고, 입안을 깨끗하게 만드는 것.
              <br />
              <br />
              <span className={styles.highlight20}>구강 건강은</span> 단순한 세정의 문제가 아냐 구강은 수많은 미생물과 세포가 공존하는{" "}
              <span className={styles.highlight20}>생물학적</span> 생태계 잇몸 조직은 끊임없이{" "}
              <span className={styles.highlight20}>염증 반응과 회복 과정을</span> 반복하는 생체 조직 Genetic Toothpaste
              <br />
              <br />
              이 지점에서 시작했어 치약을 단순한 세정 제품이 아니라 구강 조직의 <span className={styles.highlight20}>생물학적</span> 신호를 조절하는
              <br />
              <br />
              바이오 플랫폼으로 재정의했어.
              <br />
              <br />
              Proteo Phyto Complex 재 설계된 <span className={styles.highlight20}>활성 분자 시스템</span>은 식물세포에서 유래한 단백질,
              <br />
              <br />
              펩타이드, 폴리페놀 및 항산화 <span className={styles.highlight20}>생체 분자가</span> 결합된 Bioactive Molecular 시스템이다
              <br />
              <br />
              SINCE May 2026
            </span>

            <span className={styles.mobileOnly}>
              <span className={styles.highlight20}>NIGAJUN 28</span>
              <br />
              <br />
              수십 년 동안 <span className={styles.highlight20Orange}>치약은 같은 방식</span>으로 만들어졌어.
              <br />
              <span className={styles.highlight20}>세균을</span> 제거하고, 입안을 깨끗하게 만드는 것.
              <br />
              <br />
              <span className={styles.highlight20}>구강 건강은</span> 단순한 세정의 문제가 아냐
              <br />
              구강은 수많은 미생물과 세포가 공존하는 <span className={styles.highlight20}>생물학적</span> 생태계
              <br />
              잇몸 조직은 끊임없이 <span className={styles.highlight20}>염증 반응과 회복 과정을</span> 반복하는 생체 조직
              <br />
              Genetic Toothpaste
              <br />
              <br />
              이 지점에서 시작했어
              <br />
              치약을 단순한 세정 제품이 아니라 구강 조직의 <span className={styles.highlight20}>생물학적</span> 신호를 조절하는
              <br />
              <br />
              바이오 플랫폼으로 재정의했어.
              <br />
              <br />
              Proteo Phyto Complex 재 설계된 <span className={styles.highlight20}>활성 분자 시스템</span>은 식물세포에서 유래한 단백질,
              <br />
              펩타이드, 폴리페놀 및 항산화 <span className={styles.highlight20}>생체 분자가</span> 결합된 Bioactive Molecular 시스템이다
              <br />
              <br />
              SINCE May 2026
            </span>
          </p>

          <p className={styles.detailLowerPrice}>
            {typeof product?.finalPriceAmount === "number"
              ? `₩${product.finalPriceAmount.toLocaleString()}`
              : null}
          </p>

          <div className={styles.detailLowerCtaRow}>
            <Link href={`/purchase/${product?.slug ?? ""}`} className={styles.detailLowerBuyButton}>
              Buy Now
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.detailBottomGlowLine} aria-hidden="true" />

      <section className={styles.detailCopySection}>
        <p className={styles.detailCopyText}>TONYWANG</p>
        <p className={styles.detailCopyText}>
          Someone needs to shout the truth, correct the wrongs and clean up the dirt with lies and tricks
        </p>
        <p className={styles.detailCopyText}>SINCE May 2026</p>
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
                      {formatBoardRowAuthor(item.author)}
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
                      {item.isPrivate && !item.canViewFullContent ? (
                        "비밀글입니다"
                      ) : (
                        <>
                          <div>{item.content}</div>
                          {item.answerContent && (
                            <div style={{ marginTop: 8 }}>
                              <strong>답변</strong>: {item.answerContent}
                            </div>
                          )}
                        </>
                      )}
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



