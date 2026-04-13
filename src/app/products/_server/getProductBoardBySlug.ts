import 'server-only';

import { getHeaderSession } from '@/components/sections/Header/_server/getHeaderSession';
import { getSupabaseServerReadonlyClient } from '@/lib/supabase/server-readonly';
import type { ProductBoardItem, ProductSharedRow } from './types';

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
export async function getProductBoardBySlug(
  slug: string,
  sharedProductRow?: ProductSharedRow | null,
): Promise<ProductBoardItem[]> {
  const totalStart = Date.now();
  const supabase = await getSupabaseServerReadonlyClient();
  const session = await getHeaderSession();
  const viewerUserId = session.userId;
  const viewerIsAdmin = session.isAdmin;

  let productId: number | null = sharedProductRow?.id ?? null;
  const productIdQueryStart = Date.now();
  if (productId === null) {
    const { data: prodRows, error: prodErr } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .eq('is_visible', true)
      .in('product_status', ['active', 'sold_out'])
      .limit(1);
    if (!prodErr && prodRows?.length) {
      productId = (prodRows[0] as { id: number }).id;
    }
    if (prodErr || !prodRows?.length) {
      console.log(`[getProductBoardBySlug] slug=${slug} product_query_ms=${Date.now() - productIdQueryStart}`);
      console.log(`[getProductBoardBySlug] slug=${slug} total_ms=${Date.now() - totalStart}`);
      return [];
    }
  }
  console.log(`[getProductBoardBySlug] slug=${slug} product_query_ms=${Date.now() - productIdQueryStart}`);

  if (productId === null) {
    console.log(`[getProductBoardBySlug] slug=${slug} total_ms=${Date.now() - totalStart}`);
    return [];
  }

  const inquiriesQueryStart = Date.now();
  const inquiriesPromise = supabase
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
    .order('created_at', { ascending: false })
    .limit(10)
    .then((res) => {
      console.log(`[getProductBoardBySlug] slug=${slug} inquiries_query_ms=${Date.now() - inquiriesQueryStart}`);
      return res;
    });
  const reviewsQueryStart = Date.now();
  const reviewsPromise = supabase
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
    .order('created_at', { ascending: false })
    .limit(10)
    .then((res) => {
      console.log(`[getProductBoardBySlug] slug=${slug} reviews_query_ms=${Date.now() - reviewsQueryStart}`);
      return res;
    });
  const parallelQueryStart = Date.now();
  const [inqRes, revRes] = await Promise.all([
    inquiriesPromise,
    reviewsPromise,
  ]);
  console.log(`[getProductBoardBySlug] slug=${slug} board_parallel_ms=${Date.now() - parallelQueryStart}`);

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

  const mappingStart = Date.now();
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
  console.log(`[getProductBoardBySlug] slug=${slug} mapping_ms=${Date.now() - mappingStart}`);
  console.log(`[getProductBoardBySlug] slug=${slug} total_ms=${Date.now() - totalStart}`);
  return result;
}
