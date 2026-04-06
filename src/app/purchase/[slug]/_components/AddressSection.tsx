import styles from "./PurchasePageClient.module.css";
import { useEffect, useRef, useState } from "react";

type DaumPostcodeData = {
  zonecode?: string;
  address?: string;
  roadAddress?: string;
  jibunAddress?: string;
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
        width?: string;
        height?: string;
      }) => {
        open: () => void;
        embed: (element: HTMLElement) => void;
      };
    };
  }
}

type Props = {
  zipcode: string;
  address1: string;
  address2: string;
  onChange: (field: "zipcode" | "address1" | "address2", value: string) => void;
  onLookupResult: (zipcode: string, address1: string) => void;
};

async function ensureDaumPostcodeScript(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.daum?.Postcode) return;

  const existing = document.getElementById("daum-postcode-script") as HTMLScriptElement | null;
  if (existing) {
    await new Promise<void>((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("postcode_script_load_failed")), { once: true });
    });
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "daum-postcode-script";
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("postcode_script_load_failed"));
    document.body.appendChild(script);
  });
}

export default function AddressSection({ zipcode, address1, address2, onChange, onLookupResult }: Props) {
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const postcodeMountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isPostcodeOpen) return;

    let cancelled = false;

    const mount = async () => {
      await ensureDaumPostcodeScript();
      if (cancelled) return;

      const Postcode = window.daum?.Postcode;
      if (!Postcode || !postcodeMountRef.current) return;

      postcodeMountRef.current.innerHTML = "";
      new Postcode({
        width: "100%",
        height: "100%",
        oncomplete: (data) => {
          const nextZipcode = (data.zonecode ?? "").trim();
          const nextAddress = (data.roadAddress ?? data.jibunAddress ?? "").trim();
          onLookupResult(nextZipcode, nextAddress);
          setIsPostcodeOpen(false);
        },
      }).embed(postcodeMountRef.current);
    };

    mount();

    return () => {
      cancelled = true;
      if (postcodeMountRef.current) {
        postcodeMountRef.current.innerHTML = "";
      }
    };
  }, [isPostcodeOpen, onLookupResult]);

  const handlePostcodeLookup = () => {
    setIsPostcodeOpen(true);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Address</h2>
      <div className={styles.formRow}>
        <div className={styles.inlineFields}>
          <label className={styles.field}>
            Postal Code
            <input value={zipcode} onChange={(e) => onChange("zipcode", e.target.value)} />
          </label>
          <div className={styles.fieldButtonWrap}>
            <button type="button" className={styles.lookupButton} onClick={handlePostcodeLookup}>
              우편번호 찾기
            </button>
          </div>
          <label className={styles.field}>
            Address
            <input value={address1} onChange={(e) => onChange("address1", e.target.value)} />
          </label>
        </div>
      </div>
      <div className={styles.formRow}>
        <label className={styles.centeredText}>
          Detail
          <input value={address2} onChange={(e) => onChange("address2", e.target.value)} />
        </label>
      </div>
      {isPostcodeOpen ? (
        <div className={styles.postcodeOverlay}>
          <div className={styles.postcodeModal}>
            <div className={styles.postcodeHeader}>
              <span>우편번호 찾기</span>
              <button type="button" className={styles.postcodeClose} onClick={() => setIsPostcodeOpen(false)}>
                닫기
              </button>
            </div>
            <div ref={postcodeMountRef} className={styles.postcodeBody} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

