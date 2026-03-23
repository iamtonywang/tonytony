-- 01_enum
-- 목적:
-- 1) enum이 없으면 생성
-- 2) enum이 이미 있으면 SSOT와 정확히 동일한지 검증
-- 3) 다르면 즉시 예외 발생 (조용한 불일치 방지)
--
-- 주의:
-- - 이 블록은 enum 전용이다.
-- - 테이블 / FK / index / trigger / RLS / policy / function 은 넣지 않는다.
-- - 이후 enum 값 추가/변경/삭제는 별도 migration으로 처리한다.

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'user_status'
  ) then
    create type public.user_status as enum (
      'active',
      'blocked',
      'withdrawn'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'user_status';

    if v_labels is distinct from array['active','blocked','withdrawn']::text[] then
      raise exception 'enum mismatch: public.user_status, actual=% expected=%',
        v_labels, array['active','blocked','withdrawn']::text[];
    end if;
  end if;
end
$$;

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'admin_role'
  ) then
    create type public.admin_role as enum (
      'super_admin',
      'operator',
      'settlement_manager',
      'cs_manager'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'admin_role';

    if v_labels is distinct from array['super_admin','operator','settlement_manager','cs_manager']::text[] then
      raise exception 'enum mismatch: public.admin_role, actual=% expected=%',
        v_labels, array['super_admin','operator','settlement_manager','cs_manager']::text[];
    end if;
  end if;
end
$$;

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'admin_status'
  ) then
    create type public.admin_status as enum (
      'active',
      'inactive'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'admin_status';

    if v_labels is distinct from array['active','inactive']::text[] then
      raise exception 'enum mismatch: public.admin_status, actual=% expected=%',
        v_labels, array['active','inactive']::text[];
    end if;
  end if;
end
$$;

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'application_status'
  ) then
    create type public.application_status as enum (
      'pending',
      'approved',
      'rejected',
      'blocked'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'application_status';

    if v_labels is distinct from array['pending','approved','rejected','blocked']::text[] then
      raise exception 'enum mismatch: public.application_status, actual=% expected=%',
        v_labels, array['pending','approved','rejected','blocked']::text[];
    end if;
  end if;
end
$$;

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'partner_status'
  ) then
    create type public.partner_status as enum (
      'active',
      'inactive',
      'blocked'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'partner_status';

    if v_labels is distinct from array['active','inactive','blocked']::text[] then
      raise exception 'enum mismatch: public.partner_status, actual=% expected=%',
        v_labels, array['active','inactive','blocked']::text[];
    end if;
  end if;
end
$$;

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'product_status'
  ) then
    create type public.product_status as enum (
      'draft',
      'active',
      'inactive',
      'sold_out'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'product_status';

    if v_labels is distinct from array['draft','active','inactive','sold_out']::text[] then
      raise exception 'enum mismatch: public.product_status, actual=% expected=%',
        v_labels, array['draft','active','inactive','sold_out']::text[];
    end if;
  end if;
end
$$;

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'media_type'
  ) then
    create type public.media_type as enum (
      'hero_image',
      'gallery_image',
      'certification_image',
      'document_file'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'media_type';

    if v_labels is distinct from array['hero_image','gallery_image','certification_image','document_file']::text[] then
      raise exception 'enum mismatch: public.media_type, actual=% expected=%',
        v_labels, array['hero_image','gallery_image','certification_image','document_file']::text[];
    end if;
  end if;
end
$$;

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'order_status'
  ) then
    create type public.order_status as enum (
      'pending',
      'paid',
      'preparing',
      'shipped',
      'completed',
      'cancelled',
      'refunded'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'order_status';

    if v_labels is distinct from array['pending','paid','preparing','shipped','completed','cancelled','refunded']::text[] then
      raise exception 'enum mismatch: public.order_status, actual=% expected=%',
        v_labels, array['pending','paid','preparing','shipped','completed','cancelled','refunded']::text[];
    end if;
  end if;
end
$$;

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'payment_status'
  ) then
    create type public.payment_status as enum (
      'pending',
      'success',
      'failed',
      'cancelled',
      'refunded'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'payment_status';

    if v_labels is distinct from array['pending','success','failed','cancelled','refunded']::text[] then
      raise exception 'enum mismatch: public.payment_status, actual=% expected=%',
        v_labels, array['pending','success','failed','cancelled','refunded']::text[];
    end if;
  end if;
end
$$;

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'refund_status'
  ) then
    create type public.refund_status as enum (
      'requested',
      'approved',
      'rejected',
      'completed'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'refund_status';

    if v_labels is distinct from array['requested','approved','rejected','completed']::text[] then
      raise exception 'enum mismatch: public.refund_status, actual=% expected=%',
        v_labels, array['requested','approved','rejected','completed']::text[];
    end if;
  end if;
end
$$;

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'settlement_status'
  ) then
    create type public.settlement_status as enum (
      'pending',
      'confirmed',
      'paid',
      'cancelled'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'settlement_status';

    if v_labels is distinct from array['pending','confirmed','paid','cancelled']::text[] then
      raise exception 'enum mismatch: public.settlement_status, actual=% expected=%',
        v_labels, array['pending','confirmed','paid','cancelled']::text[];
    end if;
  end if;
end
$$;

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'request_status'
  ) then
    create type public.request_status as enum (
      'pending',
      'approved',
      'rejected',
      'paid'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'request_status';

    if v_labels is distinct from array['pending','approved','rejected','paid']::text[] then
      raise exception 'enum mismatch: public.request_status, actual=% expected=%',
        v_labels, array['pending','approved','rejected','paid']::text[];
    end if;
  end if;
end
$$;

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'change_type'
  ) then
    create type public.change_type as enum (
      'settlement',
      'reward',
      'use',
      'withdrawal',
      'adjustment'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'change_type';

    if v_labels is distinct from array['settlement','reward','use','withdrawal','adjustment']::text[] then
      raise exception 'enum mismatch: public.change_type, actual=% expected=%',
        v_labels, array['settlement','reward','use','withdrawal','adjustment']::text[];
    end if;
  end if;
end
$$;

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'review_status'
  ) then
    create type public.review_status as enum (
      'active',
      'hidden',
      'deleted'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'review_status';

    if v_labels is distinct from array['active','hidden','deleted']::text[] then
      raise exception 'enum mismatch: public.review_status, actual=% expected=%',
        v_labels, array['active','hidden','deleted']::text[];
    end if;
  end if;
end
$$;

do $$
declare
  v_labels text[];
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'inquiry_status'
  ) then
    create type public.inquiry_status as enum (
      'active',
      'answered',
      'hidden',
      'deleted'
    );
  else
    select array_agg(e.enumlabel order by e.enumsortorder)
      into v_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
      and t.typname = 'inquiry_status';

    if v_labels is distinct from array['active','answered','hidden','deleted']::text[] then
      raise exception 'enum mismatch: public.inquiry_status, actual=% expected=%',
        v_labels, array['active','answered','hidden','deleted']::text[];
    end if;
  end if;
end
$$;

-- 02_core_tables
create table users (
  id bigserial primary key,
  auth_user_id uuid not null,
  login_id text not null,
  phone text not null,
  email text,
  user_status user_status not null default 'active',
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_users_auth_user_id unique (auth_user_id),
  constraint uq_users_login_id unique (login_id),
  constraint uq_users_phone unique (phone),
  constraint uq_users_email unique (email),

  constraint chk_users_login_id_not_blank
    check (length(btrim(login_id)) > 0),
  constraint chk_users_phone_not_blank
    check (length(btrim(phone)) > 0),
  constraint chk_users_email_not_blank
    check (email is null or length(btrim(email)) > 0)
);

