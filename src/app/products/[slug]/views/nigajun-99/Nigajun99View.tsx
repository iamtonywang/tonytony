"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Nigajun99View.module.css";
import type { ProductBoardItem, ProductMinimal } from "@/app/products/_server/types";
import { maskBoardAuthor } from "@/app/products/boardMask";

// 99 전용 시퀀스/강조/최종 블록 상수 (파일 내 전용, 44 복붙 금지)
const HERO_SEQUENCE: string[] = [
  "TONYWANG",
  "NIGAJUN 99",
  "Shout out that it hurts",
  "shout about bullying",
  "Shout out that you want to cry",
  "No one knows your pain",
  "It's a hell of a life",
  "I fell for it",
  "He said he would fix everything",
  "But",
  "It was all a lie",
  "hold in contempt",
  "I hate you.",
  "It was not a human being",
  "Curse them",
  "TONYWANG",
  "28 years",
  "I studied skin diseases",
  "I've done my research",
  "I developed bacteria",
  "And.",
  "I'm gonna tell you that everyone's been tricked",
  "It was all a lie. Let me tell you",
];

// 라인 강조 여부(인덱스 기준). 필요한 라인만 true.
const HERO_EMPHASIS: boolean[] = [
  true,  // "TONYWANG"
  false, // "NIGAJUN 99"
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  true,  // "TONYWANG" (두 번째 TONYWANG)
  false,
  false,
  false,
  false,
  false,
  false,
  false,
];

// 최종 블록 표시용(필요 시 전체 문구 합본)
const HERO_FINAL_BLOCK: string = `TONYWANG
The itching of the skin is a very painful and painful condition
Many companies can improve
But the reality is just a lie
I don't know the biological mechanism of skin
itching To solve with simple anti-inflammatory
chemicals, sea salt substances, and various hegemonic raw materials
There are many disadvantages Excessive publicity
will only cause more pain and frustration
for users suffering from the itching.
Stop it now.
The pain of being hurt by lies is even greater
SINCE August 2025 TONYWANG`;

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

