import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Debug env loading (temporary, per instruction)
console.log('ENV URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('ENV KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('CWD:', process.cwd());

/**
 * Returns a server-only, read-only configured Supabase client.
 * Throws a descriptive error when required environment variables are missing.
 */
export function getSupabaseServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url.trim().length === 0) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!anonKey || anonKey.trim().length === 0) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

