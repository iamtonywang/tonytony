import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  return Response.json({
    authenticated: !!data.user
  });
}

