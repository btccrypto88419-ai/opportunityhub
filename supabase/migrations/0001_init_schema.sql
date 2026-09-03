-- =============================================================================
-- OpportunityHub — Initial schema
-- =============================================================================
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh
-- project. It creates all core tables, enables Row Level Security (RLS) on
-- every table, and defines policies so that:
--   * Anyone (including anonymous visitors) can read PUBLISHED opportunities.
--   * Users can only read/write their OWN saved opportunities, applications,
--     CVs, payments, notifications and profile.
--   * Only users whose profile has role = 'admin' can manage all data.
--
-- IMPORTANT: this file contains NO secrets. Never paste real API keys,
-- passwords or service-role keys into SQL files or commits.
-- =============================================================================

-- Required for gen_random_uuid()
create extension if not exists "pgcrypto";

-- =============================================================================
-- 1. PROFILES
-- =============================================================================
-- One row per authenticated user, created automatically on sign-up via trigger.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  location text,
  education text,
  skills text[] default '{}',
  role text not null default 'user' check (role in ('user', 'admin')),
  referral_code text unique,
  referred_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- SECURITY DEFINER helper used by every "admin can manage everything" policy
-- below. This MUST be security definer + a plain function call (not an
-- inline "exists (select ... from public.profiles ...)" subquery written
-- directly inside a policy on the profiles table itself) — otherwise
-- Postgres re-evaluates the profiles RLS policies while checking the
-- subquery's own access to profiles, which recurses back into this same
-- policy and fails with "infinite recursion detected in policy for relation
-- profiles". Wrapping it in a SECURITY DEFINER function makes the internal
-- lookup run with the function owner's privileges (bypassing RLS for this
-- one narrowly-scoped check only), breaking the recursion.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Profiles are viewable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Generates a short, human-friendly referral code, e.g. "OH-7F3K9A".
create or replace function public.generate_referral_code()
returns text
language plpgsql
as $$
declare
  new_code text;
  exists_already boolean;
begin
  loop
    new_code := 'OH-' || upper(substr(md5(random()::text), 1, 6));
    select exists(select 1 from public.profiles where referral_code = new_code) into exists_already;
    exit when not exists_already;
  end loop;
  return new_code;
end;
$$;

-- Automatically create a profile row (with a referral code, and a resolved
-- `referred_by` link) whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  used_code text;
  referrer uuid;
begin
  used_code := new.raw_user_meta_data ->> 'referral_code_used';
  referrer := null;
  if used_code is not null then
    select id into referrer from public.profiles where referral_code = used_code;
  end if;

  insert into public.profiles (id, full_name, referral_code, referred_by)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    public.generate_referral_code(),
    referrer
  );

  -- Prevent self-referral at the data level (defence in depth).
  if referrer = new.id then
    update public.profiles set referred_by = null where id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================================================
-- 2. OPPORTUNITIES
-- =============================================================================

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  category text not null,
  location text,
  mode text check (mode in ('remote', 'hybrid', 'onsite')),
  description text not null,
  requirements text,
  benefits text,
  deadline date,
  application_url text,
  logo_url text,
  is_fully_funded boolean not null default false,
  is_verified boolean not null default false,
  is_featured boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  submitted_by uuid references public.profiles (id),
  contact_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_opportunities_category on public.opportunities (category);
create index if not exists idx_opportunities_status on public.opportunities (status);
create index if not exists idx_opportunities_deadline on public.opportunities (deadline);
create index if not exists idx_opportunities_featured on public.opportunities (is_featured);

alter table public.opportunities enable row level security;

create policy "Published opportunities are public"
  on public.opportunities for select
  using (status = 'published');

create policy "Submitters can view their own pending submissions"
  on public.opportunities for select
  using (auth.uid() = submitted_by);

create policy "Authenticated users can submit opportunities as pending"
  on public.opportunities for insert
  with check (
    status = 'pending'
    and is_featured = false
    and is_verified = false
  );

create policy "Admins can do everything on opportunities"
  on public.opportunities for all
  using (public.is_admin())
  with check (public.is_admin());

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_opportunities_updated_at on public.opportunities;
create trigger trg_opportunities_updated_at
  before update on public.opportunities
  for each row execute procedure public.set_updated_at();

-- =============================================================================
-- 3. SAVED OPPORTUNITIES
-- =============================================================================

create table if not exists public.saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  opportunity_id uuid not null references public.opportunities (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
);

alter table public.saved_opportunities enable row level security;

create policy "Users manage their own saved opportunities"
  on public.saved_opportunities for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================================================
-- 4. APPLICATIONS (tracker)
-- =============================================================================

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  opportunity_id uuid references public.opportunities (id) on delete set null,
  status text not null default 'Saved'
    check (status in ('Saved', 'Applied', 'Under Review', 'Interview', 'Accepted', 'Rejected')),
  application_date date,
  deadline date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.applications enable row level security;

