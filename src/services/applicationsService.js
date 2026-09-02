import { supabase } from "../lib/supabaseClient";

export async function fetchApplications(userId) {
  const { data, error } = await supabase
    .from("applications")
    .select("*, opportunity:opportunities(*)")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  return { data: data || [], error };
}

export async function upsertApplication({ id, userId, opportunityId, status, applicationDate, deadline, notes }) {
  const payload = {
    user_id: userId,
    opportunity_id: opportunityId,
    status,
    application_date: applicationDate || null,
    deadline: deadline || null,
    notes: notes || null,
  };
  if (id) {
    const { data, error } = await supabase
      .from("applications")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  }
  const { data, error } = await supabase
    .from("applications")
    .insert([payload])
    .select()
    .single();
  return { data, error };
}

export async function deleteApplication(id) {
  const { error } = await supabase.from("applications").delete().eq("id", id);
  return { error };
}