create table user_profiles (
  id bigserial primary key,
  user_id bigint not null,
  real_name text not null,
  zipcode text,
  address1 text,
  address2 text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_user_profiles_user_id unique (user_id),
  constraint fk_user_profiles_user
    foreign key (user_id) references users(id) on delete restrict,

  constraint chk_user_profiles_real_name_not_blank
    check (length(btrim(real_name)) > 0),
  constraint chk_user_profiles_zipcode_not_blank
    check (zipcode is null or length(btrim(zipcode)) > 0),
  constraint chk_user_profiles_address1_not_blank
    check (address1 is null or length(btrim(address1)) > 0),
  constraint chk_user_profiles_address2_not_blank
    check (address2 is null or length(btrim(address2)) > 0)
);

create table admins (
  id bigserial primary key,
  user_id bigint not null,
  admin_role admin_role not null,
  admin_status admin_status not null default 'active',
  granted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_admins_user_id unique (user_id),
  constraint fk_admins_user
    foreign key (user_id) references users(id) on delete restrict
);

create table partner_applications (
  id bigserial primary key,
  user_id bigint not null,
  application_status application_status not null default 'pending',
  applied_at timestamptz not null default now(),
  reviewed_by_admin_id bigint,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint fk_partner_applications_user
    foreign key (user_id) references users(id) on delete restrict,

  constraint chk_partner_applications_review_note_not_blank
    check (review_note is null or length(btrim(review_note)) > 0),

  constraint chk_partner_applications_review_state_consistency
    check (
      (
        application_status = 'pending'
        and reviewed_by_admin_id is null
        and reviewed_at is null
      )
      or
      (
        application_status in ('approved', 'rejected', 'blocked')
        and reviewed_by_admin_id is not null
        and reviewed_at is not null
      )
    )
);

create table partners (
  id bigserial primary key,
  user_id bigint not null,
  partner_status partner_status not null default 'active',
  approved_by_admin_id bigint,
  approved_at timestamptz not null default now(),
  blocked_at timestamptz,
  block_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_partners_user_id unique (user_id),
  constraint fk_partners_user
    foreign key (user_id) references users(id) on delete restrict,

  constraint chk_partners_block_reason_not_blank
    check (block_reason is null or length(btrim(block_reason)) > 0),

  constraint chk_partners_approved_by_admin_required
    check (approved_by_admin_id is not null),

  constraint chk_partners_block_state_consistency
    check (
      (
        partner_status = 'blocked'
        and blocked_at is not null
        and block_reason is not null
      )
      or
      (
        partner_status in ('active', 'inactive')
        and blocked_at is null
        and block_reason is null
      )
    )
);

create table partner_codes (
  id bigserial primary key,
  partner_id bigint not null,
  referral_code text not null,
  is_active boolean not null default true,
  issued_by_admin_id bigint,
  issued_at timestamptz not null default now(),
  expired_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_partner_codes_referral_code unique (referral_code),
  constraint fk_partner_codes_partner
    foreign key (partner_id) references partners(id) on delete restrict,

  constraint chk_partner_codes_referral_code_not_blank
    check (length(btrim(referral_code)) > 0),

  constraint chk_partner_codes_expired_at_after_issued_at
    check (expired_at is null or expired_at >= issued_at)
);

create unique index uq_partner_applications_one_pending_per_user
  on partner_applications (user_id)
  where application_status = 'pending';

- 03 product_tables
create table products (
  id bigserial primary key,
  slug text not null,
  product_name text not null,
  product_status product_status not null default 'draft',
  short_description text,
  hero_title text,
  hero_subtitle text,
  cta_text text,
  display_order integer,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_products_slug unique (slug),
  constraint chk_products_slug_not_blank
    check (length(btrim(slug)) > 0),
  constraint chk_products_name_not_blank
    check (length(btrim(product_name)) > 0),
  constraint chk_products_short_description_not_blank
    check (short_description is null or length(btrim(short_description)) > 0),
  constraint chk_products_hero_title_not_blank
    check (hero_title is null or length(btrim(hero_title)) > 0),
  constraint chk_products_hero_subtitle_not_blank
    check (hero_subtitle is null or length(btrim(hero_subtitle)) > 0),
  constraint chk_products_cta_text_not_blank
    check (cta_text is null or length(btrim(cta_text)) > 0),
  constraint chk_products_display_order_nonnegative
    check (display_order is null or display_order >= 0)
);

create table product_prices (
  id bigserial primary key,
  product_id bigint not null,
  currency text not null,
  price_amount numeric(12,2) not null,
  discount_amount numeric(12,2) not null default 0,
  final_price_amount numeric(12,2) not null,
  is_active boolean not null default true,
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint fk_product_prices_product
    foreign key (product_id) references products(id) on delete restrict,
  constraint chk_product_prices_currency_not_blank
    check (length(btrim(currency)) > 0),
  constraint chk_product_prices_price_amount_nonnegative
    check (price_amount >= 0),
  constraint chk_product_prices_discount_amount_nonnegative
    check (discount_amount >= 0),
  constraint chk_product_prices_final_price_amount_nonnegative
    check (final_price_amount >= 0),
  constraint chk_product_prices_final_lte_price
    check (final_price_amount <= price_amount),
  constraint chk_product_prices_final_matches_formula
    check (final_price_amount = price_amount - discount_amount),
  constraint chk_product_prices_effective_range
    check (effective_to is null or effective_to >= effective_from)
);

create table product_information (
  id bigserial primary key,
  product_id bigint not null,
  info_details text,
  usage_instructions text,
  safety_warnings text,
  certifications_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_product_information_product_id unique (product_id),
  constraint fk_product_information_product
    foreign key (product_id) references products(id) on delete restrict,
  constraint chk_product_information_info_details_not_blank
    check (info_details is null or length(btrim(info_details)) > 0),
  constraint chk_product_information_usage_instructions_not_blank
    check (usage_instructions is null or length(btrim(usage_instructions)) > 0),
  constraint chk_product_information_safety_warnings_not_blank
    check (safety_warnings is null or length(btrim(safety_warnings)) > 0),
  constraint chk_product_information_certifications_summary_not_blank
    check (certifications_summary is null or length(btrim(certifications_summary)) > 0)
);

create table product_media (
  id bigserial primary key,
  product_id bigint not null,
  media_type media_type not null,
  file_url text not null,
  file_alt text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint fk_product_media_product
    foreign key (product_id) references products(id) on delete restrict,
  constraint chk_product_media_file_url_not_blank
    check (length(btrim(file_url)) > 0),
  constraint chk_product_media_file_alt_not_blank
    check (file_alt is null or length(btrim(file_alt)) > 0),
  constraint chk_product_media_sort_order_nonnegative
    check (sort_order >= 0)
);

-- 04_order_tables FINAL

