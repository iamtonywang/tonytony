import 'server-only';

// Re-export PUBLIC client for server-rendered product utilities (catalog is public)
export { getSupabasePublicClient as getSupabaseServerClient } from '@/lib/supabase/public';

