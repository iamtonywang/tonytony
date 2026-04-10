"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Nigajun99View.module.css";
import type { ProductMinimal } from "@/app/products/_server/types";

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

export default function Nigajun99View({ product }: Props) {
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

              <p className={styles.detailPriceRow}>
                {typeof product?.finalPriceAmount === "number" ? (
                  <span>· {product.finalPriceAmount.toLocaleString()}</span>
                ) : null}
              </p>





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



