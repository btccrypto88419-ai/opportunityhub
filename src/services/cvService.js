import { supabase } from "../lib/supabaseClient";

const LOCAL_KEY = "oh_cv_draft";

export function getLocalCv() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocalCv(cv) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(cv));
}

export function clearLocalCv() {
  localStorage.removeItem(LOCAL_KEY);
}

export async function fetchCv(userId) {
  const { data, error } = await supabase
    .from("cvs")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return { data, error };
}

export async function saveCv(userId, cvData) {
  const { data, error } = await supabase
    .from("cvs")
    .upsert([{ user_id: userId, data: cvData, updated_at: new Date().toISOString() }], {
      onConflict: "user_id",
    })
    .select()
    .single();
  return { data, error };
}

export const emptyCv = {
  personal: { fullName: "", title: "", email: "", phone: "", location: "", summary: "" },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
};
