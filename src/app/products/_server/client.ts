import 'server-only';

// Re-export PUBLIC client for server-rendered product utilities (catalog is public)
export { getSupabasePublicClient } from '@/lib/supabase/public';

