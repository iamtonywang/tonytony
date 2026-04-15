-- Public minimal view for product board author display
-- Exposes only (id, login_id) for users who have board activity.
-- Does NOT change grants/policies on public.users.

create or replace view public.public_board_users as
select distinct
  u.id,
  u.login_id
from public.users u
join (
  select i.user_id
  from public.inquiries i
  union
  select r.user_id
  from public.reviews r
) board_authors
  on board_authors.user_id = u.id;

grant select on table public.public_board_users to anon, authenticated;
