import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Whether Supabase has been configured with real project credentials.
 * The app must never crash when these are missing — instead it should
 * fall back to a clear "not configured" state so the UI can still be
 * previewed/built without secrets.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")
);

// A minimal no-op stand-in used only when env vars are missing, so importing
// `supabase` anywhere in the app never throws during build, dev, or preview.
// Every query builder call (select/eq/order/range/...) returns an object
// that is BOTH chainable (has those methods) AND a proper thenable, so
// `await supabase.from(...).select().eq(...)` always resolves cleanly to
// `{ data: null, error: {...}, count: 0 }` instead of hanging or returning
// a stray function reference.
function createUnconfiguredClient() {
  const emptyResult = () => ({
    data: null,
    error: {
      message:
        "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.",
    },
    count: 0,
  });

  const CHAIN_METHODS = [
    "select",
    "insert",
    "update",
    "upsert",
    "delete",
    "eq",
    "neq",
    "in",
    "order",
    "limit",
    "range",
    "or",
    "ilike",
    "gte",
    "lte",
    "match",
    "filter",
    "not",
  ];

  function makeQueryBuilder() {
    const builder = {};
    CHAIN_METHODS.forEach((method) => {
      builder[method] = () => builder;
    });
    // Terminal helpers resolve directly instead of continuing the chain.
    builder.single = () => Promise.resolve(emptyResult());
    builder.maybeSingle = () => Promise.resolve(emptyResult());
    // Make the builder itself awaitable at any point in the chain.
    builder.then = (onFulfilled, onRejected) =>
      Promise.resolve(emptyResult()).then(onFulfilled, onRejected);
    builder.catch = (onRejected) => Promise.resolve(emptyResult()).catch(onRejected);
    return builder;
  }

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe() {} } },
      }),
      signUp: async () => emptyResult(),
      signInWithPassword: async () => emptyResult(),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => emptyResult(),
      updateUser: async () => emptyResult(),
    },
    from: () => makeQueryBuilder(),
    rpc: async () => emptyResult(),
    channel: () => ({
      on: () => ({ subscribe: () => ({}) }),
      subscribe: () => ({}),
    }),
    removeChannel: () => {},
  };
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createUnconfiguredClient();
