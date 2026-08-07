-- Admin dashboard: one SECURITY DEFINER aggregate RPC (network RTT 1).
-- Does not modify tables, enums, RLS, or existing admin_dashboard_site_visit_stats().

create or replace function public.admin_dashboard_summary()
returns json
language plpgsql
stable
security definer
set search_path to 'public'
as $$
declare
  v_kst date := (timezone('Asia/Seoul', now()))::date;
begin
  if not coalesce(public.is_admin(), false) then
    raise exception 'admin_forbidden'
      using errcode = '42501';
  end if;

  return (
    select json_build_object(
      'todayVisitors', (
        select count(*)::bigint
        from public.site_daily_visits s
        where s.visit_date = v_kst
      ),
      'last7DaysUniqueVisitors', (
        select count(distinct coalesce(s.auth_user_id::text, s.visitor_token))::bigint
        from public.site_daily_visits s
        where s.visit_date >= v_kst - 6
      ),
      'totalUsers', (
        select count(*)::bigint
        from public.users u
      ),
      'recent7Days', (
        select count(*)::bigint
        from public.users u
        where u.created_at >= now() - interval '7 days'
      ),
      'totalOrders', (
        select count(*)::bigint
        from public.orders o
      ),
      'pendingOrders', (
        select count(*)::bigint
        from public.orders o
        where o.order_status = 'pending'
      ),
      'pendingRefunds', (
        select count(*)::bigint
        from public.refunds r
        where r.refund_status = 'requested'
      ),
      'approvedRefunds', (
        select count(*)::bigint
        from public.refunds r
        where r.refund_status = 'approved'
      ),
      'requestedCount', (
        select count(*)::bigint
        from public.partner_settlement_requests psr
        where psr.request_status = 'pending'
      ),
      'payableCount', (
        select count(*)::bigint
        from public.partner_settlement_requests psr
        where psr.request_status = 'approved'
      )
    )
  );
end;
$$;

revoke all on function public.admin_dashboard_summary() from public;
revoke all on function public.admin_dashboard_summary() from anon;
revoke all on function public.admin_dashboard_summary() from authenticated;
grant execute on function public.admin_dashboard_summary() to authenticated;
grant execute on function public.admin_dashboard_summary() to service_role;
