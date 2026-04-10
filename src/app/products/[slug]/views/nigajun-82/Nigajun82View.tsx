"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Nigajun82View.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

// 82 전용 시퀀스 상수(파일 내 전용, 원문/순서 변경 없음)
const HERO_SEQUENCE_82: string[] = [
  "TONYWANG",
  "NIGAJUN82",
  "I love you.for ever",
  "I want to be the only woman you have",
  "I want to be a woman loved by you",
  "Because I love you",
  "I want to be by your side all the time",
  "You need to know how I feel",
  "Our time",
  "our place",
  "The path we walked",
  "I love all of this",
  "I don't want to lose you to anyone else then",
  "I think I'll be so sad",
  "I don't think I can handle it",
  "I always pray to the Lord",
  "i want us to be happy forever",
  "Pray for our love to be with you forever",
  "When I see you, my heart always beats vigorously",
  "When I think of you, my heart heats up",
  "I love you forever.",
];
// "TONYWANG"만 강조(25px), 나머지 14px
const HERO_EMPHASIS_82: boolean[] = [
  true, // "TONYWANG"
  false, // "NIGAJUN82"
  false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false,
];
// 최종 블록(필요 시 전체 합본 표기)
const HERO_FINAL_BLOCK_82: string = "Since August 2025 TONYWANG";

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

export default function Nigajun82View({ product }: Props) {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const [hideText, setHideText] = useState(false);

  // 시퀀스용 최소 상태 (hideText는 2초 intro 전용으로 유지)
  const [hasPlaybackStarted, setHasPlaybackStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);
  const [linePhase, setLinePhase] = useState<"enter" | "hold" | "exit">("enter");
  const [showFinalBlock, setShowFinalBlock] = useState(false);
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

      // pause: 상태 초기화(0초 복귀는 버튼/ended에서 처리됨)
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

  // duration 기반 시퀀스 진행(균등 분배)
  useEffect(() => {
    if (!hasPlaybackStarted || !isPlaying) {
      return;
    }
    if (!videoDuration || !Number.isFinite(videoDuration) || videoDuration <= 0) {
      return;
    }

    const total = HERO_SEQUENCE_82.length;
    if (total === 0) {
      return;
    }

    const timers: number[] = [];
    const FINAL_BLOCK_MS = 4000;
    const effective = Math.max(0, videoDuration * 1000 - FINAL_BLOCK_MS);

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

    const sliceMs = effective / total;
    const enterMs = sliceMs * 0.2;
    const holdMs = sliceMs * 0.6;
    const exitMs = sliceMs * 0.2;
    void exitMs; // 변수 의도상 유지(가독성)

    for (let i = 0; i < total; i++) {
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

    const lastEnd = Math.round(sliceMs * total);
    const tFinalShow = window.setTimeout(() => {
      setShowFinalBlock(true);
      const tFinalHide = window.setTimeout(() => {
        setShowFinalBlock(false);
      }, FINAL_BLOCK_MS);
      timers.push(tFinalHide);
    }, lastEnd);
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
              style={{ backgroundImage: "url('/landing-assets/nigajun-82-hero-pc.webp.webp')" }}
            />
            <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
          </div>
          <div className={styles.heroOverlay}>
            <h1 className={styles.productTitle}>
              {product?.productName ?? "NIGAJUN 82"}
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
                  <span>NIGAJUN 82</span>
                  <br />
                  <span>Development of Plant Cell Genetic Protein</span>
                  <br />
                  <span>Molecular Bio-Bio-Bioengineering</span>
                  <br />
                  <span>You have to love yourself</span>
                </>
              )}

              {/* 재생 중: 1줄 시퀀스 또는 최종 블록 */}
              {isPlaying && !showFinalBlock && (
                <span
                  className={[
                    styles.videoText,
                    HERO_EMPHASIS_82[activeLineIndex] ? styles.videoTextEmphasis : "",
                    linePhase === "exit" ? styles.videoTextExit : "",
                  ].join(" ")}
                >
                  {HERO_SEQUENCE_82[activeLineIndex]}
                </span>
              )}
              {isPlaying && showFinalBlock && (
                <span className={styles.videoFinalBlock}>{HERO_FINAL_BLOCK_82}</span>
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
                        // 실패 시 상태 전환 금지
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
                <span className={styles.pcOnly}>
                  The main reason is the formation of an environment favorable for
                </span>
                <span className={styles.mobileOnly}>
                  The main reason is the formation of an environment favorable for pathogenic microbial growth.
                </span>
              </p>
              <p className={styles.detailDescription}>
                <span className={styles.pcOnly}>pathogenic microbial growth.</span>
                <span className={styles.mobileOnly}></span>
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
        <p className={styles.detailCopyText}>
          Since August 2025 TONYWANG
        </p>
      </section>

      <div className={styles.detailEndGlowLine} aria-hidden="true" />

      <div className={styles.boardTopHeader}>
        <h2 className={styles.boardTopTitle}>Ask me Questions TONYWANG</h2>
        <button type="button" className={styles.writeButton}>
          Write
        </button>
      </div>

      <section className={styles.boardSection}>
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



