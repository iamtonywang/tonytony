"use client";

import { useMemo, useState } from "react";
import styles from "./SignupForm.module.css";

function validateBasicPhone(phone: string): boolean {
  const normalized = phone.replace(/\s+/g, "");
  return /^\+?\d[\d-]{6,14}$/.test(normalized);
}

export default function SignupForm() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minPasswordLength = useMemo(() => 6, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setSuccess(null);

    const loginIdTrimmed = loginId.trim();
    const phoneTrimmed = phone.trim().replace(/\D/g, "");

    // Client-side format validation only.
    if (!loginIdTrimmed) {
      setError("로그인 ID를 입력해 주세요.");
      return;
    }
    if (!password || password.length < minPasswordLength) {
      setError("비밀번호를 올바르게 입력해 주세요.");
      return;
    }
    if (!phoneTrimmed || !validateBasicPhone(phoneTrimmed)) {
      setError("전화번호를 올바르게 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_id: loginIdTrimmed,
          password,
          phone: phoneTrimmed,
        }),
      });

      const data: unknown = await res.json().catch(() => null);
      if (!data || typeof data !== "object") {
        setError("회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      const ok = (data as { ok?: unknown }).ok;
      const message = (data as { message?: unknown }).message;

      if (ok === true) {
        setSuccess("회원가입 요청이 완료되었습니다.");
        return;
      }

      setError(typeof message === "string" ? message : "회원가입에 실패했습니다.");
    } catch {
      setError("회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <main>
          <h1>Sign Up</h1>
          <form onSubmit={onSubmit}>
            <div>
              <label htmlFor="login_id">Login ID</label>
              <input
                id="login_id"
                name="login_id"
                type="text"
                autoComplete="username"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {error ? (
              <p role="alert" style={{ color: "crimson" }}>
                {error}
              </p>
            ) : null}
            {success ? <p style={{ color: "green" }}>{success}</p> : null}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

