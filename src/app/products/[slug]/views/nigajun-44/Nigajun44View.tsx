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

const PINNED_NOTICE = {
  author: "TONYWANG",
  preview: "공지 내용",
  type: "Notice",
  date: "2026.04.10",
  content: "공지 내용",
} as const;

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
      <section className={styles.headerIntroSection}>
        <div className={styles.headerIntroDivider} aria-hidden="true" />

        <div className={styles.headerIntroInner}>
          <h1 className={styles.headerIntroTitle}>TONY WANG</h1>

          <h2 className={styles.headerIntroSubtitle}>NIGAJUN44</h2>

          <p className={styles.headerIntroCaption}>skincare for the first time</p>
        </div>

        <div className={styles.headerIntroDivider} aria-hidden="true" />

        <section className={styles.headerIntroImageSection}>
          <img
            src="/landing-assets/ourwork-editorial-biofounder-01.webp"
            alt=""
            className={styles.headerIntroImage}
          />

          <div className={styles.bioFounderOverlay}>
            <p className={styles.bioFounderIntro}>The intro of the beginning</p>

            <div className={styles.bioFounderBody}>
              <p>우리는 낡고 허술한 시대에 살고 있습니다</p>
              <p>무엇이 진실이고 무엇이 거짓인지</p>
              <p>때론 모르고 살아 갑니다</p>
              <p>진실이 거짓이고</p>
              <p>거짓이 진실이 되는 시대입니다</p>
              <p>자본의 힘이 진실이고</p>
              <p>때론 없다는 것이 거짓도 됩니다</p>
              <p>매우 안따깝고 괴로운 것입니다</p>
              <p>행복해야 합니다 꿈을 향해 뛰어야 합니다</p>
              <p>땀의 기쁨을 누려야 합니다</p>
              <p>그래요 그것이 인생 입니다</p>
            </div>

            <p className={styles.bioFounderSignature}>May 2026 TONY WANG</p>

          </div>
        </section>
      </section>

      <div
        className={`${styles.mobileVisualBreathingSection} ${styles.mobileFirstToSecondBreathingSection}`}
      >
        <div className={styles.mobileScientificBreathingStatement}>
          <p className={styles.mobileScientificBreathingTitle}>NIGAJUN44</p>

          <p
            className={`${styles.mobileScientificBreathingLine} ${styles.mobileScientificBreathingHighlight}`}
          >
            Global First Molecular Method Biotechnology Skincare
          </p>

          <p
            className={`${styles.mobileScientificBreathingLine} ${styles.mobileScientificBreathingHighlight}`}
          >
            Application of plant gene protein separation method
          </p>

          <p
            className={`${styles.mobileScientificBreathingLine} ${styles.mobileScientificBreathingHighlight}`}
          >
            Ultra pure plant protein molecular biological
          </p>

          <p
            className={`${styles.mobileScientificBreathingLine} ${styles.mobileScientificBreathingHighlight}`}
          >
            skin application skincare
          </p>
        </div>
      </div>

      <div className={styles.desktopVisualBreathingSection}>
        <div className={styles.desktopEditorialStatement}>
          <p className={styles.desktopEditorialStatementTitle}>NIGAJUN44</p>
          <p className={styles.desktopEditorialStatementLine}>
            Global First Molecular Method Biotechnology Skincare Application of plant gene protein separation method
          </p>
          <p className={styles.desktopEditorialStatementLine}>
            Ultra pure plant protein molecular biological skin application skincare
          </p>
        </div>
      </div>

      <section className={styles.cleanThemeSection}>
        <img
          src="/landing-assets/why-note-break-visual-01.webp"
          alt=""
          className={styles.cleanThemeImage}
        />

        <div className={styles.cleanThemeOverlay}>
          <p className={styles.cleanThemeTitle}>
            <span className={styles.elMessiriText}>Innovation and Creation</span>
          </p>

          <div className={styles.cleanThemeCopy}>
            <p>이루기 위해 이제 출발합니다</p>
            <p>
              <span className={styles.elMessiriText}>Single Structure</span> 변혁{" "}
              <span className={styles.elMessiriText}>NIGAJUN 44</span>
            </p>
            <p>창조의 절대 영역</p>
            <p>창조란?</p>
            <p>미쳐야 가질 수 있고 세상에 없는것을 만드는 것</p>
            <p>피부에 관한 퍼즐을 풀고자 세상에 나왔습니다</p>
          </div>
        </div>
      </section>

      <div className={styles.mobileVisualBreathingSection}>
        <div className={styles.desktopScientificStatement}>
          <p className={styles.desktopScientificStatementTitle}>
            Benjamin Burton! The clock is ticking
          </p>

          <p className={styles.desktopScientificStatementLine}>
            인간의 피부 세포막과 가장 유사한 구조(Mimetic)로 재 설계, 무너진 피부 공간을 식물성 단백질이 시멘트처럼 메워주는 작용.
          </p>

          <p className={styles.desktopScientificStatementLine}>
            식물이지만, 당신의 피부를 가장 잘 아는 단백질. 바르는 것만이 아닌 , 손상된 부위를 추적해서 찾아가는 가장 Smart 한 단백질
          </p>
        </div>

        <div className={styles.mobileTransitionNotice}>
          <p className={styles.mobileTransitionNoticeTitle}>중요공지사항</p>
          <p>제품 구매 전 필히 본문을 필독하고</p>
          <p>신중히 구매 결정을 하세요</p>
          <p>제품 사용시 얼굴 지방이 소멸 되어 의도치 않게</p>
        </div>
      </div>

      <div className={styles.mobileVisualBreathingSection}>
        <div className={styles.mobileNoticeContinuation}>
          <p>얼굴 윤곽이 작아지는 현상이 발생합니다</p>
          <p>구매 전 신중히 판단 후 구매 결정을 하시길 바랍니다</p>
          <p>다만 고객의 포괄적 적용은 아니며 개개인의 차이가 있음을 밝힙니다</p>
        </div>
      </div>

      <div className={styles.mobileVisualBreathingSection}>
        <div className={styles.mobileBenjaminStatement}>
          <p className={styles.mobileBenjaminStatementTitle}>
            Benjamin Burton! The clock is ticking
          </p>
          <p>인간 피부 세포막과 가장 유사한 구조(Mimetic) 재 설계</p>
          <p>무너진 피부 공간을 식물성 단백질이</p>
          <p>시멘트처럼 메워주는 작용. 식물이지만,</p>
          <p>당신의 피부를 가장 잘 아는 단백질.</p>
          <p>바르는 것만이 아닌 , 손상된 부위를 추적해서</p>
          <p>찾아가는 가장 Smart 한 단백질</p>
        </div>
      </div>

      <section className={styles.editorialPortraitSection}>
        <img
          src="/landing-assets/nigajun-44-editorial-product-hero.webp"
          alt=""
          className={styles.editorialPortraitImage}
        />

        <div className={styles.thirdNoticeOverlay}>
          <h2 className={`${styles.thirdNoticeTitle} ${styles.pcOnly}`}>
            중요 공지사항
          </h2>

          <div className={styles.thirdNoticeBody}>
            <p className={styles.pcOnly}>
              제품 구매 전 필히 본문을 필독하고 신중히 구매 결정을 하세요
            </p>
            <p className={styles.pcOnly}>
              제품 사용 시 일부 얼굴 지방이 제거 되어 의도치 않게
            </p>
          </div>
        </div>

        <div className={styles.thirdEditorialCopy}>
          <p className={styles.thirdEditorialPcLine}>
            <span className={styles.pcOnly}>
              <span className={styles.elMessiriText}>Global</span> 최초 연구 개발 입니다 이것은 사실입니다 식물 세포 유전자 분리 적용 식물성 원료 결합
            </span>
          </p>

          <p className={styles.thirdEditorialPcLine}>
            <span className={styles.pcOnly}>
              순수 97% 세포 단백질 구성 3% 부 원료 적용{" "}
              <span className={styles.elMessiriText}>BIO</span> 생명공학 공법{" "}
              <span className={styles.elMessiriText}>skin care</span>
            </span>
            <span className={styles.mobileOnly}>순수 97% 세포 단백질 구성 3% 부 원료 적용</span>
          </p>

          <p className={`${styles.thirdEditorialPcLine} ${styles.thirdEditorialMobileOnlyLine}`}>
            <span className={styles.mobileOnly}>
              <span className={styles.elMessiriText}>BIO</span>
              {" "}생명공학 공법{" "}
              <span className={styles.elMessiriText}>skin care</span>
            </span>
          </p>
        </div>
      </section>

      <div className={styles.mobileVisualBreathingSection}>
        <div className={styles.desktopCosmeticsStatement}>
          <p className={styles.desktopCosmeticsStatementTitle}>Cosmetics</p>
          <p className={styles.desktopCosmeticsStatementLine}>
            분야는 표현의 엄격한 제한이 있습니다, TONYWANG은 그 규칙을 지켜야 합니다 특별한 부분이 있다고 해도 표현을 할수가 없습니다
          </p>
          <p className={styles.desktopCosmeticsStatementLine}>
            표현을 한다고 해도 고객은 화장품을 믿지 않습니다, 비참하고 창피한 현실입니다
          </p>
          <p className={styles.desktopCosmeticsStatementLine}>
            화장품으로 취급받기 싫지만 현실이며 넘어야 할 hurdle입니다, 특별한 존재는 사용자 고객이 만드는 것입니다, TONYWANG이 소리쳐서 되는 것이 아닙니다
          </p>
          <p className={styles.desktopCosmeticsStatementLine}>
            특별한 존재의 가치 성역을 TONYWANG 은 이룰수 있습니다
          </p>
        </div>

        <div className={styles.mobileScientificTransition}>
          <p>
            <span className={styles.elMessiriText}>Global</span>
            {" "}최초 연구 개발입니다
          </p>

          <p>이것은 사실입니다</p>

          <p>식물세포유전자 분리정제적용</p>

          <p>식물성 원료 결합 적용</p>
        </div>
      </div>

      <section className={styles.fourthProductHeroSection}>
        <img
          src="/landing-assets/nigajun-44-editorial-product-hero.webp"
          alt=""
          className={styles.fourthProductHeroImage}
        />

        <div className={styles.fourthProductOverlay}>
          <h2 className={styles.fourthProductTitle}>
            <span className={styles.elMessiriText}>NIGAJUN 44</span>
          </h2>

          <div className={styles.fourthProductCopy}>
            <p>피부를 “좋아 보이게” 만드는 제품이 아닌 죽어버린 피부를</p>
            <p>변혁 하는 분자 생물학 시스템</p>
            <p>식물세포 생장과 방어를 담당하고 인간의 피부</p>
            <p>
              아미노산 서열과 <span className={styles.elMessiriText}>Homology</span> 이 높은 성분
            </p>
            <p>특정 단백질(펩타이드 포함) 정제하여 혼합한</p>
            <p>신호 전달 유사 피부 특성 단백질</p>
            <p>
              <span className={styles.elMessiriText}>Proteo Phyto Complex</span> 복합 물질
            </p>
          </div>
        </div>

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

      <div className={styles.desktopVisualBreathingSection}>
        <div className={styles.desktopBiologicalStatement}>
          <p className={styles.desktopBiologicalStatementLine}>
            내 얼굴은 왜 이러지? 왜 남들보다 늙어 보이고 죽어 버린 피부 같지?
          </p>
          <p className={styles.desktopBiologicalStatementLine}>
            피부가 늙는 건 나이가 아니라, 세포가 사멸된 이유입니다 세포를 사멸시키는 가장 주 원인 독소입니다 독소는 세포를 사멸 시킵니다
          </p>
          <p className={styles.desktopBiologicalStatementLine}>
            사멸 된 세포를 부활 하는 것만이 유일한 근본 해결 책입니다
          </p>
        </div>
      </div>

      <div className={styles.mobileVisualBreathingSection} />

      <section className={styles.interviewEditorialSection}>
        <img
          src="/landing-assets/tonywang-editorial-interview-square-01.webp"
          alt=""
          className={styles.interviewEditorialImage}
        />

        <div className={styles.fifthEditorialOverlay}>
          <p className={styles.fifthEditorialOverlayTitle}>
            <span className={styles.fifthEditorialOverlayEnglish}>TONY WANG</span>
          </p>
          <p>변혁을 원하는 분 환영 합니다</p>
          <p>가치를 모르는분 의문을 가지는분</p>
          <p>이해 시키고 싶지 않습니다</p>
          <p>독소가 제거된 피부는 오염이 안된 1급수 물</p>
          <p>
            <span className={styles.pcOnly}>
              긴 설명은 필요하지 않아요 거짓은 수치이고 창피한 행위
            </span>
            <span className={styles.mobileOnly}>긴 설명은 필요하지 않아요</span>
            <span className={`${styles.mobileOnly} ${styles.mobileHidden}`}>
              <br />
              거짓은 수치이고 창피한 행위
            </span>
          </p>
          <p>성분이 뭐고 어떤 구조라고 떠들고 싶지 않아요</p>
          <p>화려한 설명이 소용이 없다는 것을 알기에 ,,</p>
          <p>최고라고 말할 필요도 없어요</p>
          <p>스스로 얘기하는건 모순이고 창피한 행동</p>
          <p>하지만 다들 본인 제품이 최고라고 얘기합니다</p>
          <p>최고 자리는 거짓 홍보로 되는게 아닙니다</p>
          <p>나는 그들과 같은 존재가 되기 싫어요</p>
          <p>
            <span className={styles.fifthEditorialOverlayEnglish}>I DON&apos;T LIKE LYING</span>
          </p>
          <p>나는 거짓이 싫을 뿐입니다</p>
          <p>나를 믿는 사람을 속이며 이익을 만들고 싶지 않아요</p>
          <p>그것은 매우 역겨운 행동입니다</p>
          <p className={styles.mobileHidden}>
            <span className={styles.fifthEditorialOverlayEnglish}>TONY WANG</span>입니다
          </p>
          <p className={styles.mobileHidden}>항상 초심을 잃지 않고 같은 마음으로</p>
          <p className={styles.mobileHidden}>
            <span className={styles.fifthEditorialOverlayEnglish}>Global NO1</span> 이 자리에
            오를것입니다
          </p>
        </div>
      </section>

      <section className={styles.editorialClosingStatementSection}>
        <div className={styles.editorialClosingStatementInner}>
          <p className={styles.editorialClosingStatementLine}>
            &quot;Anti-aging bio-life science that turns back time&quot;
          </p>

          <p className={styles.editorialClosingStatementLine}>
            &quot;The only biotechnology that turns back skin time&quot;
          </p>

          <p className={styles.editorialClosingStatementSignature}>
            May 2026 TONY WANG
          </p>
        </div>
      </section>

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
