"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import SignatureLine from "@/components/sections/SignatureLine";
import styles from "./Nigajun88View.module.css";
import type { ProductBoardItem, ProductMinimal } from "@/app/products/_server/types";
import { formatBoardRowAuthor } from "@/app/products/boardMask";

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

export default function Nigajun88View({ product, boardItems }: Props) {
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

  return (
    <article className={styles.detailPage}>
      <SignatureLine />

      <section className={styles.landingSection} aria-label="Product Identity">
        <h1 className={styles.brandTitle}>NIGAJUN 88</h1>
        <p className={styles.sectionTitle}>Hair Nutrition Protein Cream</p>
        <p className={styles.bodyCopy}>Proteo Phyto Complex Science</p>
        <p className={styles.bodyCopy}>August 2026 TONY WANG</p>
      </section>

      <SignatureLine />

      <section className={styles.landingSection} aria-label="Hair Strength Promise">
        <p className={styles.sectionTitle}>Stronger Hair Begins at the Root</p>
        <p className={styles.bodyCopy}>
          NIGAJUN88 is designed to nourish the scalp, support stronger-looking
          hair, reduce the appearance of thinning, and promote a healthier scalp
          environment for fuller, healthier-looking hair every day.
        </p>
      </section>

      <img
        src="/landing-assets/nigajun-88-section-02-v2.webp"
        alt=""
        className={styles.heroImage}
      />

      <SignatureLine />

      <section className={styles.landingSection} aria-label="Thinning Hair Care">
        <p className={styles.brandTitle}>THINNING HAIR CARE</p>
        <p className={styles.sectionTitle}>Support Hair That Looks Fuller</p>
        <p className={styles.bodyCopy}>
          Specially developed to care for fine and thinning-looking hair, helping
          improve the appearance of volume, strength, and resilience with
          consistent daily care.
        </p>
      </section>

      <img
        src="/landing-assets/nigajun-88-section-03.webp"
        alt=""
        className={styles.heroImage}
      />

      <SignatureLine />

      <section className={styles.landingSection} aria-label="Dandruff and Scalp Comfort">
        <p className={styles.brandTitle}>DANDRUFF & SCALP COMFORT</p>
        <p className={styles.sectionTitle}>Refresh and Rebalance</p>
        <p className={styles.bodyCopy}>
          Helps remove buildup while keeping the scalp feeling clean, refreshed,
          and comfortably balanced, supporting a healthier scalp with every use.
        </p>
      </section>

      <img
        src="/landing-assets/nigajun-88-section-04.webp"
        alt=""
        className={styles.heroImage}
      />

      <section className={styles.landingSection} aria-label="Product Description">
        <p className={styles.sectionTitle}>NIGAJUN 88</p>
        <p className={styles.releaseNotice}>It will be released soon</p>
        <p className={styles.bodyCopy}>
          NIGAJUN 88 is a premium hair nutrition treatment designed to care for
          both the scalp and hair. It helps nourish dry, weakened hair, supports
          a healthier-looking scalp, reduces the appearance of hair loss caused
          by breakage, and leaves hair stronger, smoother, shinier, and more
          resilient with every use.
        </p>
        <p className={styles.bodyCopy}>August 2026 TONYWANG</p>
      </section>

      <SignatureLine />

      <div className={styles.jarCopy}>
        <p className={styles.jarNotice}>It will be released soon</p>
        <p className={styles.jarBrand}>NIGAJUN 88</p>
        <p className={styles.jarSub}>Hair Nutrition Protein Cream</p>
      </div>

      <img
        src="/landing-assets/nigajun-88-product-jar.webp"
        alt=""
        className={styles.jarImage}
      />

      <p className={styles.jarCaption}>It will be a precious thing to you</p>

      <section className={styles.purchaseSection} aria-label="Purchase">
        <div className={styles.fourthProductCta}>
          <p className={styles.fourthProductPrice}>
            {typeof product?.finalPriceAmount === "number"
              ? `₩${product.finalPriceAmount.toLocaleString()}`
              : null}
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
