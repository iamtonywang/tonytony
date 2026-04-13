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
    return [];
  }

  const productId = (prodRows[0] as { id: number }).id;

  const [inqRes, revRes] = await Promise.all([
    supabase
      .from('inquiries')
      .select(
        'id, user_id, title, content, is_private, inquiry_status, created_at, answer_content',
      )
      .eq('product_id', productId)
      .in('inquiry_status', ['active', 'answered'])
      .order('created_at', { ascending: false }),
    supabase
      .from('reviews')
      .select('id, user_id, content, is_private, review_status, created_at')
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

  const userIds = new Set<number>();
  for (const r of inquiries as { user_id: number }[]) {
    userIds.add(Number(r.user_id));
  }
  for (const r of reviews as { user_id: number }[]) {
    userIds.add(Number(r.user_id));
  }

  const loginByUserId = new Map<number, string>();
  if (userIds.size > 0) {
    const { data: usersData, error: usersErr } = await supabase
      .from('users')
      .select('id, login_id')
      .in('id', [...userIds]);

    if (!usersErr && Array.isArray(usersData)) {
      for (const u of usersData as { id: number; login_id: string }[]) {
        loginByUserId.set(Number(u.id), u.login_id ?? '');
      }
    }
  }

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
  }>) {
    const authorUserId = Number(row.user_id);
    const isPrivate = row.is_private === true;
    const author = loginByUserId.get(authorUserId)?.trim() || 'User';
    let content = row.content ?? '';
    if (row.answer_content?.trim()) {
      content = `${content}\n\n[답변]\n${row.answer_content.trim()}`;
    }
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
  }>) {
    const authorUserId = Number(row.user_id);
    const isPrivate = row.is_private === true;
    const author = loginByUserId.get(authorUserId)?.trim() || 'User';
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
      isPrivate,
      canViewFullContent,
      _sortMs: new Date(row.created_at).getTime(),
    });
  }

  items.sort((a, b) => b._sortMs - a._sortMs);
  return items.map(({ _sortMs: _s, ...rest }) => rest);
}
