"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

      {/* Section 1: Product Identity + 가격 + Buy Now (텍스트 왼쪽 / 이미지 오른쪽) */}
      <section className={styles.landingSection} aria-label="Product Identity">
        <div className={styles.sectionSplit}>
          <div className={styles.sectionSplitCopy}>
            <h1 className={styles.brandTitle}>TONY WANG</h1>
            <p className={styles.sectionTitle}>NIGAJUN 44</p>
            <p className={styles.bodyCopy}>Proteo Phyto Complex</p>
            <p className={styles.bodyCopy}>Hybrid End Skincare</p>

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
          </div>

          <img
            src="/landing-assets/nigajun-44-main-transparent.webp"
            alt=""
            className={styles.sectionSplitImage}
          />
        </div>
      </section>

      <SignatureLine />

      {/* Section 2 */}
      <section className={styles.landingSection}>
        <p className={styles.bodyCopy}>{"우리는 낡고 허술한 시대에 살고 있어"}</p>
        <p className={styles.bodyCopy}>{"무엇이 진실이고 무엇이 거짓인지 때론 모르고 살아간다"}</p>
        <p className={styles.bodyCopy}>{"We live in a time of old and loose Sometimes "}</p>
        <p className={styles.bodyCopy}>{"you don't know what's true and what's false"}</p>
      </section>

      <SignatureLine />

      {/* Section 3 */}
      <section className={styles.landingSection}>
        <p className={styles.bodyCopy}>{"긴 설명은 필요하지 않아 거짓은 수치이고 창피한 행위 이잔아"}</p>
        <p className={styles.bodyCopy}>{"성분이 뭐고 어떤 구조라고 떠들고 싶지 않아 "}</p>
        <p className={styles.bodyCopy}>{"화려한 설명이 소용이 없다는 것을 알기에 ,,  최고라고 말할 필요도 없어 "}</p>
        <p className={styles.bodyCopy}>{"스스로 얘기하는건 모순이고 창피한 행동이야"}</p>
        <p className={styles.bodyCopy}>{"I don't need a long explanation. False is a disgrace, embarrassing act"}</p>
        <p className={styles.bodyCopy}>{"I don't want to talk about the ingredients and the structure "}</p>
        <p className={styles.bodyCopy}>{"I know the fancy explanation is useless, so I don't need to say it's the best "}</p>
        <p className={styles.bodyCopy}>{"It's contradictory and embarrassing to speak for yourself"}</p>
      </section>

      <SignatureLine />

      {/* Section 4 */}
      <section className={styles.landingSection}>
        <p className={styles.bodyCopy}>{"하지만 다들 본인 제품이 최고라고 얘기해"}</p>
        <p className={styles.bodyCopy}>{"최고 자리는 거짓 홍보로 되는게 아냐  나는 그들과 같은 존재가 되기 싫어"}</p>
        <p className={styles.bodyCopy}>{"I DON'T LIKE LYING 나는 거짓이 싫을 뿐이다"}</p>
        <p className={styles.bodyCopy}>{"나를 믿는 사람을 속이며 이익을 만들고 싶지 않아 그것은 매우 역겨운 행동이야"}</p>
        <p className={styles.bodyCopy}>{"But everyone says their products are the best"}</p>
        <p className={styles.bodyCopy}>{"I don't want to be like them I don't like lying. I just don't like lying"}</p>
        <p className={styles.bodyCopy}>{"I don't want to deceive people who believe in me. It's disgusting"}</p>
      </section>

      <SignatureLine />

      {/* Section 5 */}
      <section className={styles.landingSection}>
        <p className={styles.bodyCopy}>{"상품이란 것이 직접 사용해야 알 수 있어 그래서 솔직히 답답해"}</p>
        <p className={styles.bodyCopy}>{"유혹적인 표현을 하기 싫다 자극적인 표현도 하기 싫다"}</p>
        <p className={styles.bodyCopy}>{"유저들은 이미 자극적인 표현에 젖어 있다"}</p>
        <p className={styles.bodyCopy}>{"그러나 나는 이미 기성화 된 문화에 같이 길들여 지고 싶지 않다"}</p>
        <p className={styles.bodyCopy}>{"입증이란 문턱에서 깊이 고뇌에 빠져 있겠지만 그들과 똑같이 하고 싶지 않아"}</p>
        <p className={styles.bodyCopy}>{"You have to use it to know what a product is. So honestly, "}</p>
        <p className={styles.bodyCopy}>{"it's frustrating I don't want to be seductive. I don't want to be provocative"}</p>
        <p className={styles.bodyCopy}>{"Users are already steeped in provocative expressions"}</p>
        <p className={styles.bodyCopy}>{"But I don't want to be tamed together into an established culture"}</p>
        <p className={styles.bodyCopy}>{"I'll be in deep agony at the threshold of proof, "}</p>
        <p className={styles.bodyCopy}>{"but I don't want to do the same as them"}</p>
      </section>

      <SignatureLine />

      {/* Section 6 */}
      <section className={styles.landingSection}>
        <p className={styles.bodyCopy}>{"가치를 모르는자 자신을 사랑하지 않는자 의문을 가지는자"}</p>
        <p className={styles.bodyCopy}>{"자격이 없다 여기서 나가라 진정으로 변혁을 원하는 자 환영한다"}</p>
        <p className={styles.bodyCopy}>{"진실의 힘은 밝혀지기까지 시간이 걸리지만 가장 강하고 아름답고 빛이 난다"}</p>
        <p className={styles.bodyCopy}>{"그것이 가장 큰 힘이고 가장 순수하고 강한 무기다"}</p>
        <p className={styles.bodyCopy}>{"나는 그 시간까지 나의길을 가겠다"}</p>
        <p className={styles.bodyCopy}>{"Those who don't know the value and those who don't love themselves, leave"}</p>
        <p className={styles.bodyCopy}>{"You are not qualified. Get out of here. Those who truly want to change are welcome"}</p>
        <p className={styles.bodyCopy}>{"The power of truth takes time to come to light, but it is the strongest, most beautiful and shiny power"}</p>
        <p className={styles.bodyCopy}>{"It's the most powerful force and the purest and most powerful weapon"}</p>
        <p className={styles.bodyCopy}>{"I'm going to go my own way until then"}</p>
      </section>

      <SignatureLine />

      {/* Section 7 */}
      <section className={styles.landingSection}>
        <p className={styles.bodyCopy}>{"피부에 관한 퍼즐을 풀고자 세상에 나왔다"}</p>
        <p className={styles.bodyCopy}>{"I came to the world to solve a puzzle about skin"}</p>
        <p className={styles.bodyCopy}>{"August 2026 TONY WANG"}</p>
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
