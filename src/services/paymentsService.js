import { supabase } from "../lib/supabaseClient";

export async function fetchPaymentDestinations() {
  const { data, error } = await supabase
    .from("payment_destinations")
    .select("*")
    .eq("is_active", true);
  return { data: data || [], error };
}

export async function submitPayment(payload) {
  // payload: { user_id, method, network, asset_amount, ngn_amount, reference, purpose }
  const { data, error } = await supabase
    .from("payments")
    .insert([{ ...payload, status: "pending" }])
    .select()
    .single();
  return { data, error };
}

export async function fetchMyPayments(userId) {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data: data || [], error };
}
