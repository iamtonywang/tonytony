import "server-only";
import { cache } from "react";

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

export type HeaderSession = {
  authenticated: boolean;
  loginId: string | null;
  isPartner: boolean;
  isAdmin: boolean;
};

export const getHeaderSession = cache(async function getHeaderSession(): Promise<HeaderSession> {
  const supabase = await getSupabaseServerReadonlyClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return {
      authenticated: false,
      loginId: null,
      isPartner: false,
      isAdmin: false,
    };
  }

  const { data: usersRows } = await supabase
    .from("users")
    .select("id, login_id")
    .eq("auth_user_id", userData.user.id)
    .limit(1);

  const userRow =
    Array.isArray(usersRows) && usersRows.length === 1
      ? (usersRows[0] as { id: number; login_id: string | null })
      : null;

  if (!userRow || typeof userRow.id !== "number") {
    return {
      authenticated: false,
      loginId: null,
      isPartner: false,
      isAdmin: false,
    };
  }

  const [partnersResult, adminsResult] = await Promise.all([
    supabase.from("partners").select("id").eq("user_id", userRow.id).limit(1),
    supabase
      .from("admins")
      .select("admin_status")
      .eq("user_id", userRow.id)
      .eq("admin_status", "active")
      .limit(1),
  ]);

  const partnerRows = partnersResult.data;
  const adminRows = adminsResult.data;

  return {
    authenticated: true,
    loginId: userRow.login_id ?? null,
    isPartner: Array.isArray(partnerRows) && partnerRows.length === 1,
    isAdmin: Array.isArray(adminRows) && adminRows.length === 1,
  };
});

