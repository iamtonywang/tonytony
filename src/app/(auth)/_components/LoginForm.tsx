"use client";

import { useMemo, useState } from "react";

export default function LoginForm() {
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
        // 현재 persistSession: false 이므로 유지되지 않을 수 있음
        setSuccess("로그인이 완료되었습니다.");
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
    <main>
      <h1>Login</h1>
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
      </form>
    </main>
  );
}

