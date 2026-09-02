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
  //
  // Deliberately NOT chained with .select().single(): PostgREST/Supabase
  // requires the inserted row to also satisfy a SELECT policy to return it,
  // but a logged-out visitor's submission (submitted_by = null) has no
  // matching SELECT policy on `opportunities` (only "published" rows and a
  // submitter's own rows are selectable). Requesting the row back would make
  // every anonymous submission fail with a false RLS error even though the
  // insert itself succeeded. Callers only need to know whether it errored.
  const { error } = await supabase
    .from("opportunities")
    .insert([{ ...payload, status: "pending", is_featured: false, is_verified: false }]);
  return { data: null, error };
}

export async function reportOpportunity({ opportunityId, userId, reason, details }) {
  // Not chained with .select().single(): reports have no SELECT policy for
  // anonymous reporters (reporter_id = null), only for the row's own
  // reporter or an admin — see the same PostgREST insert+select RLS note in
  // submitOpportunity() above. Requesting the row back would make every
  // logged-out report submission fail even though the insert succeeded.
  const { error } = await supabase.from("reports").insert([
    {
      opportunity_id: opportunityId,
      reporter_id: userId || null,
      reason,
      details: details || null,
      status: "pending",
    },
  ]);
  return { data: null, error };
}
