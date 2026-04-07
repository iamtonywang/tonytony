import 'server-only';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Returns a server-only Supabase client with a read-only cookies adapter.
 * This client will NEVER write or remove cookies during Server Component render paths.
 */
export async function getSupabaseServerReadonlyClient() {
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
			// Readonly adapter: no cookie mutations
			set(_name: string, _value: string, _options: CookieOptions) {
				// no-op
			},
			remove(_name: string, _options: CookieOptions) {
				// no-op
			},
		},
	});
}

