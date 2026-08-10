begin;

-- Remove permissive authenticated SELECT policies that bypass
-- the existing private-row protections through OR-combined RLS.
-- Live-only insecure policies; safe no-op on fresh DBs that never had them.
-- Does not touch inquiries_select_policy / reviews_select_policy or other commands.
drop policy if exists inquiries_select_public on public.inquiries;
drop policy if exists reviews_select_public on public.reviews;

commit;