create table orders (
  id bigserial primary key,
  user_id bigint not null,
  partner_id bigint,
  referral_code text,
  order_number text not null,
  order_status order_status not null default 'pending',
  payment_status payment_status not null default 'pending',
  currency text not null,

  subtotal_amount numeric(12,2) not null,
  discount_amount numeric(12,2) not null default 0,
  final_amount numeric(12,2) not null,

  is_point_payment boolean not null default false,
  point_used_amount numeric(12,2) not null default 0,

  buyer_login_id_snapshot text not null,
  buyer_real_name_snapshot text,
  buyer_phone_snapshot text not null,
  buyer_email_snapshot text,

  receiver_name text not null,
  receiver_phone text not null,
  receiver_email text not null,
  zipcode text not null,
  address1 text not null,
  address2 text,

  ordered_at timestamptz not null default now(),
  paid_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  refunded_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_orders_order_number unique (order_number),

  constraint fk_orders_user
    foreign key (user_id) references users(id) on delete restrict,

  constraint fk_orders_partner
    foreign key (partner_id) references partners(id) on delete restrict,

  constraint chk_orders_order_number_not_blank
    check (length(btrim(order_number)) > 0),
  constraint chk_orders_currency_not_blank
    check (length(btrim(currency)) > 0),
  constraint chk_orders_referral_code_not_blank
    check (referral_code is null or length(btrim(referral_code)) > 0),

  constraint chk_orders_buyer_login_id_snapshot_not_blank
    check (length(btrim(buyer_login_id_snapshot)) > 0),
  constraint chk_orders_buyer_real_name_snapshot_not_blank
    check (buyer_real_name_snapshot is null or length(btrim(buyer_real_name_snapshot)) > 0),
  constraint chk_orders_buyer_phone_snapshot_not_blank
    check (length(btrim(buyer_phone_snapshot)) > 0),
  constraint chk_orders_buyer_email_snapshot_not_blank
    check (buyer_email_snapshot is null or length(btrim(buyer_email_snapshot)) > 0),

  constraint chk_orders_receiver_name_not_blank
    check (length(btrim(receiver_name)) > 0),
  constraint chk_orders_receiver_phone_not_blank
    check (length(btrim(receiver_phone)) > 0),
  constraint chk_orders_receiver_email_not_blank
    check (length(btrim(receiver_email)) > 0),
  constraint chk_orders_zipcode_not_blank
    check (length(btrim(zipcode)) > 0),
  constraint chk_orders_address1_not_blank
    check (length(btrim(address1)) > 0),
  constraint chk_orders_address2_not_blank
    check (address2 is null or length(btrim(address2)) > 0),

  constraint chk_orders_subtotal_amount_nonnegative
    check (subtotal_amount >= 0),
  constraint chk_orders_discount_amount_nonnegative
    check (discount_amount >= 0),
  constraint chk_orders_final_amount_nonnegative
    check (final_amount >= 0),
  constraint chk_orders_point_used_amount_nonnegative
    check (point_used_amount >= 0),
  constraint chk_orders_discount_lte_subtotal
    check (discount_amount <= subtotal_amount),
  constraint chk_orders_point_used_lte_discounted_subtotal
    check (point_used_amount <= (subtotal_amount - discount_amount)),
  constraint chk_orders_final_matches_formula
    check (final_amount = subtotal_amount - discount_amount - point_used_amount),

  constraint chk_orders_point_payment_rule
    check (
      (is_point_payment = false and point_used_amount = 0 and final_amount > 0)
      or
      (
        is_point_payment = true
        and point_used_amount > 0
        and point_used_amount = (subtotal_amount - discount_amount)
        and final_amount = 0
      )
    ),

  constraint chk_orders_status_timestamp_consistency
    check (
      (
        order_status = 'pending'
        and paid_at is null
        and completed_at is null
        and cancelled_at is null
        and refunded_at is null
      )
      or
      (
        order_status in ('paid', 'preparing', 'shipped')
        and paid_at is not null
        and completed_at is null
        and cancelled_at is null
        and refunded_at is null
      )
      or
      (
        order_status = 'completed'
        and paid_at is not null
        and completed_at is not null
        and cancelled_at is null
        and refunded_at is null
      )
      or
      (
        order_status = 'cancelled'
        and cancelled_at is not null
        and completed_at is null
        and refunded_at is null
      )
      or
      (
        order_status = 'refunded'
        and refunded_at is not null
      )
    ),

  constraint chk_orders_payment_status_timestamp_consistency
    check (
      (
        payment_status = 'pending'
        and paid_at is null
        and refunded_at is null
      )
      or
      (
        payment_status = 'success'
        and paid_at is not null
        and refunded_at is null
      )
      or
      (
        payment_status in ('failed', 'cancelled')
        and refunded_at is null
      )
      or
      (
        payment_status = 'refunded'
        and refunded_at is not null
      )
    )
);

create table order_items (
  id bigserial primary key,
  order_id bigint not null,
  product_id bigint not null,
  product_slug text not null,
  product_name_snapshot text not null,
  unit_price numeric(12,2) not null,
  quantity integer not null,
  line_total_amount numeric(12,2) not null,
  created_at timestamptz not null default now(),

  constraint fk_order_items_order
    foreign key (order_id) references orders(id) on delete restrict,
  constraint fk_order_items_product
    foreign key (product_id) references products(id) on delete restrict,

  constraint chk_order_items_product_slug_not_blank
    check (length(btrim(product_slug)) > 0),
  constraint chk_order_items_product_name_snapshot_not_blank
    check (length(btrim(product_name_snapshot)) > 0),
  constraint chk_order_items_unit_price_nonnegative
    check (unit_price >= 0),
  constraint chk_order_items_quantity_positive
    check (quantity > 0),
  constraint chk_order_items_line_total_amount_nonnegative
    check (line_total_amount >= 0),
  constraint chk_order_items_line_total_matches_formula
    check (line_total_amount = round(unit_price * quantity, 2))
);

create table payments (
  id bigserial primary key,
  order_id bigint not null,
  payment_method text not null,
  payment_provider text,
  transaction_id text,
  payment_status payment_status not null default 'pending',
  requested_amount numeric(12,2) not null,
  approved_amount numeric(12,2),
  failure_reason text,
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  cancelled_at timestamptz,
  refunded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_payments_id_order_id unique (id, order_id),
  constraint uq_payments_transaction_id unique (transaction_id),

  constraint fk_payments_order
    foreign key (order_id) references orders(id) on delete restrict,

  constraint chk_payments_payment_method_not_blank
    check (length(btrim(payment_method)) > 0),
  constraint chk_payments_payment_provider_not_blank
    check (payment_provider is null or length(btrim(payment_provider)) > 0),
  constraint chk_payments_failure_reason_not_blank
    check (failure_reason is null or length(btrim(failure_reason)) > 0),
  constraint chk_payments_requested_amount_nonnegative
    check (requested_amount >= 0),
  constraint chk_payments_approved_amount_nonnegative
    check (approved_amount is null or approved_amount >= 0),

  constraint chk_payments_status_timestamp_consistency
    check (
      (
        payment_status = 'pending'
        and approved_at is null
        and cancelled_at is null
        and refunded_at is null
      )
      or
      (
        payment_status = 'success'
        and approved_at is not null
        and cancelled_at is null
        and refunded_at is null
        and approved_amount is not null
      )
      or
      (
        payment_status = 'failed'
        and approved_at is null
        and refunded_at is null
      )
      or
      (
        payment_status = 'cancelled'
        and cancelled_at is not null
        and refunded_at is null
      )
      or
      (
        payment_status = 'refunded'
        and refunded_at is not null
        and approved_at is not null
      )
    )
);

