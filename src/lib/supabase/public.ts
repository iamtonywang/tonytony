import 'server-only';

import { createClient } from '@supabase/supabase-js';

/**
 * Returns a PUBLIC/ANON Supabase client for server-side public reads.
 * - No cookies adapter
 * - No session/auth coupling
 * - Use ONLY for public read endpoints (e.g., products catalog)
 */
export function getSupabasePublicClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!url || url.trim().length === 0) {
		throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL');
	}
	if (!anonKey || anonKey.trim().length === 0) {
		throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
	}

	return createClient(url, anonKey);
}

