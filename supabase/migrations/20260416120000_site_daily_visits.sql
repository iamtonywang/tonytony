-- site_daily_visits: KST 기준 일 1회 dedup 방문 기록 (로그인: auth_user_id / 익명: visitor_token)
-- 적용: Supabase SQL Editor 또는 supabase db push

create table if not exists public.site_daily_visits (
  id bigint generated always as identity primary key,
  visit_date date not null,
  visited_at timestamptz not null default now(),
  auth_user_id uuid,
  visitor_token text,
  is_authenticated boolean not null,
  path text,
  referrer text,

  constraint chk_site_daily_visits_identity_exclusive check (
    (
      is_authenticated = true
      and auth_user_id is not null
      and visitor_token is null
    )
    or (
      is_authenticated = false
      and auth_user_id is null
      and visitor_token is not null
      and length(btrim(visitor_token)) > 0
    )
  )
);

create unique index if not exists site_daily_visits_uq_auth_day
  on public.site_daily_visits (auth_user_id, visit_date)
  where auth_user_id is not null;

create unique index if not exists site_daily_visits_uq_token_day
  on public.site_daily_visits (visitor_token, visit_date)
  where visitor_token is not null;

create index if not exists site_daily_visits_visit_date_idx
  on public.site_daily_visits (visit_date);

alter table public.site_daily_visits enable row level security;

create policy site_daily_visits_select_admin_only
  on public.site_daily_visits
  for select
  using (is_admin());

-- service_role 전용: proxy 등 백엔드에서만 호출
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
    ) values (
      p_visit_date,
      now(),
      p_auth_user_id,
      null,
      true,
      nullif(p_path, ''),
      nullif(p_referrer, '')
    )
    on conflict (auth_user_id, visit_date) where auth_user_id is not null do nothing;
    return;
  end if;

  if p_visitor_token is null or length(btrim(p_visitor_token)) = 0 then
    return;
  end if;

  insert into public.site_daily_visits (
    visit_date, visited_at, auth_user_id, visitor_token, is_authenticated, path, referrer
  ) values (
    p_visit_date,
    now(),
    null,
    btrim(p_visitor_token),
    false,
    nullif(p_path, ''),
    nullif(p_referrer, '')
  )
  on conflict (visitor_token, visit_date) where visitor_token is not null do nothing;
end;
$$;

revoke all on function public.record_site_daily_visit(date, uuid, text, boolean, text, text) from public;
grant execute on function public.record_site_daily_visit(date, uuid, text, boolean, text, text) to service_role;

-- 관리자 대시보드 집계 (JWT 기준 is_admin)
create or replace function public.admin_dashboard_site_visit_stats()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_today bigint;
  v_last7 bigint;
  v_kst date := (timezone('Asia/Seoul', now()))::date;
begin
  if not is_admin() then
    return json_build_object(
      'todayVisitors', 0,
      'last7DaysUniqueVisitors', 0
    );
  end if;

  select count(*)::bigint into v_today
  from public.site_daily_visits
  where visit_date = v_kst;

  select count(distinct coalesce(auth_user_id::text, visitor_token))::bigint into v_last7
  from public.site_daily_visits
  where visit_date >= v_kst - 6;

  return json_build_object(
    'todayVisitors', v_today,
    'last7DaysUniqueVisitors', v_last7
  );
end;
$$;

revoke all on function public.admin_dashboard_site_visit_stats() from public;
grant execute on function public.admin_dashboard_site_visit_stats() to authenticated;