export default function Nigajun99View({ product, boardItems }: Props) {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const [hideText, setHideText] = useState(false);

  // Hero 시퀀스 제어용 최소 상태 (hideText와 역할 분리)
  const [hasPlaybackStarted, setHasPlaybackStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);
  const [linePhase, setLinePhase] = useState<"enter" | "hold" | "exit">("enter");
  const [showFinalBlock, setShowFinalBlock] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [openBoardIndex, setOpenBoardIndex] = useState<number | null>(null);
  const [boardTab, setBoardTab] = useState<"inquiry" | "review" | "secret">("inquiry");
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
    if (boardTab === "review") {
      return boardItems.filter((i) => i.type === "Review");
    }
    return boardItems.filter((i) => i.isPrivate);
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

      // loadedmetadata: 유효 duration만 반영
      videoEl.addEventListener("loadedmetadata", () => {
        const d = Number.isFinite(videoEl.duration) ? videoEl.duration : NaN;
        if (!Number.isNaN(d) && d > 0 && d !== Infinity) {
          setVideoDuration(d);
        }
      });

      // play: 실제 재생 성공 시에만 시퀀스 시작
      videoEl.addEventListener("play", () => {
        setIsPlaying(true);
        setHasPlaybackStarted(true);
        setActiveLineIndex(0);
        setLinePhase("enter");
        setShowFinalBlock(false);
      });

      // pause: 0초 복귀는 버튼/ended에서 처리되므로 상태만 초기화
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
        // 종료 후 상태 초기화
        setIsPlaying(false);
        setActiveLineIndex(0);
        setLinePhase("enter");
        setShowFinalBlock(false);
      });

      // connect asset source (single pc asset as default)
      videoEl.src = "/landing-assets/nigajun-99-hero-pc.mp4.mp4";

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

  // duration 기반 시퀀스 진행 (균등 분배)
  useEffect(() => {
    if (!hasPlaybackStarted || !isPlaying) {
      return;
    }
    if (!videoDuration || !Number.isFinite(videoDuration) || videoDuration <= 0) {
      return;
    }

    const totalLines = HERO_SEQUENCE.length;
    if (totalLines === 0) {
      return;
    }

    const timers: number[] = [];

    // 마지막 2초는 최종 블록 전용으로 예약
    const FINAL_BLOCK_MS = 2000;
    const effective = Math.max(0, videoDuration * 1000 - FINAL_BLOCK_MS);

    // 유효 시간이 없다면, 바로 최종 블록을 2초만 노출
    if (effective === 0) {
      setShowFinalBlock(true);
      const hideFinal = window.setTimeout(() => {
        setShowFinalBlock(false);
      }, FINAL_BLOCK_MS);
      timers.push(hideFinal);
      return () => {
        timers.forEach((id) => clearTimeout(id));
      };
    }

    const sliceMs = effective / totalLines;
    // 각 라인의 enter:hold:exit = 20%:60%:20%
    const enterMs = sliceMs * 0.2;
    const holdMs = sliceMs * 0.6;
    const exitMs = sliceMs * 0.2;

    // 라인별 스케줄
    for (let i = 0; i < totalLines; i++) {
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

    // 최종 블록: 마지막 라인 종료 직후 등장, 정확히 2초만 표시
    const lastLineEnd = Math.round(sliceMs * totalLines);
    const tFinalShow = window.setTimeout(() => {
      setShowFinalBlock(true);
      const tFinalHide = window.setTimeout(() => {
        setShowFinalBlock(false);
      }, FINAL_BLOCK_MS);
      timers.push(tFinalHide);
    }, lastLineEnd);
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
              style={{ backgroundImage: "url('/landing-assets/nigajun-99-hero-pc.webp.webp')" }}
            />
            <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
          </div>
          <div className={styles.heroOverlay}>
            <h1 className={styles.productTitle}>
              {product?.productName ?? "NIGAJUN 99"}
            </h1>

            <h1
              className={styles.videoTextWrap}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                // 재생 중에는 시퀀스가 보이도록, hideText가 true여도 보이게 함
                opacity: hideText && !isPlaying ? 0 : 1,
                transition: "opacity 2s ease",
              }}
            >
              {/* 재생 전: 기존 intro 문구 유지 (hideText로 페이드) */}
              {!isPlaying && (
                <>
                  <span>TONYWANGNIGAJUN 99</span>
                  <br />
                  <span>Development of Plant Cell Genetic Protein</span>
                  <br />
                  <span>Molecular Bio-Bio-Bioengineering</span>
                  <br />
                  <span>You must be freed from pain</span>
                  <br />
                  <span>What&apos;s the new change?</span>
                </>
              )}

              {/* 재생 중: 시퀀스 또는 최종 블록 */}
              {isPlaying && !showFinalBlock && (
                <span
                  className={[
                    styles.videoText,
                    HERO_EMPHASIS[activeLineIndex] ? styles.videoTextEmphasis : "",
                    linePhase === "exit" ? styles.videoTextExit : "",
                  ].join(" ")}
                >
                  {HERO_SEQUENCE[activeLineIndex]}
                </span>
              )}
              {isPlaying && showFinalBlock && (
                <span
                  className={[
                    styles.videoFinalBlock,
                    HERO_FINAL_BLOCK.includes("TONYWANG") ? styles.videoTextEmphasis : "",
                  ].join(" ")}
                >
                  {HERO_FINAL_BLOCK}
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
                    const p = video.play();
                    if (p && typeof p.then === "function") {
                      p.then(() => {
                        // 재생 성공 시 상태는 play 이벤트에서 설정
                      }).catch(() => {
                        // 재생 실패 시 아무 것도 하지 않음(상태 전환 금지)
                      });
                    }
                  } else {
                    video.pause();
                    video.currentTime = 0;
                    // 정지 시 시퀀스 상태 초기화
                    setIsPlaying(false);
                    setActiveLineIndex(0);
                    setLinePhase("enter");
                    setShowFinalBlock(false);
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
        <h2 className={styles.detailIntroLead}>NIGAJUN 99</h2>
        <h3 className={styles.detailIntroSubTitle}>Proteo Phyto Complex</h3>
        <p className={styles.detailIntroText}>Skincare for alleviating itching on the skin</p>
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

              <p className={styles.detailDescription}>
                피부 가려움증 매우 괴롭고 힘든 고통스런 질환이다
              </p>
              <p className={styles.detailDescription}>
                많은 기업들이 개선 할수 있다고 한다
              </p>
              <p className={styles.detailDescription}>
                그러나 현실은 거짓에 불과하다
              </p>
              <p className={styles.detailDescription}>
                피부 가려움증의 생물학적 메커니즘 모르고
                <br className={styles.mobileOnly} />
                단순 항염 케미컬 물질과 천염물질
              </p>
              <p className={styles.detailDescription}>
                그리고
                <br className={styles.mobileOnly} />
                각종 헤게모니 원료를 앞세워 해결하기에는
                <br className={styles.mobileOnly} />
                부족한 부분이 많다
              </p>
              <p className={styles.detailDescription}>
                과대하게 부풀린 홍보는 가려움에 의한
                <br className={styles.mobileOnly} />
                고통스런 유저들에게 더 고통과 좌절감을 줄뿐이다
              </p>
              <p className={styles.detailDescription}>
                이제 그만 멈춰라
              </p>
              <p className={styles.detailDescription}>
                거짓에 의한 상처받는고통이 더욱 크다
              </p>

              <p className={styles.detailDescription}>
                The itching of the skin is a very painful and painful condition
              </p>
              <p className={styles.detailDescription}>
                Many companies can improve But the reality is just a lie
              </p>
              <p className={styles.detailDescription}>
                I don&apos;t know the biological mechanism of skin itching To solve with simple anti-inflammatory chemicals, sea salt substances, and various hegemonic raw materials
              </p>
              <p className={styles.detailDescription}>
                There are many disadvantages<br />
                Excessive publicity will only cause more pain and frustration for users suffering from the itching.<br />
                Stop it now.<br />
                The pain of being hurt by lies is even greater
              </p>

              <p className={styles.heroPrice}>
                {typeof product?.finalPriceAmount === "number"
                  ? `₩${product.finalPriceAmount.toLocaleString()}`
                  : null}
              </p>

              <div className={styles.detailCtaRow} style={{ marginTop: '24px' }}>
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
          <span className={styles.pcOnly}>
            Someone needs to shout the truth, correct the wrongs and clean up the dirt with lies and tricks
          </span>
          <span className={styles.mobileOnly}>
            Someone needs to shout the truth, correct the wrongs<br />
            and clean up the dirt with lies and tricks
          </span>
        </p>
        <p className={styles.detailCopyText}>
          Since August 2025 TONYWANG
        </p>
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
          <button
            type="button"
            className={`${styles.boardActionBtn} ${boardTab === "secret" ? styles.boardActionBtnActive : ""}`}
            onClick={() => setBoardTab("secret")}
          >
            Secret
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
              padding: 8,
              fontSize: 14,
              borderRadius: 4,
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
              padding: 8,
              fontSize: 14,
              borderRadius: 4,
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
                  <span className={styles.boardPreviewText}>{item.isPrivate ? "비밀글입니다" : item.preview}</span>
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



