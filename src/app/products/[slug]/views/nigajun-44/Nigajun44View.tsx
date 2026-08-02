"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import SignatureLine from "@/components/sections/SignatureLine";
import styles from "./Nigajun44View.module.css";
import type { ProductBoardItem, ProductMinimal } from "@/app/products/_server/types";

function maskBoardAuthor(author: string) {
  if (!author) return "User";
  if (author.length <= 2) return author[0] + "*";
  return author[0] + "*".repeat(author.length - 2) + author.slice(-1);
}

interface Props {
  product?: ProductMinimal;
  boardItems: ProductBoardItem[];
}

const MANIFESTO_TEXT = "제품은 유저가 직접 사용해야 거짓과 진실을 알 수 있어.";
const SECTION4_MANIFESTO_LINES = [
  "과장된 표현도 자극적인 광고도 하고 싶지 않아.",
  "최고의 위치는 거짓된 홍보로 되는 게 아냐.",
  "허구와 유혹으로 가득 찬 광고가 무슨 필요가 있어?",
];
const SECTION5_MANIFESTO_LINES = [
  "I DON'T LIKE LYING",
  "나는 거짓이 싫다.",
  "성분이 뭐고 어떤 구조라고 떠들고 싶지 않아.",
  "유저를 속이며 이익을 만들고 싶지 않아. 그건 비참할 뿐이야.",
];
const SECTION6_MANIFESTO_LINES = [
  "creation?",
  "미쳐야 가질 수 있고 세상에 없던것을 만드는 것",
];
const MANIFESTO_REVEAL_TOTAL_MS = 3200;
const MANIFESTO_CHAR_DURATION_MS = 420;

/*
 * Soft Type Reveal: Section 진입 시 문장을 왼쪽부터 한 글자씩 부드럽게 공개.
 * 여러 줄이면 글자 delay가 줄을 넘어 이어져 위→아래 순서로 공개된다.
 * - JS가 없거나 실패하면 armed가 되지 않아 문장이 처음부터 보인다.
 * - observer는 시작 즉시 disconnect되어 한 번만 실행된다.
 * - 접근성: 각 줄 p의 aria-label로 완전한 문장을 제공하고 글자 span은 aria-hidden.
 */