create table refunds (
  id bigserial primary key,
  order_id bigint not null,
  payment_id bigint,
  refund_status refund_status not null default 'requested',
  refund_amount numeric(12,2) not null,
  refund_reason text not null,
  requested_by_user_id bigint not null,
  processed_by_admin_id bigint,
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  rejected_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint fk_refunds_order
    foreign key (order_id) references orders(id) on delete restrict,
  constraint fk_refunds_payment_order
    foreign key (payment_id, order_id) references payments(id, order_id) on delete restrict,
  constraint fk_refunds_requested_by_user
    foreign key (requested_by_user_id) references users(id) on delete restrict,

  constraint chk_refunds_refund_amount_positive
    check (refund_amount > 0),
  constraint chk_refunds_refund_reason_not_blank
    check (length(btrim(refund_reason)) > 0),

  constraint chk_refunds_status_timestamp_consistency
    check (
      (
        refund_status = 'requested'
        and approved_at is null
        and rejected_at is null
        and completed_at is null
      )
      or
      (
        refund_status = 'approved'
        and approved_at is not null
        and rejected_at is null
        and completed_at is null
      )
      or
      (
        refund_status = 'rejected'
        and approved_at is null
        and rejected_at is not null
        and completed_at is null
      )
      or
      (
        refund_status = 'completed'
        and approved_at is not null
        and rejected_at is null
        and completed_at is not null
      )
    )
);

create table payment_events (
  id bigserial primary key,
  payment_id bigint not null,
  event_type text not null,
  provider_event_id text,
  raw_payload jsonb not null,
  created_at timestamptz not null default now(),

  constraint fk_payment_events_payment
    foreign key (payment_id) references payments(id) on delete restrict,

  constraint chk_payment_events_event_type_not_blank
    check (length(btrim(event_type)) > 0),
  constraint chk_payment_events_provider_event_id_not_blank
    check (provider_event_id is null or length(btrim(provider_event_id)) > 0)
);

-- 05_partner_link_tables
create table customer_partner_links (
  id bigserial primary key,
  user_id bigint not null,
  partner_id bigint not null,
  partner_code_id bigint,
  referral_code_snapshot text not null,
  linked_at timestamptz not null default now(),
  first_order_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_customer_partner_links_user_id unique (user_id),

  constraint fk_customer_partner_links_user
    foreign key (user_id) references users(id) on delete restrict,

  constraint fk_customer_partner_links_partner
    foreign key (partner_id) references partners(id) on delete restrict,

  constraint chk_customer_partner_links_referral_code_not_blank
    check (length(btrim(referral_code_snapshot)) > 0),

  constraint chk_customer_partner_links_referral_code_lowercase
    check (referral_code_snapshot = lower(referral_code_snapshot)),

  constraint chk_customer_partner_links_referral_code_no_space
    check (referral_code_snapshot !~ '\s'),

  constraint chk_customer_partner_links_linked_at_valid
    check (linked_at <= now())
);

-- 06_settlement_tables 
create table settlements (
  id bigserial primary key,
  order_id bigint not null,
  partner_id bigint not null,
  user_id bigint not null,
  settlement_status settlement_status not null default 'pending',
  base_order_amount numeric(12,2) not null,
  settlement_rate numeric(7,4) not null default 0.1000,
  settlement_amount numeric(12,2) not null,
  settlement_available_at timestamptz not null,
  settlement_confirmed_at timestamptz,
  settlement_paid_at timestamptz,
  cancelled_at timestamptz,
  cancelled_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_settlements_order_id unique (order_id),
  constraint uq_settlements_id_partner_id unique (id, partner_id),

  constraint fk_settlements_order
    foreign key (order_id) references orders(id) on delete restrict,
  constraint fk_settlements_partner
    foreign key (partner_id) references partners(id) on delete restrict,
  constraint fk_settlements_user
    foreign key (user_id) references users(id) on delete restrict,

  constraint chk_settlements_base_order_amount_nonnegative
    check (base_order_amount >= 0),
  constraint chk_settlements_settlement_rate_range
    check (settlement_rate >= 0 and settlement_rate <= 1),
  constraint chk_settlements_settlement_amount_nonnegative
    check (settlement_amount >= 0),
  constraint chk_settlements_amount_formula
    check (settlement_amount = round(base_order_amount * settlement_rate, 2)),
  constraint chk_settlements_cancelled_reason_not_blank
    check (cancelled_reason is null or length(btrim(cancelled_reason)) > 0),
  constraint chk_settlements_confirmed_after_available
    check (settlement_confirmed_at is null or settlement_confirmed_at >= settlement_available_at),
  constraint chk_settlements_paid_after_confirmed
    check (
      settlement_paid_at is null
      or settlement_confirmed_at is null
      or settlement_paid_at >= settlement_confirmed_at
    ),
  constraint chk_settlements_cancelled_after_created
    check (cancelled_at is null or cancelled_at >= created_at)
);

create table partner_bank_accounts (
  id bigserial primary key,
  partner_id bigint not null,
  bank_name text not null,
  account_number text not null,
  account_holder text not null,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_partner_bank_accounts_partner_id unique (partner_id),
  constraint uq_partner_bank_accounts_id_partner_id unique (id, partner_id),

  constraint fk_partner_bank_accounts_partner
    foreign key (partner_id) references partners(id) on delete restrict,

  constraint chk_partner_bank_accounts_bank_name_not_blank
    check (length(btrim(bank_name)) > 0),
  constraint chk_partner_bank_accounts_account_number_not_blank
    check (length(btrim(account_number)) > 0),
  constraint chk_partner_bank_accounts_account_holder_not_blank
    check (length(btrim(account_holder)) > 0)
);

create table partner_settlement_requests (
  id bigserial primary key,
  partner_id bigint not null,
  bank_account_id bigint not null,
  request_amount numeric(12,2) not null,
  request_status request_status not null default 'pending',
  request_note text,
  payment_memo text,
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  rejected_at timestamptz,
  paid_at timestamptz,
  processed_by_admin_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_partner_settlement_requests_id_partner_id unique (id, partner_id),

  constraint fk_partner_settlement_requests_partner
    foreign key (partner_id) references partners(id) on delete restrict,
  constraint fk_partner_settlement_requests_bank_account_partner
    foreign key (bank_account_id, partner_id)
    references partner_bank_accounts(id, partner_id) on delete restrict,

  constraint chk_partner_settlement_requests_request_amount_positive
    check (request_amount > 0),
  constraint chk_partner_settlement_requests_request_note_not_blank
    check (request_note is null or length(btrim(request_note)) > 0),
  constraint chk_partner_settlement_requests_payment_memo_not_blank
    check (payment_memo is null or length(btrim(payment_memo)) > 0),
  constraint chk_partner_settlement_requests_approved_after_requested
    check (approved_at is null or approved_at >= requested_at),
  constraint chk_partner_settlement_requests_rejected_after_requested
    check (rejected_at is null or rejected_at >= requested_at),
  constraint chk_partner_settlement_requests_paid_after_requested
    check (paid_at is null or paid_at >= requested_at)
);

create table partner_settlement_request_items (
  id bigserial primary key,
  request_id bigint not null,
  settlement_id bigint not null,
  amount_snapshot numeric(12,2) not null,
  created_at timestamptz not null default now(),

  constraint uq_partner_settlement_request_items_settlement_id unique (settlement_id),

  constraint fk_partner_settlement_request_items_request
    foreign key (request_id) references partner_settlement_requests(id) on delete restrict,
  constraint fk_partner_settlement_request_items_settlement
    foreign key (settlement_id) references settlements(id) on delete restrict,

  constraint chk_partner_settlement_request_items_amount_snapshot_nonnegative
    check (amount_snapshot >= 0)
);

