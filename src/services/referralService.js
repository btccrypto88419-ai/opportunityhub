import { supabase } from "../lib/supabaseClient";

export async function fetchReferralSummary(userId) {
  // Expects a Postgres function `get_referral_summary(user_id uuid)` — see SQL migrations.
  const { data, error } = await supabase.rpc("get_referral_summary", { p_user_id: userId });
  return { data, error };
}

export async function fetchReferralHistory(userId) {
  const { data, error } = await supabase
    .from("referrals")
    .select("*, referred:referred_id(email)")
    .eq("referrer_id", userId)
    .order("created_at", { ascending: false });
  return { data: data || [], error };
}

export function buildReferralLink(code) {
  const base = import.meta.env.VITE_SITE_URL || window.location.origin;
  return `${base}/register?ref=${encodeURIComponent(code)}`;
}
