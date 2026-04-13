import 'server-only';

import { getHeaderSession } from '@/components/sections/Header/_server/getHeaderSession';
import { getSupabaseServerReadonlyClient } from '@/lib/supabase/server-readonly';
import type { ProductBoardItem } from './types';

function formatBoardDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso.slice(0, 10).replace(/-/g, '.');
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function previewFromText(text: string, maxLen: number): string {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen)}…`;
}

/**
 * Loads inquiry + review rows visible to the current session (RLS) for a public product slug.
 */
export async function getProductBoardBySlug(slug: string): Promise<ProductBoardItem[]> {
  const totalStart = Date.now();
  const supabase = await getSupabaseServerReadonlyClient();
  const session = await getHeaderSession();
  const viewerUserId = session.userId;
  const viewerIsAdmin = session.isAdmin;

  const { data: prodRows, error: prodErr } = await supabase
    .from('products')
    .select('id')
    .eq('slug', slug)
    .eq('is_visible', true)
    .in('product_status', ['active', 'sold_out'])
    .limit(1);

  if (prodErr || !prodRows?.length) {
    console.log(`[getProductBoardBySlug_total] ${Date.now() - totalStart} ms`);
    return [];
  }

  const productId = (prodRows[0] as { id: number }).id;

  const [inqRes, revRes] = await Promise.all([
    supabase
      .from('inquiries')
      .select(
        `
        id,
        content,
        is_private,
        created_at,
        user_id,
        title,
        inquiry_status,
        answer_content,
        users:users (
          login_id
        )
      `,
      )
      .eq('product_id', productId)
      .in('inquiry_status', ['active', 'answered'])
      .order('created_at', { ascending: false }),
    supabase
      .from('reviews')
      .select(
        `
        id,
        content,
        is_private,
        created_at,
        user_id,
        review_status,
        users:users (
          login_id
        )
      `,
      )
      .eq('product_id', productId)
      .eq('review_status', 'active')
      .order('created_at', { ascending: false }),
  ]);

  if (inqRes.error) {
    console.error(`getProductBoardBySlug inquiries: ${inqRes.error.message}`);
  }
  if (revRes.error) {
    console.error(`getProductBoardBySlug reviews: ${revRes.error.message}`);
  }

  const inquiries = Array.isArray(inqRes.data) ? inqRes.data : [];
  const reviews = Array.isArray(revRes.data) ? revRes.data : [];

  type UsersJoinRow = { login_id?: string | null };
  type UsersJoin = UsersJoinRow | UsersJoinRow[] | null;

  type Sortable = ProductBoardItem & { _sortMs: number };
  const items: Sortable[] = [];

  for (const row of inquiries as Array<{
    id: number;
    user_id: number;
    title: string;
    content: string;
    is_private: boolean;
    created_at: string;
    answer_content: string | null;
    users?: UsersJoin;
  }>) {
    const authorUserId = Number(row.user_id);
    const isPrivate = row.is_private === true;
    const u = row.users;
    const login =
      u != null && !Array.isArray(u) && typeof u.login_id === 'string'
        ? u.login_id
        : Array.isArray(u) && typeof u[0]?.login_id === 'string'
          ? u[0].login_id
          : '';

    const author =
      login.length >= 3 ? login.slice(0, 3) + '***' : login || 'User';
    const content = row.content ?? '';
    const canViewFullContent =
      !isPrivate ||
      (viewerUserId !== null && authorUserId === viewerUserId) ||
      viewerIsAdmin;
    items.push({
      id: `inquiry-${row.id}`,
      author,
      authorUserId,
      preview: previewFromText(row.title ?? '', 80),
      type: 'Inquiry',
      date: formatBoardDate(row.created_at),
      content,
      answerContent: row.answer_content ?? null,
      isPrivate,
      canViewFullContent,
      _sortMs: new Date(row.created_at).getTime(),
    });
  }

  for (const row of reviews as Array<{
    id: number;
    user_id: number;
    content: string;
    is_private: boolean;
    created_at: string;
    users?: UsersJoin;
  }>) {
    const authorUserId = Number(row.user_id);
    const isPrivate = row.is_private === true;
    const u = row.users;
    const login =
      u != null && !Array.isArray(u) && typeof u.login_id === 'string'
        ? u.login_id
        : Array.isArray(u) && typeof u[0]?.login_id === 'string'
          ? u[0].login_id
          : '';

    const author =
      login.length >= 3 ? login.slice(0, 3) + '***' : login || 'User';
    const c = row.content ?? '';
    const canViewFullContent =
      !isPrivate ||
      (viewerUserId !== null && authorUserId === viewerUserId) ||
      viewerIsAdmin;
    items.push({
      id: `review-${row.id}`,
      author,
      authorUserId,
      preview: previewFromText(c, 80),
      type: 'Review',
      date: formatBoardDate(row.created_at),
      content: c,
      answerContent: null,
      isPrivate,
      canViewFullContent,
      _sortMs: new Date(row.created_at).getTime(),
    });
  }

  items.sort((a, b) => b._sortMs - a._sortMs);
  const result = items.map(({ _sortMs: _s, ...rest }) => rest);
  console.log(`[getProductBoardBySlug_total] ${Date.now() - totalStart} ms`);
  return result;
}
