import 'server-only';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Debug env loading (temporary, per instruction)
console.log('ENV URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('ENV KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('CWD:', process.cwd());

/**
 * Returns a server-only, read-only configured Supabase client.
 * Throws a descriptive error when required environment variables are missing.
 */
export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url.trim().length === 0) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!anonKey || anonKey.trim().length === 0) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  // In current Next.js runtime, cookies() is asynchronous and must be awaited.
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({
            name,
            value,
            ...options,
          });
        } catch {
          // swallow cookie write errors in Server Component render context
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          });
        } catch {
          // swallow cookie write errors in Server Component render context
        }
      },
    },
  });
}

