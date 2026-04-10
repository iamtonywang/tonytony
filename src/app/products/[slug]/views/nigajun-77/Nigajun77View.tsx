"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Nigajun77View.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

// 77 전용 시퀀스(원문/순서 그대로 적용)
const HERO_SEQUENCE_77: string[] = [
  "TONYWANG",
  "NIGAJUN77",
  "Lower Body Fat Improvement Cream",
  "person who doesn't know the value of something",
  "man who doesn't love himself",
  "questioner",
  "be ineligible",
  "Get out of here",
  "person who really wants to change",
  "Welcome.",
  "What does a long explanation need",
  "I don't need lies",
  "You don't have to say it's the best",
  "I don't want to be like them",
  "SINCE August 2025 TONYWANG",
];
// TONYWANG만 강조(25px), 나머지 14px
const HERO_EMPHASIS_77: boolean[] = HERO_SEQUENCE_77.map((line) => line === "TONYWANG");

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

export default function Nigajun77View({ product }: Props) {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const [hideText, setHideText] = useState(false);
  // 시퀀스 제어 상태 (hideText는 2초 intro 전용 유지)
  const [hasPlaybackStarted, setHasPlaybackStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);
  const [linePhase, setLinePhase] = useState<"enter" | "hold" | "exit">("enter");
  const [showFinalBlock, setShowFinalBlock] = useState(false); // 77은 최종 블록 미사용
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
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

  // duration 기반 시퀀스 진행
  useEffect(() => {
    if (!hasPlaybackStarted || !isPlaying) return;
    if (!videoDuration || !Number.isFinite(videoDuration) || videoDuration <= 0) return;

    const total = HERO_SEQUENCE_77.length;
    if (total === 0) return;

    const timers: number[] = [];
    const LAST_HOLD_MS = 2000; // 마지막 문구 유지 시간
    const effective = Math.max(0, videoDuration * 1000 - LAST_HOLD_MS);

    // 마지막 라인 인덱스
    const lastIndex = total - 1;
    const linesToDistribute = Math.max(0, total - 1); // 마지막 라인 제외 분배

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

    // 분배 라인 스케줄링 (마지막 제외)
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

    // 마지막 라인: 분배 종료 직후 표시, 2초 유지
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
              style={{ backgroundImage: "url('/landing-assets/nigajun-77-hero-pc.webp.webp')" }}
            />
            <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
          </div>
          <div className={styles.heroOverlay}>
            <h1 className={styles.productTitle}>
              {product?.productName ?? "NIGAJUN 77"}
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
                  <span>NIGAJUN 77</span>
                  <br />
                  <span>Development of Plant Cell Genetic Protein</span>
                  <br />
                  <span>Molecular Bio-Bio-Bioengineering</span>
                  <br />
                  <span>What&apos;s the new change?</span>
                </>
              )}

              {/* 재생 중: 항상 1줄만 출력, 최종 블록 미사용 */}
              {isPlaying && !showFinalBlock && (
                <span
                  className={[
                    styles.videoText,
                    HERO_EMPHASIS_77[activeLineIndex] ? styles.videoTextEmphasis : "",
                    linePhase === "exit" ? styles.videoTextExit : "",
                  ].join(" ")}
                >
                  {HERO_SEQUENCE_77[activeLineIndex]}
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
                지방세포는 단순히 지방을 저장하는 저장소가 아니다.
              </p>
              <p className={`${styles.detailOverlayText} ${styles.korText}`}>
                지방세포는 에너지 저장 모드와 에너지 소비 모드 사이를
                <br className={styles.mobileOnly} />
                오가는 대사 세포다.
              </p>
              <p className={`${styles.detailOverlayText} ${styles.korText}`}>
                문제는 대부분의 종아리 지방이 저장 모드에
                <br className={styles.mobileOnly} />
                고정되어 있다는 것이다.
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
                There is a lot of movement, but fat does not disappear easily. The reason is simple.
              </p>
              <p className={styles.detailOverlayText}>
                Calf fat is maintained by metabolic environment, not by edema. Fat cells are not just stores of fat.
              </p>
              <p className={styles.detailOverlayText}>
                Adipocytes are metabolic cells that move between the energy storage mode and the energy consumption mode.
              </p>
              <p className={styles.detailOverlayText}>
                The problem is that most calf fat is
                <br className={styles.mobileOnly} />
                fixed in storage mode.
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
        <h2 className={styles.boardTopTitle}>
          <span className={styles.boardTitleBrand}>TONYWANG</span>
          <span className={styles.boardTitleSub}>Ask me Questions</span>
        </h2>
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



