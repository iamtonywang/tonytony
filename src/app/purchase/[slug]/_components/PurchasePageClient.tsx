"use client";

import { useState } from "react";
import type { PurchasePageAggregateData } from "../types";
import ProductSummarySection from "./ProductSummarySection";
import BuyerInfoSection from "./BuyerInfoSection";
import ReceiverInfoSection from "./ReceiverInfoSection";
import AddressSection from "./AddressSection";
import PaymentMethodSection from "./PaymentMethodSection";
import PointUsageSection from "./PointUsageSection";
import PurchaseSubmitSection from "./PurchaseSubmitSection";
import OrderNoticeSection from "./OrderNoticeSection";

type Props = {
  aggregateData: PurchasePageAggregateData;
};

export default function PurchasePageClient({ aggregateData }: Props) {
  const [quantity, setQuantity] = useState<number>(1);
  const [buyerName, setBuyerName] = useState<string>("");
  const [buyerPhone, setBuyerPhone] = useState<string>("");
  const [buyerEmail, setBuyerEmail] = useState<string>("");
  const [receiverName, setReceiverName] = useState<string>("");
  const [receiverPhone, setReceiverPhone] = useState<string>("");
  const [receiverEmail, setReceiverEmail] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");
  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [pointUsedAmount, setPointUsedAmount] = useState<number>(0);
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);

  const handleBuyerChange = (field: "buyerName" | "buyerPhone" | "buyerEmail", value: string) => {
    if (field === "buyerName") setBuyerName(value);
    if (field === "buyerPhone") setBuyerPhone(value);
    if (field === "buyerEmail") setBuyerEmail(value);
  };

  const handleReceiverChange = (field: "receiverName" | "receiverPhone" | "receiverEmail", value: string) => {
    if (field === "receiverName") setReceiverName(value);
    if (field === "receiverPhone") setReceiverPhone(value);
    if (field === "receiverEmail") setReceiverEmail(value);
  };

  const handleAddressChange = (field: "zipcode" | "address1" | "address2", value: string) => {
    if (field === "zipcode") setZipcode(value);
    if (field === "address1") setAddress1(value);
    if (field === "address2") setAddress2(value);
  };

  const handlePaymentChange = (field: "paymentMethod", value: string) => {
    if (field === "paymentMethod") setPaymentMethod(value);
  };

  const handlePointChange = (field: "pointUsedAmount", value: number) => {
    if (field === "pointUsedAmount") setPointUsedAmount(value);
  };

  return (
    <div>
      <ProductSummarySection product={aggregateData.product} />

      <BuyerInfoSection
        buyerName={buyerName}
        buyerPhone={buyerPhone}
        buyerEmail={buyerEmail}
        onChange={handleBuyerChange}
      />

      <ReceiverInfoSection
        receiverName={receiverName}
        receiverPhone={receiverPhone}
        receiverEmail={receiverEmail}
        onChange={handleReceiverChange}
      />

      <AddressSection
        zipcode={zipcode}
        address1={address1}
        address2={address2}
        onChange={handleAddressChange}
      />

      <PaymentMethodSection paymentMethod={paymentMethod} onChange={handlePaymentChange} />

      <PointUsageSection pointUsedAmount={pointUsedAmount} onChange={handlePointChange} />

      <PurchaseSubmitSection
        quantity={quantity}
        agreeToTerms={agreeToTerms}
        onQuantityChange={(v) => setQuantity(v)}
        onAgreeChange={(v) => setAgreeToTerms(v)}
        onSubmit={(e) => {
          e.preventDefault();
          // Intentionally no submission. Placeholder only.
        }}
      />

      <OrderNoticeSection />
    </div>
  );
}

