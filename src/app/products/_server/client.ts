import 'server-only';

// Re-export readonly client for server-rendered product utilities
export { getSupabaseServerReadonlyClient as getSupabaseServerClient } from '@/lib/supabase/server-readonly';

