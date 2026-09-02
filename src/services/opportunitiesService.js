import { supabase } from "../lib/supabaseClient";

/**
 * Fetch a page of published opportunities with optional filters.
 * filters: { keyword, category, location, mode, fullyFunded, sort }
 */
export async function fetchOpportunities(filters = {}, { page = 0, pageSize = 12 } = {}) {
  const {
    keyword = "",
    category = "",
    location = "",
    mode = "",
    fullyFunded = false,
    sort = "newest",
  } = filters;

  let query = supabase
    .from("opportunities")
    .select("*", { count: "exact" })
    .eq("status", "published");

  if (keyword) {
    query = query.or(
      `title.ilike.%${keyword}%,organization.ilike.%${keyword}%,description.ilike.%${keyword}%`
    );
  }
  if (category) query = query.eq("category", category);
  if (location) query = query.ilike("location", `%${location}%`);
  if (mode) query = query.eq("mode", mode);
  if (fullyFunded) query = query.eq("is_fully_funded", true);

  if (sort === "closing_soon") {
    query = query.order("deadline", { ascending: true, nullsFirst: false });
  } else if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else if (sort === "featured") {
    query = query
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });
  }

  const from = page * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  return { data: data || [], error, count: count || 0 };
}

export async function fetchOpportunityById(id) {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
}

export async function fetchFeaturedOpportunities(limit = 6) {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return { data: data || [], error };
}

export async function submitOpportunity(payload) {
  // Public submissions always go in as "pending" for admin review.
  const { data, error } = await supabase
    .from("opportunities")
    .insert([{ ...payload, status: "pending", is_featured: false, is_verified: false }])
    .select()
    .single();
  return { data, error };
}

export async function reportOpportunity({ opportunityId, userId, reason, details }) {
  const { data, error } = await supabase
    .from("reports")
    .insert([
      {
        opportunity_id: opportunityId,
        reporter_id: userId || null,
        reason,
        details: details || null,
        status: "pending",
      },
    ])
    .select()
    .single();
  return { data, error };
}
