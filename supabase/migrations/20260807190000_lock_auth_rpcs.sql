-- Lock auth RPCs to service_role only.
-- Does not DROP functions. Does not alter tables/data.
-- Auth signUp/signIn cookie flow remains in application code (anon Cookie client).

-- A. Reproduce check_signup_duplicates (was live-only; now repo-reproducible)
create or replace function public.check_signup_duplicates(
  p_login_id text,
  p_phone text
)
returns table (
  login_id_exists boolean,
  phone_exists boolean
)
language plpgsql
stable
security definer
set search_path to public
as $$
declare
  v_phone text := regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g');
begin
  return query
  select
    exists (
      select 1
      from public.users u
      where u.login_id = p_login_id
    ) as login_id_exists,
    exists (
      select 1
      from public.users u
      where length(v_phone) > 0
        and regexp_replace(coalesce(u.phone, ''), '[^0-9]', '', 'g') = v_phone
    ) as phone_exists;
end;
$$;

-- B. Re-affirm create_user_after_signup body identical to final_ddl.sql (no logic change)
create or replace function public.create_user_after_signup(
  p_auth_user_id uuid,
  p_login_id text,
  p_phone text,
  p_email text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (
    auth_user_id,
    login_id,
    phone,
    email,
    user_status
  )
  values (
    p_auth_user_id,
    p_login_id,
    p_phone,
    p_email,
    'active'
  );
end;
$$;

-- B. Re-affirm login_lookup_email_and_status body identical to final_ddl.sql (no logic change)
create or replace function public.login_lookup_email_and_status(p_login_id text)
returns table (
  email text,
  user_status user_status
)
language sql
stable
security definer
set search_path = public
as $$
  with matched as (
    select u.email, u.user_status
    from users u
    where u.login_id = p_login_id
      and u.email is not null
  )
  select m.email, m.user_status
  from matched m
  where (select count(*) from matched) = 1;
$$;

-- C. Exact-signature privilege lock
revoke all on function public.check_signup_duplicates(text, text) from public;
revoke all on function public.check_signup_duplicates(text, text) from anon;
revoke all on function public.check_signup_duplicates(text, text) from authenticated;
grant execute on function public.check_signup_duplicates(text, text) to service_role;

revoke all on function public.create_user_after_signup(uuid, text, text, text) from public;
revoke all on function public.create_user_after_signup(uuid, text, text, text) from anon;
revoke all on function public.create_user_after_signup(uuid, text, text, text) from authenticated;
grant execute on function public.create_user_after_signup(uuid, text, text, text) to service_role;

revoke all on function public.login_lookup_email_and_status(text) from public;
revoke all on function public.login_lookup_email_and_status(text) from anon;
revoke all on function public.login_lookup_email_and_status(text) from authenticated;
grant execute on function public.login_lookup_email_and_status(text) to service_role;