create table partner_points (
  id bigserial primary key,
  partner_id bigint not null,
  current_balance numeric(12,2) not null default 0,
  total_earned numeric(12,2) not null default 0,
  total_used numeric(12,2) not null default 0,
  total_withdrawn numeric(12,2) not null default 0,
  updated_at timestamptz not null default now(),

  constraint uq_partner_points_partner_id unique (partner_id),

  constraint fk_partner_points_partner
    foreign key (partner_id) references partners(id) on delete restrict,

  constraint chk_partner_points_current_balance_nonnegative
    check (current_balance >= 0),
  constraint chk_partner_points_total_earned_nonnegative
    check (total_earned >= 0),
  constraint chk_partner_points_total_used_nonnegative
    check (total_used >= 0),
  constraint chk_partner_points_total_withdrawn_nonnegative
    check (total_withdrawn >= 0)
);

create table partner_point_logs (
  id bigserial primary key,
  partner_id bigint not null,
  change_amount numeric(12,2) not null,
  balance_after numeric(12,2) not null,
  change_type change_type not null,
  reference_id bigint,
  created_at timestamptz not null default now(),

  constraint fk_partner_point_logs_partner
    foreign key (partner_id) references partners(id) on delete restrict,

  constraint chk_partner_point_logs_balance_after_nonnegative
    check (balance_after >= 0)
);

-- 07 board tables 
create table reviews (
  id bigserial primary key,
  product_id bigint not null,
  user_id bigint not null,
  order_id bigint not null,
  rating integer,
  content text not null,
  is_private boolean not null default false,
  review_status review_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint fk_reviews_product
    foreign key (product_id) references products(id) on delete restrict,
  constraint fk_reviews_user
    foreign key (user_id) references users(id) on delete restrict,
  constraint fk_reviews_order
    foreign key (order_id) references orders(id) on delete restrict,

  constraint chk_reviews_rating_range
    check (rating is null or rating between 1 and 5),
  constraint chk_reviews_content_not_blank
    check (length(btrim(content)) > 0),
  constraint chk_reviews_content_trimmed
    check (content = btrim(content))
);

create table inquiries (
  id bigserial primary key,
  product_id bigint not null,
  user_id bigint not null,
  title text not null,
  content text not null,
  is_private boolean not null default false,
  inquiry_status inquiry_status not null default 'active',
  answer_content text,
  answered_by_admin_id bigint,
  answered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint fk_inquiries_product
    foreign key (product_id) references products(id) on delete restrict,
  constraint fk_inquiries_user
    foreign key (user_id) references users(id) on delete restrict,

  constraint chk_inquiries_title_not_blank
    check (length(btrim(title)) > 0),
  constraint chk_inquiries_content_not_blank
    check (length(btrim(content)) > 0),
  constraint chk_inquiries_title_trimmed
    check (title = btrim(title)),
  constraint chk_inquiries_content_trimmed
    check (content = btrim(content)),

  constraint chk_inquiries_answer_content_not_blank
    check (answer_content is null or length(btrim(answer_content)) > 0),

  constraint chk_inquiries_answer_status_consistency
    check (
      (inquiry_status = 'answered' and answer_content is not null and answered_at is not null)
      or
      (inquiry_status <> 'answered')
    ),

  constraint chk_inquiries_answered_at_after_created
    check (answered_at is null or answered_at >= created_at)
);
);

-- 08 ops_tables
create table audit_logs (
  id bigserial primary key,
  actor_type text not null,
  actor_admin_id bigint,
  actor_user_id bigint,
  target_table text not null,
  target_id bigint not null,
  action_type text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now(),

  constraint chk_audit_logs_actor_type_valid
    check (actor_type in ('system', 'admin', 'user')),
  constraint chk_audit_logs_target_table_not_blank
    check (length(btrim(target_table)) > 0),
  constraint chk_audit_logs_target_table_trimmed
    check (target_table = btrim(target_table)),
  constraint chk_audit_logs_action_type_not_blank
    check (length(btrim(action_type)) > 0),
  constraint chk_audit_logs_action_type_trimmed
    check (action_type = btrim(action_type)),
  constraint chk_audit_logs_target_id_positive
    check (target_id > 0),
  constraint chk_audit_logs_actor_consistency
    check (
      (actor_type = 'system' and actor_admin_id is null and actor_user_id is null)
      or
      (actor_type = 'admin' and actor_admin_id is not null and actor_user_id is null)
      or
      (actor_type = 'user' and actor_admin_id is null and actor_user_id is not null)
    )
);

create table page_metrics (
  id bigserial primary key,
  metric_date date not null,
  page_path text not null,
  visit_count bigint not null default 0,
  created_at timestamptz not null default now(),

  constraint uq_page_metrics_metric_date_page_path
    unique (metric_date, page_path),
  constraint chk_page_metrics_page_path_not_blank
    check (length(btrim(page_path)) > 0),
  constraint chk_page_metrics_page_path_trimmed
    check (page_path = btrim(page_path)),
  constraint chk_page_metrics_visit_count_nonnegative
    check (visit_count >= 0)
);

create table signup_metrics (
  id bigserial primary key,
  metric_date date not null,
  signup_count bigint not null default 0,
  created_at timestamptz not null default now(),

  constraint uq_signup_metrics_metric_date
    unique (metric_date),
  constraint chk_signup_metrics_signup_count_nonnegative
    check (signup_count >= 0)
);

create table sales_metrics (
  id bigserial primary key,
  metric_date date not null,
  order_count bigint not null default 0,
  gross_sales_amount numeric(12,2) not null default 0,
  net_sales_amount numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),

  constraint uq_sales_metrics_metric_date
    unique (metric_date),
  constraint chk_sales_metrics_order_count_nonnegative
    check (order_count >= 0),
  constraint chk_sales_metrics_gross_sales_amount_nonnegative
    check (gross_sales_amount >= 0),
  constraint chk_sales_metrics_net_sales_amount_nonnegative
    check (net_sales_amount >= 0),
  constraint chk_sales_metrics_net_lte_gross
    check (net_sales_amount <= gross_sales_amount)
);

-- 09_post_alter_fks
-- 생성 순서상 후행 부착이 필요한 FK만 처리한다.
-- admin 참조 / partner_code 참조 / first_order 참조 / audit actor 참조 전용 블록

alter table customer_partner_links
  add constraint fk_customer_partner_links_partner_code
  foreign key (partner_code_id)
  references partner_codes(id)
  on delete restrict;

alter table customer_partner_links
  add constraint fk_customer_partner_links_first_order
  foreign key (first_order_id)
  references orders(id)
  on delete restrict;

alter table partner_applications
  add constraint fk_partner_applications_reviewed_by_admin
  foreign key (reviewed_by_admin_id)
  references admins(id)
  on delete restrict;

alter table partners
  add constraint fk_partners_approved_by_admin
  foreign key (approved_by_admin_id)
  references admins(id)
  on delete restrict;

alter table partner_codes
  add constraint fk_partner_codes_issued_by_admin
  foreign key (issued_by_admin_id)
  references admins(id)
  on delete restrict;

alter table refunds
  add constraint fk_refunds_processed_by_admin
  foreign key (processed_by_admin_id)
  references admins(id)
  on delete restrict;

alter table partner_settlement_requests
  add constraint fk_partner_settlement_requests_processed_by_admin
  foreign key (processed_by_admin_id)
  references admins(id)
  on delete restrict;

alter table inquiries
  add constraint fk_inquiries_answered_by_admin
  foreign key (answered_by_admin_id)
  references admins(id)
  on delete restrict;

