import "server-only";
import { cache } from "react";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

export type HeaderSession = {
  authenticated: boolean;
  loginId: string | null;
  isPartner: boolean;
  isAdmin: boolean;
  /** Resolved `users.id` when authenticated; not used by Header, for server reuse */
  userId: number | null;
};

export const getHeaderSession = cache(async function getHeaderSession(): Promise<HeaderSession> {
  const supabase = await getSupabaseServerReadonlyClient();

  const guest: HeaderSession = {
    authenticated: false,
    loginId: null,
    isPartner: false,
    isAdmin: false,
    userId: null,
  };

  let authUser: { id: string } | null = null;
  try {
    const result = await supabase.auth.getUser();
    if (result.error) {
      return guest;
    }
    authUser = result.data?.user ?? null;
  } catch {
    return guest;
  }

  if (!authUser) {
    return guest;
  }

  const { data: usersRows } = await supabase
    .from("users")
    .select("id, login_id")
    .eq("auth_user_id", authUser.id)
    .maybeSingle();

  const userRow =
    usersRows &&
    typeof (usersRows as { id: unknown }).id === "number"
      ? (usersRows as { id: number; login_id: string | null })
      : null;

  if (!userRow || typeof userRow.id !== "number") {
    return guest;
  }

  const [partnersResult, adminsResult] = await Promise.all([
    supabase.from("partners").select("id").eq("user_id", userRow.id).limit(1),
    supabase
      .from("admins")
      .select("id")
      .eq("user_id", userRow.id)
      .eq("admin_status", "active")
      .limit(1),
  ]);

  const partnerRows = partnersResult.data;
  const adminRows = adminsResult.data;
  const isPartner = Array.isArray(partnerRows) && partnerRows.length === 1;
  const isAdmin = Array.isArray(adminRows) && adminRows.length === 1;

  return {
    authenticated: true,
    loginId: userRow.login_id ?? null,
    isPartner,
    isAdmin,
    userId: userRow.id,
  };
});

