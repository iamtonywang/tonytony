-- Fix board read permissions for product detail page
-- Goal:
-- 1) Remove table-level permission denied on inquiries/reviews for anon/authenticated
-- 2) Keep private-post protections via RLS

-- Minimal read grants for server-readonly client (anon/authenticated context)
grant select on table public.reviews to anon, authenticated;
grant select on table public.inquiries to anon, authenticated;

-- Rebuild SELECT policies safely (idempotent)
drop policy if exists reviews_select_policy on public.reviews;
create policy reviews_select_policy
on public.reviews
for select
using (
  (
    review_status = 'active'
    and is_private = false
  )
  or user_id = current_user_pk()
  or is_admin()
);

drop policy if exists inquiries_select_policy on public.inquiries;
create policy inquiries_select_policy
on public.inquiries
for select
using (
  (
    inquiry_status in ('active', 'answered')
    and is_private = false
  )
  or user_id = current_user_pk()
  or is_admin()
);