alter table audit_logs
  add constraint fk_audit_logs_actor_admin
  foreign key (actor_admin_id)
  references admins(id)
  on delete restrict;

alter table audit_logs
  add constraint fk_audit_logs_actor_user
  foreign key (actor_user_id)
  references users(id)
  on delete restrict;

-- 10_domain_integrity_rules FINAL

create or replace function validate_customer_partner_link_integrity()
returns trigger
language plpgsql
as $$
declare
  v_code_partner_id bigint;
  v_order_user_id bigint;
  v_order_partner_id bigint;
begin
  if new.partner_code_id is not null then
    select pc.partner_id
      into v_code_partner_id
    from partner_codes pc
    where pc.id = new.partner_code_id;

    if v_code_partner_id is null then
      raise exception 'partner_code_id % does not exist', new.partner_code_id;
    end if;

    if v_code_partner_id <> new.partner_id then
      raise exception 'partner_code_id % does not belong to partner_id %', new.partner_code_id, new.partner_id;
    end if;
  end if;

  if new.first_order_id is not null then
    select o.user_id, o.partner_id
      into v_order_user_id, v_order_partner_id
    from orders o
    where o.id = new.first_order_id;

    if v_order_user_id is null then
      raise exception 'first_order_id % does not exist', new.first_order_id;
    end if;

    if v_order_user_id <> new.user_id then
      raise exception 'first_order_id % does not belong to user_id %', new.first_order_id, new.user_id;
    end if;

    if v_order_partner_id is distinct from new.partner_id then
      raise exception 'first_order_id % partner_id mismatch', new.first_order_id;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_customer_partner_links_integrity on customer_partner_links;
create trigger trg_customer_partner_links_integrity
before insert or update on customer_partner_links
for each row
execute function validate_customer_partner_link_integrity();


create or replace function validate_review_purchase_integrity()
returns trigger
language plpgsql
as $$
declare
  v_order_user_id bigint;
  v_exists boolean;
  v_refund_exists boolean;
begin
  select o.user_id
    into v_order_user_id
  from orders o
  where o.id = new.order_id;

  if v_order_user_id is null then
    raise exception 'order_id % does not exist', new.order_id;
  end if;

  if v_order_user_id <> new.user_id then
    raise exception 'review user mismatch';
  end if;

  select exists (
    select 1
    from order_items oi
    where oi.order_id = new.order_id
      and oi.product_id = new.product_id
  ) into v_exists;

  if not v_exists then
    raise exception 'order does not contain product';
  end if;

  -- 핵심: refund approved + completed 모두 금지
  select exists (
    select 1
    from refunds r
    where r.order_id = new.order_id
      and r.refund_status in ('approved','completed')
  ) into v_refund_exists;

  if v_refund_exists then
    raise exception 'review not allowed for refunded order';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_reviews_purchase_integrity on reviews;
create trigger trg_reviews_purchase_integrity
before insert or update on reviews
for each row
execute function validate_review_purchase_integrity();


create or replace function validate_settlement_request_item_integrity()
returns trigger
language plpgsql
as $$
declare
  v_request_partner_id bigint;
  v_settlement_partner_id bigint;
  v_settlement_amount numeric(12,2);
begin
  select r.partner_id into v_request_partner_id
  from partner_settlement_requests r
  where r.id = new.request_id;

  if v_request_partner_id is null then
    raise exception 'invalid request_id';
  end if;

  select s.partner_id, s.settlement_amount
    into v_settlement_partner_id, v_settlement_amount
  from settlements s
  where s.id = new.settlement_id;

  if v_settlement_partner_id is null then
    raise exception 'invalid settlement_id';
  end if;

  if v_request_partner_id <> v_settlement_partner_id then
    raise exception 'partner mismatch';
  end if;

  if new.amount_snapshot <> v_settlement_amount then
    raise exception 'amount mismatch';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_partner_settlement_request_items_integrity on partner_settlement_request_items;
create trigger trg_partner_settlement_request_items_integrity
before insert or update on partner_settlement_request_items
for each row
execute function validate_settlement_request_item_integrity();


-- 핵심: 빈 주문 금지 + subtotal 검증

create or replace function validate_order_subtotal_consistency(p_order_id bigint)
returns void
language plpgsql
as $$
declare
  v_subtotal numeric(12,2);
  v_items_total numeric(12,2);
  v_item_count bigint;
begin
  select o.subtotal_amount into v_subtotal
  from orders o where o.id = p_order_id;

  if not found then
    return;
  end if;

  select count(*), coalesce(sum(line_total_amount),0)
    into v_item_count, v_items_total
  from order_items
  where order_id = p_order_id;

  -- 핵심 정책: 빈 주문 금지
  if v_item_count = 0 then
    raise exception 'empty order not allowed: order_id %', p_order_id;
  end if;

  if v_subtotal <> v_items_total then
    raise exception 'subtotal mismatch: order_id %', p_order_id;
  end if;
end;
$$;

create or replace function trg_validate_order_items_subtotal()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform validate_order_subtotal_consistency(old.order_id);
    return old;
  else
    perform validate_order_subtotal_consistency(new.order_id);

    if tg_op = 'UPDATE'
       and old.order_id is distinct from new.order_id then
      perform validate_order_subtotal_consistency(old.order_id);
    end if;

    return new;
  end if;
end;
$$;

drop trigger if exists trg_order_items_subtotal on order_items;
create constraint trigger trg_order_items_subtotal
after insert or update or delete on order_items
deferrable initially deferred
for each row
execute function trg_validate_order_items_subtotal();

-- 11_indexes FINAL

create unique index uq_partner_codes_active_per_partner
  on partner_codes (partner_id)
  where is_active = true;

create unique index uq_product_prices_active_per_product
  on product_prices (product_id)
  where is_active = true;

create unique index uq_product_media_active_primary_per_product_type
  on product_media (product_id, media_type)
  where is_primary = true
    and is_active = true;

create index idx_products_status_visible_order
  on products (product_status, is_visible, display_order);

create index idx_product_prices_product_active
  on product_prices (product_id, is_active);

create index idx_product_media_product_type_active_sort
  on product_media (product_id, media_type, is_active, sort_order);

create index idx_orders_user_created_at_desc
  on orders (user_id, created_at desc);

create index idx_orders_partner_created_at_desc
  on orders (partner_id, created_at desc);

create index idx_orders_status_created_at_desc
  on orders (order_status, created_at desc);

create index idx_orders_payment_status_created_at_desc
  on orders (payment_status, created_at desc);

create index idx_orders_point_payment_created_at_desc
  on orders (is_point_payment, created_at desc);

create index idx_orders_buyer_login_id_snapshot
  on orders (buyer_login_id_snapshot);

create index idx_order_items_order_id
  on order_items (order_id);

create index idx_order_items_product_id
  on order_items (product_id);

create index idx_payments_order_status
  on payments (order_id, payment_status);

create index idx_payments_provider_status_created_at_desc
  on payments (payment_provider, payment_status, created_at desc);

create index idx_payments_requested_at_desc
  on payments (requested_at desc);

create unique index uq_payment_events_provider_event_id_not_null
  on payment_events (provider_event_id)
  where provider_event_id is not null;

create index idx_payment_events_payment_created_at_desc
  on payment_events (payment_id, created_at desc);

create index idx_payment_events_event_type_created_at_desc
  on payment_events (event_type, created_at desc);

create index idx_refunds_order_status
  on refunds (order_id, refund_status);

create index idx_refunds_requested_by_user_created_at_desc
  on refunds (requested_by_user_id, created_at desc);