create policy "Users manage their own applications"
  on public.applications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists trg_applications_updated_at on public.applications;
create trigger trg_applications_updated_at
  before update on public.applications
  for each row execute procedure public.set_updated_at();

-- =============================================================================
-- 5. CVs
-- =============================================================================

create table if not exists public.cvs (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.cvs enable row level security;

create policy "Users manage their own CV"
  on public.cvs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================================================
-- 6. REPORTS
-- =============================================================================

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.opportunities (id) on delete cascade,
  reporter_id uuid references public.profiles (id),
  reason text not null,
  details text,
  status text not null default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "Anyone can submit a report"
  on public.reports for insert
  with check (true);

create policy "Reporters can view their own reports"
  on public.reports for select
  using (auth.uid() = reporter_id);

create policy "Admins can manage all reports"
  on public.reports for all
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- 7. REFERRALS
-- =============================================================================

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles (id) on delete cascade,
  referred_id uuid not null references public.profiles (id) on delete cascade unique,
  qualifying_transaction_id uuid,
  status text not null default 'pending' check (status in ('pending', 'qualified', 'rewarded', 'rejected')),
  reward_amount numeric(12, 2),
  created_at timestamptz not null default now(),
  rewarded_at timestamptz,
  check (referrer_id <> referred_id)
);

alter table public.referrals enable row level security;

create policy "Users can view referrals they made"
  on public.referrals for select
  using (auth.uid() = referrer_id);

create policy "Admins can manage all referrals"
  on public.referrals for all
  using (public.is_admin())
  with check (public.is_admin());

-- Automatically create a pending referral row once a referred user's profile
-- is created (see handle_new_user trigger above, which sets referred_by).
create or replace function public.handle_new_referral()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.referred_by is not null and new.referred_by <> new.id then
    insert into public.referrals (referrer_id, referred_id, status)
    values (new.referred_by, new.id, 'pending')
    on conflict (referred_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_referral on public.profiles;
create trigger on_profile_referral
  after insert on public.profiles
  for each row execute procedure public.handle_new_referral();

-- Returns a small summary object for a given user's referral activity.
create or replace function public.get_referral_summary(p_user_id uuid)
returns table (
  referral_code text,
  total_referred bigint,
  total_rewarded bigint,
  total_earned numeric
)
language sql
security definer set search_path = public
as $$
  select
    p.referral_code,
    count(r.id) filter (where r.id is not null) as total_referred,
    count(r.id) filter (where r.status = 'rewarded') as total_rewarded,
    coalesce(sum(r.reward_amount) filter (where r.status = 'rewarded'), 0) as total_earned
  from public.profiles p
  left join public.referrals r on r.referrer_id = p.id
  where p.id = p_user_id
  group by p.referral_code;
$$;

-- =============================================================================
-- 8. PAYMENTS (manual verification)
-- =============================================================================

create table if not exists public.payment_destinations (
  id uuid primary key default gen_random_uuid(),
  method text not null,
  network text,
  address text not null,
  label text,
  is_active boolean not null default true
);

alter table public.payment_destinations enable row level security;

create policy "Active payment destinations are public"
  on public.payment_destinations for select
  using (is_active = true);

create policy "Admins manage payment destinations"
  on public.payment_destinations for all
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  method text not null,
  network text,
  amount text not null,
  reference text not null,
  purpose text not null default 'other',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  -- A transaction reference should only be usable once, to prevent the same
  -- proof-of-payment being submitted multiple times for multiple rewards.
  unique (method, reference)
);

alter table public.payments enable row level security;

create policy "Users manage their own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Users can submit payments"
  on public.payments for insert
  with check (auth.uid() = user_id and status = 'pending');

create policy "Admins can manage all payments"
  on public.payments for all
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- 9. NOTIFICATIONS
-- =============================================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (
    type in (
      'payment_approved', 'payment_rejected', 'referral_reward',
      'application_reminder', 'new_opportunity', 'deadline_approaching', 'general'
    )
  ),
  title text not null,
  message text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users manage their own notifications"
  on public.notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================================================
-- 10. SITE SETTINGS (single row, admin-configurable)
-- =============================================================================

create table if not exists public.site_settings (
  id int primary key default 1,
  site_name text not null default 'OpportunityHub',
  referral_reward_usdt numeric(12, 2) not null default 2,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.site_settings enable row level security;

create policy "Site settings are publicly readable"
  on public.site_settings for select
  using (true);

create policy "Admins can update site settings"
  on public.site_settings for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can insert site settings"
  on public.site_settings for insert
  with check (public.is_admin());
