import { supabase } from "../lib/supabaseClient";

const LOCAL_KEY = "oh_saved_opportunities_guest";

export function getLocalSavedIds() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalSavedIds(ids) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(ids));
}

export function toggleLocalSaved(opportunityId) {
  const ids = getLocalSavedIds();
  const next = ids.includes(opportunityId)
    ? ids.filter((id) => id !== opportunityId)
    : [...ids, opportunityId];
  setLocalSavedIds(next);
  return next;
}

/** Fetch saved opportunity rows (joined with opportunity data) for a signed-in user. */
export async function fetchSavedOpportunities(userId) {
  const { data, error } = await supabase
    .from("saved_opportunities")
    .select("id, created_at, opportunity:opportunities(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data: data || [], error };
}

export async function fetchSavedIds(userId) {
  const { data, error } = await supabase
    .from("saved_opportunities")
    .select("opportunity_id")
    .eq("user_id", userId);
  return { data: (data || []).map((r) => r.opportunity_id), error };
}

export async function saveOpportunity(userId, opportunityId) {
  const { data, error } = await supabase
    .from("saved_opportunities")
    .insert([{ user_id: userId, opportunity_id: opportunityId }])
    .select()
    .single();
  return { data, error };
}

export async function unsaveOpportunity(userId, opportunityId) {
  const { error } = await supabase
    .from("saved_opportunities")
    .delete()
    .eq("user_id", userId)
    .eq("opportunity_id", opportunityId);
  return { error };
}

/** Merge any locally-saved (guest) opportunity ids into the account after login. */
export async function mergeLocalSavedIntoAccount(userId) {
  const localIds = getLocalSavedIds();
  if (!localIds.length) return;
  const rows = localIds.map((opportunity_id) => ({ user_id: userId, opportunity_id }));
  await supabase.from("saved_opportunities").upsert(rows, {
    onConflict: "user_id,opportunity_id",
    ignoreDuplicates: true,
  });
  setLocalSavedIds([]);
}
