"use client";

import { useCallback, useState } from "react";
import type { PurchasePageAggregateData } from "../types";
import ProductSummarySection from "./ProductSummarySection";
import BuyerInfoSection from "./BuyerInfoSection";
import AddressSection from "./AddressSection";
import PaymentMethodSection from "./PaymentMethodSection";
import PurchaseSubmitSection from "./PurchaseSubmitSection";
import OrderNoticeSection from "./OrderNoticeSection";
import styles from "./PurchasePageClient.module.css";

type Props = {
  aggregateData: PurchasePageAggregateData;
};

export default function PurchasePageClient({ aggregateData }: Props) {
  const [quantity, setQuantity] = useState<number>(1);
  const [buyerName, setBuyerName] = useState<string>(aggregateData.buyerDefaults?.name ?? "");
  const [buyerPhone, setBuyerPhone] = useState<string>(aggregateData.buyerDefaults?.phone ?? "");
  const [buyerEmail, setBuyerEmail] = useState<string>(aggregateData.buyerDefaults?.email ?? "");
  const [receiverName, setReceiverName] = useState<string>(aggregateData.receiverDefaults?.name ?? "");
  const [receiverPhone, setReceiverPhone] = useState<string>(aggregateData.receiverDefaults?.phone ?? "");
  const [receiverEmail, setReceiverEmail] = useState<string>(aggregateData.receiverDefaults?.email ?? "");
  const [zipcode, setZipcode] = useState<string>(aggregateData.addressDefaults?.zipcode ?? "");
  const [address1, setAddress1] = useState<string>(aggregateData.addressDefaults?.address1 ?? "");
  const [address2, setAddress2] = useState<string>(aggregateData.addressDefaults?.address2 ?? "");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [pointUsedAmount, setPointUsedAmount] = useState<number>(0);
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitErrors, setSubmitErrors] = useState<Record<string, string> | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const [confirmErrors, setConfirmErrors] = useState<Record<string, string> | null>(null);
  const [confirmedPaymentId, setConfirmedPaymentId] = useState<string | number | null>(null);

  const handleBuyerChange = (field: "buyerName" | "buyerPhone" | "buyerEmail", value: string) => {
    if (field === "buyerName") setBuyerName(value);
    if (field === "buyerPhone") setBuyerPhone(value);
    if (field === "buyerEmail") setBuyerEmail(value);
  };

  const handleAddressChange = (field: "zipcode" | "address1" | "address2", value: string) => {
    if (field === "zipcode") setZipcode(value);
    if (field === "address1") setAddress1(value);
    if (field === "address2") setAddress2(value);
  };

  const handleAddressLookupResult = useCallback((nextZipcode: string, nextAddress1: string) => {
    setZipcode(nextZipcode);
    setAddress1(nextAddress1);
  }, []);

  const handlePaymentChange = (field: "paymentMethod", value: string) => {
    if (field === "paymentMethod") setPaymentMethod(value);
  };

  const onSubmitClick = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitMessage(null);
    setSubmitErrors(null);
    setConfirmMessage(null);
    setConfirmErrors(null);
    setConfirmedPaymentId(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: aggregateData.product.slug ?? "",
          quantity,
          buyerName,
          buyerPhone,
          buyerEmail,
          receiverName,
          receiverPhone,
          receiverEmail,
          zipcode,
          address1,
          address2,
          paymentMethod,
          pointUsedAmount,
          agreeToTerms,
        }),
      });

      let payload: any = null;
      try {
        payload = await res.json();
      } catch {
        payload = null;
      }

      if (res.ok && payload && payload.ok === true) {
        setSubmitMessage(payload.message ?? "주문 검증이 완료되었습니다.");
        setSubmitErrors(null);

        // Toss 성공 페이지에서 paymentId/orderId를 이어받기 위해 세션 저장소에 임시 저장
        try {
          if (typeof window !== "undefined" && window.sessionStorage) {
            if (payload?.paymentId != null) {
              window.sessionStorage.setItem("pendingPaymentId", String(payload.paymentId));
            }
            if (payload?.orderId != null) {
              window.sessionStorage.setItem("pendingOrderId", String(payload.orderId));
            }
          }
        } catch {
          // 저장 실패가 나더라도 주문 성공 자체를 실패로 바꾸지 않는다.
        }

        // 주문 생성 성공 이후 결제 확인 단계 진입 (자동 호출이 아닌, 단계적 분리)
        const orderId: string | number | undefined = payload?.orderId;
        const paymentId: string | number | undefined = payload?.paymentId; // 현재 구조상 미포함일 가능성 큼

        if (!orderId) {
          setConfirmMessage("결제 확인 단계로 진행하려면 orderId가 필요합니다.");
          setConfirmErrors({ orderId: "missing" });
          return;
        }

        if (!paymentId) {
          setConfirmMessage("결제 확인에 필요한 paymentId가 아직 연결되지 않았습니다.");
          setConfirmErrors({ paymentId: "missing" });
          return;
        }

        const transactionId: string | undefined = payload?.transactionId;
        if (!transactionId) {
          setConfirmMessage("결제 확인에 필요한 transactionId가 아직 연결되지 않았습니다.");
          setConfirmErrors({ transactionId: "missing" });
          return;
        }

        // paymentId/transactionId 모두 확보된 경우에만 confirm API 호출
        try {
          const confirmRes = await fetch("/api/payments/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              paymentId,
              transactionId,
            }),
          });

          let confirmPayload: any = null;
          try {
            confirmPayload = await confirmRes.json();
          } catch {
            confirmPayload = null;
          }

          if (confirmRes.ok && confirmPayload && confirmPayload.ok === true) {
            setConfirmMessage(
              typeof confirmPayload.message === "string" ? confirmPayload.message : "결제 확인이 완료되었습니다.",
            );
            setConfirmErrors(null);
            setConfirmedPaymentId(confirmPayload.paymentId ?? paymentId);
            return;
          }

          if (confirmRes.ok && confirmPayload && confirmPayload.ok === false) {
            setConfirmMessage(
              typeof confirmPayload.message === "string" ? confirmPayload.message : "결제 확인 처리 중 오류가 발생했습니다.",
            );
            setConfirmErrors(confirmPayload.errors ?? null);
            setConfirmedPaymentId(null);
            return;
          }

          // non-2xx or unparsable
          if (confirmPayload && typeof confirmPayload === "object") {
            setConfirmMessage(
              typeof confirmPayload.message === "string" ? confirmPayload.message : "결제 확인 처리 중 오류가 발생했습니다.",
            );
            setConfirmErrors(confirmPayload.errors ?? null);
            setConfirmedPaymentId(null);
          } else {
            setConfirmMessage("결제 확인 처리 중 오류가 발생했습니다.");
            setConfirmErrors(null);
            setConfirmedPaymentId(null);
          }
        } catch {
          setConfirmMessage("결제 확인 처리 중 오류가 발생했습니다.");
          setConfirmErrors(null);
          setConfirmedPaymentId(null);
        }

        return;
      }

      if (res.ok && payload && payload.ok === false) {
        setSubmitMessage(typeof payload.message === "string" ? payload.message : "요청 처리 중 오류가 발생했습니다.");
        setSubmitErrors(payload.errors ?? null);
        return;
      }

      // non-2xx or unparsable
      if (payload && typeof payload === "object") {
        setSubmitMessage(typeof payload.message === "string" ? payload.message : "요청 처리 중 오류가 발생했습니다.");
        setSubmitErrors(payload.errors ?? null);
      } else {
        setSubmitMessage("요청 처리 중 오류가 발생했습니다.");
        setSubmitErrors(null);
      }
    } catch {
      setSubmitMessage("요청 처리 중 오류가 발생했습니다.");
      setSubmitErrors(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.headerText}>
          <h1 className={styles.brand}>TONYWANG</h1>
          <p className={styles.sub}>Plant Cell Genetic Protein Laboratory</p>
          <p className={styles.sub}>Molecular Bio-Bio Technology</p>
          <p className={styles.desc}>Hi, I wish you all the best for being my friend</p>
        </div>

        <ProductSummarySection
          product={aggregateData.product}
          purchasableStatus={aggregateData.purchasableStatus ?? undefined}
        />

        <BuyerInfoSection
          buyerName={buyerName}
          buyerPhone={buyerPhone}
          buyerEmail={buyerEmail}
          onChange={handleBuyerChange}
        />

        <AddressSection
          zipcode={zipcode}
          address1={address1}
          address2={address2}
          onChange={handleAddressChange}
          onLookupResult={handleAddressLookupResult}
        />

        <section className={styles.section}>
          <h2 className={styles.title}>Quantity</h2>
          <div className={styles.quantityWrap}>
            <input
              type="number"
              min={1}
              step={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={styles.quantityInput}
            />
          </div>
        </section>

        <PaymentMethodSection paymentMethod={paymentMethod} onChange={handlePaymentChange} />

        <PurchaseSubmitSection
          isSubmitting={isSubmitting}
          submitMessage={submitMessage}
          submitErrors={submitErrors}
          agreeToTerms={agreeToTerms}
          onAgreeChange={(v) => setAgreeToTerms(v)}
          onSubmitClick={onSubmitClick}
        />

        {confirmMessage ? (
          <div className={styles.section}>
            <p style={{ marginTop: 8 }}>{confirmMessage}</p>
            {confirmErrors ? (
              <pre style={{ marginTop: 4, color: "#b00020", whiteSpace: "pre-wrap" }}>
                {JSON.stringify(confirmErrors, null, 2)}
              </pre>
            ) : null}
            {confirmedPaymentId ? (
              <p style={{ marginTop: 4, color: "#2e7d32" }}>
                confirmedPaymentId: {String(confirmedPaymentId)}
              </p>
            ) : null}
          </div>
        ) : null}

        <OrderNoticeSection />
      </div>
    </div>
  );
}

