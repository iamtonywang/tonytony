import { getSupabaseServerReadonlyClient } from "@/lib/supabase/server-readonly";

export async function GET() {
  const supabase = await getSupabaseServerReadonlyClient();
  const { data } = await supabase.auth.getUser();

  return Response.json({
    authenticated: !!data.user
  });
}

