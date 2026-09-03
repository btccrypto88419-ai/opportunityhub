-- =============================================================================
-- OpportunityHub — Referral summary ownership fix
-- =============================================================================
-- Found while building the Referral History UI:
--
-- public.get_referral_summary(p_user_id uuid) is SECURITY DEFINER (so it can
-- read across the referrals table regardless of the caller's own RLS), but it
-- never checked that p_user_id actually belonged to the calling user. Any
-- authenticated user could call:
--     supabase.rpc('get_referral_summary', { p_user_id: '<someone-else-id>' })
-- directly from browser devtools and read another user's referral code and
-- total rewards earned — an IDOR (insecure direct object reference).
--
-- Fix: the function now ignores whatever id the caller sends unless the
-- caller is an admin, and always falls back to auth.uid() for ordinary
-- users. This tightens the existing function without changing its public
-- signature (so the existing frontend call site keeps working), and does
-- not touch any RLS policy from 0004_security_hardening.sql.
-- =============================================================================

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
  where p.id = case
    when public.is_admin() then p_user_id
    else auth.uid()
  end
  group by p.referral_code;
$$;

-- -----------------------------------------------------------------------------
-- Referral history, with the referred person's display name.
-- -----------------------------------------------------------------------------
-- The existing "Users can view referrals they made" policy on public.referrals
-- correctly lets a referrer read their own referral rows, but a referrer has
-- no RLS access to the referred person's row on public.profiles at all (that
-- table only exposes a row to its own owner or an admin) — so trying to
-- fetch referred:referred_id(full_name) via a normal PostgREST embed from the
-- client returns null for every row, not the name. Rather than loosen the
-- profiles SELECT policy (which would let any referrer browse referred
-- users' full profile data — a real privacy regression), this adds one
-- narrowly-scoped, ownership-checked function that returns only the single
-- display name field needed for the referral history list.
create or replace function public.get_referral_history(p_user_id uuid)
returns table (
  id uuid,
  status text,
  reward_amount numeric,
  created_at timestamptz,
  rewarded_at timestamptz,
  referred_full_name text
)
language sql
security definer set search_path = public
as $$
  select
    r.id,
    r.status,
    r.reward_amount,
    r.created_at,
    r.rewarded_at,
    coalesce(nullif(trim(p.full_name), ''), 'A referred user') as referred_full_name
  from public.referrals r
  left join public.profiles p on p.id = r.referred_id
  where r.referrer_id = case
    when public.is_admin() then p_user_id
    else auth.uid()
  end
  order by r.created_at desc;
$$;