function ManifestoReveal({
  lines,
  lineClasses,
}: {
  lines: string[];
  /* 줄 index별 추가 클래스(예: Section 5 첫 줄 강조). 없으면 공통 Typography만 사용. */
  lineClasses?: (string | undefined)[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    setArmed(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const glyphCount = lines.reduce(
    (sum, line) => sum + Array.from(line.replace(/ /g, "")).length,
    0,
  );
  const stepMs =
    (MANIFESTO_REVEAL_TOTAL_MS - MANIFESTO_CHAR_DURATION_MS) / Math.max(1, glyphCount - 1);

  const stateClass = started
    ? styles.manifestoCopyStarted
    : armed
      ? styles.manifestoCopyArmed
      : "";

  let glyphIndex = 0;

  return (
    <div ref={ref} className={`${styles.manifestoCopy} ${stateClass}`}>
      {lines.map((line, lineIdx) => (
        <p
          key={lineIdx}
          className={
            lineClasses?.[lineIdx]
              ? `${styles.bodyCopy} ${lineClasses[lineIdx]}`
              : styles.bodyCopy
          }
          aria-label={line}
        >
          {line.split(" ").map((word, wordIdx) => (
            <Fragment key={wordIdx}>
              {wordIdx > 0 ? " " : null}
              <span className={styles.manifestoWord} aria-hidden="true">
                {Array.from(word).map((char, charIdx) => {
                  const delayMs = Math.round(glyphIndex * stepMs);
                  glyphIndex += 1;
                  return (
                    <span
                      key={charIdx}
                      className={styles.manifestoChar}
                      style={started ? { animationDelay: `${delayMs}ms` } : undefined}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            </Fragment>
          ))}
        </p>
      ))}
    </div>
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
        <SignatureLine />
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
          {filteredBoardItems.map((item, i) => {
            const rowIndex = i;
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
    </>
  );
}

export default function Nigajun44View({ product, boardItems }: Props) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <article className={styles.detailPage}>
      <SignatureLine />

      {/* Section 1: Product Identity */}
      <section
        className={`${styles.landingSection} ${styles.introSection}`}
        aria-label="Product Identity"
      >
        <h1 className={styles.brandTitle}>TONY WANG</h1>
        <p className={styles.sectionTitle}>NIGAJUN 44</p>
        <p className={styles.bodyCopy}>Proteo Phyto Complex</p>
        <p className={styles.bodyCopy}>Hybrid End Skincare</p>
      </section>

      <SignatureLine />

      {/* Section 2: heroImage(77·88·99 공통 폭) + 문구 오버레이 */}
      <section className={styles.section2Block} aria-label="Manifesto Introduction">
        <img
          src="/landing-assets/tonywang-why-manifesto-hero.webp"
          alt=""
          className={styles.heroImage}
        />
        <div className={styles.section2Copy}>
          <p className={styles.bodyCopy}>{"우리는 낡고 허술한 시대에 살고 있어"}</p>
          <p className={styles.bodyCopy}>{"무엇이 진실이고 무엇이 거짓인지 때론 모르고 살아간다"}</p>
          <p className={styles.bodyCopy}>{"We live in a time of old and loose Sometimes "}</p>
          <p className={styles.bodyCopy}>{"you don't know what's true and what's false"}</p>
        </div>
      </section>

      <SignatureLine />

      {/* Section 3: Roman Number + 한 줄 Manifesto (Soft Type Reveal) */}
      <section
        className={`${styles.landingSection} ${styles.manifestoSection} ${styles.uniformSection}`}
      >
        <p className={styles.manifestoNumeral} aria-hidden="true">
          III
        </p>
        <ManifestoReveal lines={[MANIFESTO_TEXT]} />
      </section>

      <img
        src="/landing-assets/nigajun-44-luxury-model.webp"
        alt=""
        className={styles.heroImage}
      />

      <SignatureLine />

      {/* Section 4: Roman Number + 한 줄 Manifesto (Section 3과 동일 시스템) */}
      <section
        className={`${styles.landingSection} ${styles.manifestoSection} ${styles.uniformSection}`}
      >
        <p className={styles.manifestoNumeral} aria-hidden="true">
          IV
        </p>
        <ManifestoReveal lines={SECTION4_MANIFESTO_LINES} />
      </section>

      <img
        src="/landing-assets/nigajun-44-spa-portrait.webp"
        alt=""
        className={styles.heroImage}
      />

      <SignatureLine />

      {/* Section 5: Roman Number + Manifesto (Section 3·4와 동일 시스템) */}
      <section
        className={`${styles.landingSection} ${styles.manifestoSection} ${styles.uniformSection}`}
      >
        <p className={styles.manifestoNumeral} aria-hidden="true">
          V
        </p>
        <ManifestoReveal
          lines={SECTION5_MANIFESTO_LINES}
          lineClasses={[styles.manifestoLead]}
        />
      </section>

      <img
        src="/landing-assets/nigajun-44-founder-portrait.webp"
        alt=""
        className={styles.heroImage}
      />

      <SignatureLine />

      {/* Section 6: Roman Number + Manifesto (Section 3~5와 동일 시스템) */}
      <section
        className={`${styles.landingSection} ${styles.manifestoSection} ${styles.uniformSection}`}
      >
        <p className={styles.manifestoNumeral} aria-hidden="true">
          VI
        </p>
        <ManifestoReveal
          lines={SECTION6_MANIFESTO_LINES}
          lineClasses={[styles.manifestoCreation]}
        />
      </section>

      <img
        src="/landing-assets/nigajun-44-creator-portrait.webp"
        alt=""
        className={styles.heroImage}
      />

      <SignatureLine />

      {/* Section 7 */}
      <section className={`${styles.landingSection} ${styles.uniformSection}`}>
        <p className={styles.bodyCopy}>{"피부에 관한 퍼즐을 풀고자 세상에 나왔다"}</p>
        <p className={styles.bodyCopy}>{"I came to the world to solve a puzzle about skin"}</p>
        <p className={styles.bodyCopy}>{"August 2026 TONY WANG"}</p>
      </section>

      <img
        src="/landing-assets/nigajun-44-section-07.webp"
        alt=""
        className={styles.heroImage}
      />

      <section className={styles.purchaseSection} aria-label="Purchase">
        <div className={styles.fourthProductCta}>
          <p className={styles.fourthProductPrice}>
            {typeof product?.finalPriceAmount === "number"
              ? `₩${product.finalPriceAmount.toLocaleString("ko-KR")}`
              : ""}
          </p>

          <Link
            href={`/purchase/${product?.slug ?? ""}`}
            className={styles.fourthProductBuyButton}
          >
            Buy Now
          </Link>
        </div>
      </section>

      <SignatureLine />

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
