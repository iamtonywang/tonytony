import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return Response.json({ authenticated: false });
  }
  return Response.json({ authenticated: !!data.user });
}

