-- 기존 마이그레이션 적용 DB용: record_site_daily_visit 을 NOT EXISTS 방식으로 교체 (42P10 제거)
-- Supabase SQL Editor에 단독 실행 가능

create or replace function public.record_site_daily_visit(
  p_visit_date date,
  p_auth_user_id uuid,
  p_visitor_token text,
  p_is_authenticated boolean,
  p_path text,
  p_referrer text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_is_authenticated then
    if p_auth_user_id is null then
      return;
    end if;
    insert into public.site_daily_visits (
      visit_date, visited_at, auth_user_id, visitor_token, is_authenticated, path, referrer
    )
    select
      p_visit_date,
      now(),
      p_auth_user_id,
      null,
      true,
      nullif(p_path, ''),
      nullif(p_referrer, '')
    where not exists (
      select 1
      from public.site_daily_visits s
      where s.visit_date = p_visit_date
        and s.auth_user_id = p_auth_user_id
    );
    return;
  end if;

  if p_visitor_token is null or length(btrim(p_visitor_token)) = 0 then
    return;
  end if;

  insert into public.site_daily_visits (
    visit_date, visited_at, auth_user_id, visitor_token, is_authenticated, path, referrer
  )
  select
    p_visit_date,
    now(),
    null,
    btrim(p_visitor_token),
    false,
    nullif(p_path, ''),
    nullif(p_referrer, '')
  where not exists (
    select 1
    from public.site_daily_visits s
    where s.visit_date = p_visit_date
      and s.visitor_token = btrim(p_visitor_token)
  );
end;
$$;

revoke all on function public.record_site_daily_visit(date, uuid, text, boolean, text, text) from public;
grant execute on function public.record_site_daily_visit(date, uuid, text, boolean, text, text) to service_role;
