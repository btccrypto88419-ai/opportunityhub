-- =============================================================================
-- OpportunityHub — Security hardening (post-audit)
-- =============================================================================
-- Found during pre-merge security audit:
--
-- 1) The "Users can update their own profile" policy on public.profiles only
--    restricts which ROW a user may update (auth.uid() = id) — it does not
--    restrict which COLUMNS may change. Row Level Security policies cannot by
--    themselves compare old vs new column values, so as written a signed-in
--    user could call:
--        supabase.from('profiles').update({ role: 'admin' }).eq('id', auth.uid())
--    directly from browser devtools/JS and successfully self-promote to
--    admin, bypassing every frontend restriction — because every admin check
--    in this schema (RLS policies AND the frontend AdminRoute) ultimately
--    trusts profiles.role.
--
--    Fix: a BEFORE UPDATE trigger on public.profiles that silently forces
--    role and referral_code back to their previous values unless the
--    request is already coming from an existing admin. This closes the gap
--    at the database level regardless of what the client sends.
--
-- 2) The "Authenticated users can submit opportunities as pending" insert
--    policy on public.opportunities checks status/is_featured/is_verified
--    but never checks submitted_by, so a user could insert a pending
--    opportunity and falsely attribute it to someone else's user id.
--
--    Fix: replace the policy with one that also requires
--    submitted_by = auth.uid() (or null for anonymous submissions).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Prevent self role-escalation (and referral_code tampering) on profiles.
-- -----------------------------------------------------------------------------

create or replace function public.prevent_privileged_profile_changes()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  acting_is_admin boolean;
begin
  -- Is the CURRENT (pre-change) session already an admin? Checked against the
  -- row as it stood before this update, not the incoming payload. This
  -- function itself is security definer so it (like public.is_admin())
  -- bypasses RLS for this one narrowly-scoped check.
  --
  -- auth.uid() is null whenever this statement is NOT running as an
  -- ordinary end-user request through PostgREST/Supabase-js (i.e. no JWT
  -- "sub" claim is present) — that's exactly the case for the Supabase SQL
  -- editor, `supabase db push`/migrations, and any backend code using the
  -- service_role key. Those are already trusted, RLS-bypassing contexts
  -- (e.g. the documented "make yourself an admin" SQL editor command in
  -- 0003_seed_data.sql), so this guard must only apply to real end-user
  -- sessions and must not silently break that trusted path.
  select auth.uid() is null
      or (old.role = 'admin' and old.id = auth.uid())
      or public.is_admin()
    into acting_is_admin;

  if not coalesce(acting_is_admin, false) then
    -- Silently discard any attempt to change role or referral_code from a
    -- non-admin update — regardless of what the client sent.
    new.role := old.role;
    new.referral_code := old.referral_code;
    new.referred_by := old.referred_by;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prevent_privileged_profile_changes on public.profiles;
create trigger trg_prevent_privileged_profile_changes
  before update on public.profiles
  for each row execute procedure public.prevent_privileged_profile_changes();

-- -----------------------------------------------------------------------------
-- 2. Require submitted_by = auth.uid() (or null) on opportunity submissions.
-- -----------------------------------------------------------------------------

drop policy if exists "Authenticated users can submit opportunities as pending" on public.opportunities;

create policy "Authenticated users can submit opportunities as pending"
  on public.opportunities for insert
  with check (
    status = 'pending'
    and is_featured = false
    and is_verified = false
    and (submitted_by = auth.uid() or submitted_by is null)
  );