create index idx_refunds_processed_by_admin_created_at_desc
  on refunds (processed_by_admin_id, created_at desc);

create index idx_partners_status_approved_at_desc
  on partners (partner_status, approved_at desc);

create index idx_partner_codes_partner_active
  on partner_codes (partner_id, is_active);

create index idx_customer_partner_links_partner_linked_at_desc
  on customer_partner_links (partner_id, linked_at desc);

create index idx_customer_partner_links_first_order_id
  on customer_partner_links (first_order_id);

create index idx_settlements_partner_status_available_at
  on settlements (partner_id, settlement_status, settlement_available_at);

create index idx_settlements_status_available_at
  on settlements (settlement_status, settlement_available_at);

create index idx_partner_settlement_requests_partner_status_requested_at
  on partner_settlement_requests (partner_id, request_status, requested_at);

create index idx_partner_settlement_requests_bank_account_id
  on partner_settlement_requests (bank_account_id);

create index idx_partner_settlement_request_items_request_id
  on partner_settlement_request_items (request_id);

create index idx_partner_point_logs_partner_created_at_desc
  on partner_point_logs (partner_id, created_at desc);

create index idx_partner_point_logs_change_type_created_at_desc
  on partner_point_logs (change_type, created_at desc);

create index idx_reviews_product_status_created_at_desc
  on reviews (product_id, review_status, created_at desc);

create index idx_reviews_user_created_at_desc
  on reviews (user_id, created_at desc);

create index idx_reviews_order_id
  on reviews (order_id);

create index idx_reviews_private_status_created_at_desc
  on reviews (is_private, review_status, created_at desc);

create index idx_inquiries_product_status_created_at_desc
  on inquiries (product_id, inquiry_status, created_at desc);

create index idx_inquiries_user_created_at_desc
  on inquiries (user_id, created_at desc);

create index idx_inquiries_answered_by_admin_answered_at_desc
  on inquiries (answered_by_admin_id, answered_at desc);

create index idx_inquiries_private_status_created_at_desc
  on inquiries (is_private, inquiry_status, created_at desc);

-- 12_rls_enable
-- 원칙:
-- 1) 일반 사용자 본인 데이터 조회/작성 테이블 = RLS 기본
-- 2) 관리자 운영/감사/집계 테이블 = RLS enable 후 admin only 정책
-- 3) 결제/정산/승인/이벤트 적재 같은 핵심 상태변경 테이블 = RLS enable 후 service role only 정책

-- user-facing identity / profile / partner relation
alter table users enable row level security;
alter table user_profiles enable row level security;
alter table partner_applications enable row level security;
alter table partners enable row level security;
alter table partner_codes enable row level security;
alter table customer_partner_links enable row level security;

-- public product catalog (공개 조회는 정책에서 허용)
alter table products enable row level security;
alter table product_prices enable row level security;
alter table product_information enable row level security;
alter table product_media enable row level security;

-- user-facing order domain (본인 범위 정책)
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;
alter table refunds enable row level security;

-- service-role-only payment/event processing
alter table payment_events enable row level security;

-- partner / settlement / point domain
alter table settlements enable row level security;
alter table partner_bank_accounts enable row level security;
alter table partner_settlement_requests enable row level security;
alter table partner_settlement_request_items enable row level security;
alter table partner_points enable row level security;
alter table partner_point_logs enable row level security;

-- board domain
alter table reviews enable row level security;
alter table inquiries enable row level security;

-- admin / ops only
alter table admins enable row level security;
alter table audit_logs enable row level security;
alter table page_metrics enable row level security;
alter table signup_metrics enable row level security;
alter table sales_metrics enable row level security;

-- 13_policies FINAL

create or replace function current_user_pk()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select u.id
  from users u
  where u.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function current_partner_pk()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select p.id
  from partners p
  join users u on u.id = p.user_id
  where u.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from admins a
    join users u on u.id = a.user_id
    where u.auth_user_id = auth.uid()
      and a.admin_status = 'active'
  );
$$;

create policy users_select_own
on users
for select
using (id = current_user_pk());

create policy users_select_admin
on users
for select
using (is_admin());

create policy user_profiles_select_own
on user_profiles
for select
using (user_id = current_user_pk());

create policy user_profiles_select_admin
on user_profiles
for select
using (is_admin());

create policy user_profiles_update_own
on user_profiles
for update
using (user_id = current_user_pk())
with check (user_id = current_user_pk());

create policy admins_select_admin_only
on admins
for select
using (is_admin());

create policy partner_applications_select_own_or_admin
on partner_applications
for select
using (
  user_id = current_user_pk()
  or is_admin()
);

create policy partner_applications_insert_own
on partner_applications
for insert
with check (user_id = current_user_pk());

create policy partners_select_self_or_admin
on partners
for select
using (
  user_id = current_user_pk()
  or is_admin()
);

create policy partner_codes_select_self_or_admin
on partner_codes
for select
using (
  partner_id = current_partner_pk()
  or is_admin()
);

create policy customer_partner_links_select_own
on customer_partner_links
for select
using (user_id = current_user_pk());

create policy customer_partner_links_select_admin
on customer_partner_links
for select
using (is_admin());

create policy products_select_public
on products
for select
using (
  is_visible = true
  and product_status in ('active', 'sold_out')
);

create policy product_prices_select_public
on product_prices
for select
using (
  is_active = true
  and exists (
    select 1
    from products p
    where p.id = product_prices.product_id
      and p.is_visible = true
      and p.product_status in ('active', 'sold_out')
  )
);

create policy product_information_select_public
on product_information
for select
using (
  exists (
    select 1
    from products p
    where p.id = product_information.product_id
      and p.is_visible = true
      and p.product_status in ('active', 'sold_out')
  )
);

create policy product_media_select_public
on product_media
for select
using (
  is_active = true
  and exists (
    select 1
    from products p
    where p.id = product_media.product_id
      and p.is_visible = true
      and p.product_status in ('active', 'sold_out')
  )
);

create policy orders_select_own
on orders
for select
using (user_id = current_user_pk());

create policy orders_select_admin
on orders
for select
using (is_admin());

create policy order_items_select_own
on order_items
for select
using (
  exists (
    select 1
    from orders o
    where o.id = order_items.order_id
      and o.user_id = current_user_pk()
  )
);

create policy order_items_select_admin
on order_items
for select
using (is_admin());

create policy payments_select_own
on payments
for select
using (
  exists (
    select 1
    from orders o
    where o.id = payments.order_id
      and o.user_id = current_user_pk()
  )
);

create policy payments_select_admin
on payments
for select
using (is_admin());

create policy refunds_select_own
on refunds
for select
using (
  exists (
    select 1
    from orders o
    where o.id = refunds.order_id
      and o.user_id = current_user_pk()
  )
);

create policy refunds_select_admin
on refunds
for select
using (is_admin());

create policy reviews_select_policy
on reviews
for select
using (
  (
    review_status = 'active'
    and is_private = false
  )
  or user_id = current_user_pk()
  or is_admin()
);

create policy reviews_insert_own
on reviews
for insert
with check (
  user_id = current_user_pk()
  and exists (
    select 1
    from orders o
    join order_items oi on oi.order_id = o.id
    where o.id = reviews.order_id
      and o.user_id = current_user_pk()
      and oi.product_id = reviews.product_id
      and o.order_status in ('paid', 'preparing', 'shipped', 'completed')
  )
  and not exists (
    select 1
    from refunds r
    where r.order_id = reviews.order_id
      and r.refund_status in ('approved', 'completed')
  )
);

