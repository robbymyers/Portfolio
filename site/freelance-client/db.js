// Freelance Client Tool — Supabase client + data helpers.
// The publishable (anon) key is safe in client JS; access is gated by Supabase
// Auth + RLS (owner allowlist). Logged out, every query returns nothing.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.47.10/+esm';

const SUPABASE_URL = 'https://gtgzvwfhugtondybmfut.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_SOo9Cc8WG36sSk7TDy1hhQ_5eNhgpgu';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  db: { schema: 'freelance' },
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

// --- Auth -----------------------------------------------------------------
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
export function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}
export function signOut() {
  return supabase.auth.signOut();
}
export function onAuthChange(cb) {
  return supabase.auth.onAuthStateChange((_e, session) => cb(session));
}

// --- Document numbers (atomic, per-year) ----------------------------------
export async function nextNumber(kind) {
  const { data, error } = await supabase.rpc('next_number', { p_kind: kind });
  if (error) throw error;
  return data;
}

// --- Thin query helpers ---------------------------------------------------
export const table = (name) => supabase.from(name);

export async function one(promise) {
  const { data, error } = await promise;
  if (error) throw error;
  return data;
}
