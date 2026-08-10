"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { PublicProductBoardItem } from "./publicBoardTypes";

export type LazyProductBoardStatus = "idle" | "loading" | "success" | "empty" | "error";

type BoardApiOk = { ok: true; items: PublicProductBoardItem[] };
type BoardApiErr = { ok: false; message?: string };

function isBoardItem(value: unknown): value is PublicProductBoardItem {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.author === "string" &&
    typeof row.preview === "string" &&
    (row.type === "Inquiry" || row.type === "Review") &&
    typeof row.date === "string" &&
    typeof row.content === "string" &&
    typeof row.isPrivate === "boolean" &&
    typeof row.canViewFullContent === "boolean"
  );
}

function parseBoardResponse(data: unknown): PublicProductBoardItem[] | null {
  if (!data || typeof data !== "object") return null;
  const body = data as BoardApiOk | BoardApiErr;
  if (!("ok" in body) || body.ok !== true) return null;
  if (!Array.isArray(body.items)) return null;
  if (!body.items.every(isBoardItem)) return null;
  return body.items;
}

export function useLazyProductBoard(slug: string | null | undefined) {
  const [status, setStatus] = useState<LazyProductBoardStatus>("idle");
  const [items, setItems] = useState<PublicProductBoardItem[]>([]);
  const statusRef = useRef<LazyProductBoardStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const fetchBoard = useCallback(
    async (mode: "load" | "refresh") => {
      const trimmed = typeof slug === "string" ? slug.trim() : "";
      if (!trimmed) {
        if (mountedRef.current) {
          setStatus("error");
          setItems([]);
        }
        return;
      }

      if (mode === "load") {
        if (statusRef.current === "loading") return;
        if (statusRef.current === "success" || statusRef.current === "empty") return;
      } else if (statusRef.current === "loading") {
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (mountedRef.current) {
        setStatus("loading");
      }

      try {
        const res = await fetch(`/api/products/board?slug=${encodeURIComponent(trimmed)}`, {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });
        const data: unknown = await res.json().catch(() => null);
        if (controller.signal.aborted || !mountedRef.current) return;

        const parsed = parseBoardResponse(data);
        if (!res.ok || parsed === null) {
          setItems([]);
          setStatus("error");
          return;
        }

        setItems(parsed);
        setStatus(parsed.length === 0 ? "empty" : "success");
      } catch (err) {
        if (controller.signal.aborted || !mountedRef.current) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setItems([]);
        setStatus("error");
      }
    },
    [slug],
  );

  const loadBoard = useCallback(() => fetchBoard("load"), [fetchBoard]);
  const refreshBoard = useCallback(() => fetchBoard("refresh"), [fetchBoard]);

  return {
    status,
    items,
    loadBoard,
    refreshBoard,
  };
}
