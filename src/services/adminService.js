import { supabase } from "../lib/supabaseClient";

// All of these rely on RLS policies that only allow rows to be read/written
// when the requesting user's profile has role = 'admin'. See supabase/migrations.

export async function fetchAllOpportunities({ status } = {}) {
  let query = supabase.from("opportunities").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  return { data: data || [], error };
}

export async function upsertOpportunityAdmin(payload) {
  if (payload.id) {
    const { data, error } = await supabase
      .from("opportunities")
      .update(payload)
      .eq("id", payload.id)
      .select()
      .single();
    return { data, error };
  }
  const { data, error } = await supabase.from("opportunities").insert([payload]).select().single();
  return { data, error };
}

export async function deleteOpportunityAdmin(id) {
  const { error } = await supabase.from("opportunities").delete().eq("id", id);
  return { error };
}

export async function fetchAllPayments() {
  const { data, error } = await supabase
    .from("payments")
    .select("*, profile:profiles(full_name, email:id)")
    .order("created_at", { ascending: false });
  return { data: data || [], error };
}

export async function updatePaymentStatus(id, status) {
  const { data, error } = await supabase
    .from("payments")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  return { data, error };
}

export async function fetchAllReports() {
  const { data, error } = await supabase
    .from("reports")
    .select("*, opportunity:opportunities(title, organization)")
    .order("created_at", { ascending: false });
  return { data: data || [], error };
}

export async function updateReportStatus(id, status) {
  const { error } = await supabase.from("reports").update({ status }).eq("id", id);
  return { error };
}

export async function fetchSiteSettings() {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return { data, error };
}

export async function updateSiteSettings(updates) {
  const { data, error } = await supabase
    .from("site_settings")
    .upsert([{ id: 1, ...updates }])
    .select()
    .single();
  return { data, error };
}

export async function fetchAllUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return { data: data || [], error };
}
