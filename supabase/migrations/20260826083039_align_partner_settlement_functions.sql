create or replace function public.approve_partner_settlement_request(
  p_request_id bigint,
  p_processed_by_admin_id bigint,
  p_payment_memo text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_ok boolean;
  v_status public.request_status;
begin
  select exists (
    select 1
    from admins a
    where a.id = p_processed_by_admin_id
      and a.admin_status = 'active'
  ) into v_admin_ok;

  if not v_admin_ok then
    raise exception 'admin_forbidden';
  end if;

  select request_status
    into v_status
  from partner_settlement_requests
  where id = p_request_id
  for update;

  if not found then
    raise exception 'request_not_found';
  end if;

  if v_status <> 'pending' then
    raise exception 'request_not_approvable';
  end if;

  update partner_settlement_requests
  set
    request_status = 'approved',
    approved_at = now(),
    processed_by_admin_id = p_processed_by_admin_id,
    payment_memo = case
      when p_payment_memo is not null and length(btrim(p_payment_memo)) > 0 then btrim(p_payment_memo)
      else payment_memo
    end,
    updated_at = now()
  where id = p_request_id;
end;
$$;

create or replace function public.reject_partner_settlement_request(
  p_request_id bigint,
  p_processed_by_admin_id bigint,
  p_rejection_note text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_ok boolean;
  v_status public.request_status;
  v_note text;
begin
  v_note := btrim(coalesce(p_rejection_note, ''));
  if length(v_note) = 0 then
    raise exception 'rejection_note_required';
  end if;

  select exists (
    select 1
    from admins a
    where a.id = p_processed_by_admin_id
      and a.admin_status = 'active'
  ) into v_admin_ok;

  if not v_admin_ok then
    raise exception 'admin_forbidden';
  end if;

  select request_status
    into v_status
  from partner_settlement_requests
  where id = p_request_id
  for update;

  if not found then
    raise exception 'request_not_found';
  end if;

  if v_status <> 'pending' then
    raise exception 'request_not_rejectable';
  end if;

  update partner_settlement_requests
  set
    request_status = 'rejected',
    rejected_at = now(),
    processed_by_admin_id = p_processed_by_admin_id,
    request_note = v_note,
    updated_at = now()
  where id = p_request_id;
end;
$$;

create or replace function public.mark_partner_settlement_request_paid(
  p_request_id bigint,
  p_processed_by_admin_id bigint
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_ok boolean;
  v_req partner_settlement_requests%rowtype;
  v_now timestamptz := now();
  r_item record;
  v_st public.settlement_status;
  v_item_count integer;
begin
  select exists (
    select 1
    from admins a
    where a.id = p_processed_by_admin_id
      and a.admin_status = 'active'
  ) into v_admin_ok;

  if not v_admin_ok then
    raise exception 'admin_forbidden';
  end if;

  select count(*)::integer
    into v_item_count
  from partner_settlement_request_items psi
  where psi.request_id = p_request_id;

  if v_item_count is null or v_item_count < 1 then
    raise exception 'request_has_no_items';
  end if;

  select *
    into v_req
  from partner_settlement_requests
  where id = p_request_id
  for update;

  if not found then
    raise exception 'request_not_found';
  end if;

  if v_req.request_status <> 'approved' then
    raise exception 'request_not_payable';
  end if;

  for r_item in
    select psi.settlement_id
    from partner_settlement_request_items psi
    where psi.request_id = p_request_id
  loop
    select settlement_status
      into v_st
    from settlements
    where id = r_item.settlement_id
      and partner_id = v_req.partner_id
    for update;

    if not found then
      raise exception 'settlement_not_found';
    end if;

    if v_st <> 'confirmed' then
      raise exception 'settlement_not_payable';
    end if;

    update settlements
    set
      settlement_status = 'paid',
      settlement_paid_at = v_now,
      updated_at = v_now
    where id = r_item.settlement_id
      and partner_id = v_req.partner_id;
  end loop;

  update partner_settlement_requests
  set
    request_status = 'paid',
    paid_at = v_now,
    processed_by_admin_id = p_processed_by_admin_id,
    updated_at = now()
  where id = p_request_id;
end;
$$;

REVOKE EXECUTE ON FUNCTION public.approve_partner_settlement_request(bigint, bigint, text) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.reject_partner_settlement_request(bigint, bigint, text) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.mark_partner_settlement_request_paid(bigint, bigint) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.approve_partner_settlement_request(bigint, bigint, text) TO authenticated;

GRANT EXECUTE ON FUNCTION public.reject_partner_settlement_request(bigint, bigint, text) TO authenticated;

GRANT EXECUTE ON FUNCTION public.mark_partner_settlement_request_paid(bigint, bigint) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.approve_partner_settlement_request(bigint, text) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.reject_partner_settlement_request(bigint, text) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.mark_partner_settlement_request_paid(bigint, text) FROM PUBLIC;
