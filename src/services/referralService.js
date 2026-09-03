import { supabase } from "../lib/supabaseClient";

export async function fetchReferralSummary(userId) {
  // Expects a Postgres function `get_referral_summary(user_id uuid)` — see SQL migrations.
  const { data, error } = await supabase.rpc("get_referral_summary", { p_user_id: userId });
  return { data, error };
}

export async function fetchReferralHistory(userId) {
  // Expects a Postgres function `get_referral_history(p_user_id uuid)` — see
  // supabase/migrations/0005_referral_summary_ownership.sql. A plain
  // .from("referrals").select(...) can't include the referred person's name:
  // profiles has no `email` column, and RLS on profiles correctly does not
  // let a referrer read the referred user's full profile row directly, so
  // this goes through a narrowly-scoped, ownership-checked RPC instead.
  const { data, error } = await supabase.rpc("get_referral_history", { p_user_id: userId });
  return { data: data || [], error };
}

export function buildReferralLink(code) {
  const base = import.meta.env.VITE_SITE_URL || window.location.origin;
  return `${base}/register?ref=${encodeURIComponent(code)}`;
}
