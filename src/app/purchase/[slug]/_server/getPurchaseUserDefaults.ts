import 'server-only';

import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

type Defaults = {
  buyerDefaults: {
    name: string | null;
    phone: string | null;
    email: string | null;
  } | null;
  receiverDefaults: {
    name: string | null;
    phone: string | null;
    email: string | null;
  } | null;
  addressDefaults: {
    zipcode: string | null;
    address1: string | null;
    address2: string | null;
  } | null;
};

type ProfileRow = {
  real_name: string | null;
  zipcode: string | null;
  address1: string | null;
  address2: string | null;
};

export async function getPurchaseUserDefaults(): Promise<Defaults> {
  const supabase = await getSupabaseServerReadonlyClient();

  // Identify current user via session
  const { data: userData } = await supabase.auth.getUser();
  const authUserId = userData?.user?.id ?? null;
  const authEmail = (userData?.user as { email?: string } | undefined)?.email ?? null;
  if (!authUserId) {
    return {
      buyerDefaults: null,
      receiverDefaults: null,
      addressDefaults: null,
    };
  }

  // Load own users row (RLS should permit own row selection)
  const { data: usersRows } = await supabase
    .from("users")
    .select("id, phone, email")
    .eq("auth_user_id", authUserId)
    .limit(1);
  const userRow = Array.isArray(usersRows) && usersRows.length === 1 ? usersRows[0] as {
    id: number;
    phone: string | null;
    email: string | null;
  } : null;

  // Load profile by users.id when present
  let profile: ProfileRow | null = null;
  if (userRow && typeof userRow.id === "number") {
    const { data: profileRows } = await supabase
      .from("user_profiles")
      .select("real_name, zipcode, address1, address2")
      .eq("user_id", userRow.id)
      .limit(1);
    profile = Array.isArray(profileRows) && profileRows.length === 1 ? (profileRows[0] as ProfileRow) : null;
  }

  const realName = profile?.real_name ?? null;
  const phone = (userRow?.phone ?? null);
  const email = (userRow?.email ?? authEmail ?? null);

  return {
    buyerDefaults: {
      name: realName,
      phone,
      email,
    },
    receiverDefaults: {
      name: realName,
      phone,
      email,
    },
    addressDefaults: {
      zipcode: profile?.zipcode ?? null,
      address1: profile?.address1 ?? null,
      address2: profile?.address2 ?? null,
    },
  };
}

