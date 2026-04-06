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
            {[1, 2, 3, 4, 5].map((q) => (
              <button
                key={q}
                type="button"
                className={`${styles.quantityItem} ${quantity === q ? styles.active : ""}`}
                onClick={() => setQuantity(q)}
              >
                {q}
              </button>
            ))}
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

        <OrderNoticeSection />
      </div>
    </div>
  );
}