create policy reviews_update_own_or_admin
on reviews
for update
using (
  user_id = current_user_pk()
  or is_admin()
)
with check (
  user_id = current_user_pk()
  or is_admin()
);

create policy inquiries_select_policy
on inquiries
for select
using (
  user_id = current_user_pk()
  or is_admin()
);

create policy inquiries_insert_own
on inquiries
for insert
with check (user_id = current_user_pk());

create policy inquiries_update_own_or_admin
on inquiries
for update
using (
  user_id = current_user_pk()
  or is_admin()
)
with check (
  user_id = current_user_pk()
  or is_admin()
);

create policy settlements_select_partner_or_admin
on settlements
for select
using (
  partner_id = current_partner_pk()
  or is_admin()
);

create policy partner_bank_accounts_select_partner_or_admin
on partner_bank_accounts
for select
using (
  partner_id = current_partner_pk()
  or is_admin()
);

create policy partner_bank_accounts_insert_partner
on partner_bank_accounts
for insert
with check (
  partner_id = current_partner_pk()
);

create policy partner_bank_accounts_update_partner_or_admin
on partner_bank_accounts
for update
using (
  partner_id = current_partner_pk()
  or is_admin()
)
with check (
  partner_id = current_partner_pk()
  or is_admin()
);

create policy partner_settlement_requests_select_partner_or_admin
on partner_settlement_requests
for select
using (
  partner_id = current_partner_pk()
  or is_admin()
);

create policy partner_settlement_requests_insert_partner
on partner_settlement_requests
for insert
with check (
  partner_id = current_partner_pk()
  and exists (
    select 1
    from partners p
    where p.id = current_partner_pk()
      and p.partner_status = 'active'
  )
);

create policy partner_settlement_request_items_select_partner_or_admin
on partner_settlement_request_items
for select
using (
  exists (
    select 1
    from partner_settlement_requests psr
    where psr.id = partner_settlement_request_items.request_id
      and psr.partner_id = current_partner_pk()
  )
  or is_admin()
);

create policy partner_points_select_partner_or_admin
on partner_points
for select
using (
  partner_id = current_partner_pk()
  or is_admin()
);

create policy partner_point_logs_select_partner_or_admin
on partner_point_logs
for select
using (
  partner_id = current_partner_pk()
  or is_admin()
);

create policy audit_logs_select_admin_only
on audit_logs
for select
using (is_admin());

create policy page_metrics_select_admin_only
on page_metrics
for select
using (is_admin());

create policy signup_metrics_select_admin_only
on signup_metrics
for select
using (is_admin());

create policy sales_metrics_select_admin_only
on sales_metrics
for select
using (is_admin());

-- 14_domain_integrity FINAL

-- 1) orders ↔ payments 무결성

create or replace function validate_orders_payments_integrity()
returns trigger
language plpgsql
as $$
declare
  v_exists boolean;
begin
  if new.order_status in ('paid','preparing','shipped','completed') then
    select exists (
      select 1 from payments p
      where p.order_id = new.id
        and p.payment_status = 'success'
    ) into v_exists;

    if not v_exists then
      raise exception 'order requires success payment';
    end if;
  end if;

  if new.order_status = 'refunded' then
    select exists (
      select 1 from payments p
      where p.order_id = new.id
        and p.payment_status = 'refunded'
    ) into v_exists;

    if not v_exists then
      raise exception 'refunded order requires refunded payment';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_orders_payments_integrity on orders;
create trigger trg_validate_orders_payments_integrity
before update on orders
for each row
execute function validate_orders_payments_integrity();


-- 2) orders ↔ refunds 무결성

create or replace function validate_orders_refunds_integrity()
returns trigger
language plpgsql
as $$
declare
  v_completed boolean;
  v_conflict boolean;
begin
  if new.order_status = 'refunded' then
    select exists (
      select 1 from refunds r
      where r.order_id = new.id
        and r.refund_status = 'completed'
    ) into v_completed;

    if not v_completed then
      raise exception 'refunded order requires completed refund';
    end if;
  end if;

  select exists (
    select 1 from refunds r
    where r.order_id = new.id
      and r.refund_status in ('requested','approved')
  ) into v_conflict;

  if v_completed and v_conflict then
    raise exception 'completed refund cannot coexist with requested/approved';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_orders_refunds_integrity on orders;
create trigger trg_validate_orders_refunds_integrity
before update on orders
for each row
execute function validate_orders_refunds_integrity();


-- 3) 물리삭제 금지 (공통 함수)

create or replace function prevent_physical_delete()
returns trigger
language plpgsql
as $$
begin
  raise exception 'physical delete is not allowed on table %', tg_table_name;
end;
$$;


-- 4) 삭제 금지 트리거 (SSOT 전체 대상)

drop trigger if exists trg_customer_partner_links_no_delete on customer_partner_links;
create trigger trg_customer_partner_links_no_delete before delete on customer_partner_links for each row execute function prevent_physical_delete();

drop trigger if exists trg_reviews_no_delete on reviews;
create trigger trg_reviews_no_delete before delete on reviews for each row execute function prevent_physical_delete();

drop trigger if exists trg_inquiries_no_delete on inquiries;
create trigger trg_inquiries_no_delete before delete on inquiries for each row execute function prevent_physical_delete();

drop trigger if exists trg_orders_no_delete on orders;
create trigger trg_orders_no_delete before delete on orders for each row execute function prevent_physical_delete();

drop trigger if exists trg_order_items_no_delete on order_items;
create trigger trg_order_items_no_delete before delete on order_items for each row execute function prevent_physical_delete();

drop trigger if exists trg_payments_no_delete on payments;
create trigger trg_payments_no_delete before delete on payments for each row execute function prevent_physical_delete();

drop trigger if exists trg_refunds_no_delete on refunds;
create trigger trg_refunds_no_delete before delete on refunds for each row execute function prevent_physical_delete();

drop trigger if exists trg_payment_events_no_delete on payment_events;
create trigger trg_payment_events_no_delete before delete on payment_events for each row execute function prevent_physical_delete();

drop trigger if exists trg_settlements_no_delete on settlements;
create trigger trg_settlements_no_delete before delete on settlements for each row execute function prevent_physical_delete();

drop trigger if exists trg_partner_bank_accounts_no_delete on partner_bank_accounts;
create trigger trg_partner_bank_accounts_no_delete before delete on partner_bank_accounts for each row execute function prevent_physical_delete();

drop trigger if exists trg_partner_settlement_requests_no_delete on partner_settlement_requests;
create trigger trg_partner_settlement_requests_no_delete before delete on partner_settlement_requests for each row execute function prevent_physical_delete();

drop trigger if exists trg_partner_settlement_request_items_no_delete on partner_settlement_request_items;
create trigger trg_partner_settlement_request_items_no_delete before delete on partner_settlement_request_items for each row execute function prevent_physical_delete();

drop trigger if exists trg_partner_points_no_delete on partner_points;
create trigger trg_partner_points_no_delete before delete on partner_points for each row execute function prevent_physical_delete();

drop trigger if exists trg_partner_point_logs_no_delete on partner_point_logs;
create trigger trg_partner_point_logs_no_delete before delete on partner_point_logs for each row execute function prevent_physical_delete();

drop trigger if exists trg_audit_logs_no_delete on audit_logs;
create trigger trg_audit_logs_no_delete before delete on audit_logs for each row execute function prevent_physical_delete();