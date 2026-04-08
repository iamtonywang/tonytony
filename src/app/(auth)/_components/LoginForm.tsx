"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minPasswordLength = useMemo(() => 1, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setSuccess(null);

    const loginIdTrimmed = loginId.trim();
    if (!loginIdTrimmed) {
      setError("로그인 ID를 입력해 주세요.");
      return;
    }
    if (!password || password.length < minPasswordLength) {
      setError("비밀번호를 올바르게 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_id: loginIdTrimmed,
          password,
        }),
      });
      const data: unknown = await res.json().catch(() => null);
      if (!data || typeof data !== "object") {
        setError("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      const ok = (data as { ok?: unknown }).ok;
      const message = (data as { message?: unknown }).message;
      if (ok === true) {
        setSuccess("로그인이 완료되었습니다.");
        // 로그인 직후 상단 Header props(authenticated, loginId, isPartner) 재계산 목적
        router.replace("/");
        router.refresh();
        return;
      }
      setError(typeof message === "string" ? message : "로그인에 실패했습니다.");
    } catch {
      setError("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <main>
          <div className={styles.headerText}>
            <h1 className={styles.brand}>TONYWANG</h1>
            <p className={styles.sub}>Plant Cell Genetic Protein Laboratory</p>
            <p className={styles.sub}>Molecular Bio-Bio Technology</p>
            <p className={styles.desc}>Hi, I wish you all the best for being my friend</p>
          </div>
          <form className={styles.form} onSubmit={onSubmit}>
            <div>
              <label htmlFor="login_id" className={styles.centerText}>
                Login ID
              </label>
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
              <label htmlFor="password" className={styles.centerText}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {isSubmitting ? "Submitting..." : "Login"}
            </button>

            <div className={styles.signup}>
              <p style={{ marginTop: 12 }}>
                <Link href="/signup">회원가입</Link>
              </p>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

