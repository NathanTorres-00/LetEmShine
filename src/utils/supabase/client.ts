import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const MISSING_CONFIG_MESSAGE =
  "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the deployment environment (e.g. Vercel Project Settings → Environment Variables) and redeploy.";

let realClient: SupabaseClient | null = null;
let configError: string | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    realClient = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    configError = err instanceof Error ? err.message : String(err);
    if (typeof console !== "undefined") {
      console.error("[supabase] Failed to initialize client:", err);
    }
  }
} else {
  configError = MISSING_CONFIG_MESSAGE;
  if (typeof console !== "undefined") {
    console.warn("[supabase]", MISSING_CONFIG_MESSAGE);
  }
}

export const isSupabaseConfigured = (): boolean => realClient !== null;
export const getSupabaseConfigError = (): string | null => configError;

// Lazy proxy so a missing env var doesn't crash the entire bundle at module
// load time. Any actual call (.from, .auth, .functions, …) will throw a
// descriptive error instead, which calling code can catch and surface in the UI.
function unconfiguredClientProxy(): SupabaseClient {
  const handler: ProxyHandler<Record<string, never>> = {
    get(_target, prop) {
      throw new Error(
        `${configError ?? MISSING_CONFIG_MESSAGE} (tried to access supabase.${String(prop)})`,
      );
    },
  };
  return new Proxy({}, handler) as unknown as SupabaseClient;
}

export const supabase: SupabaseClient = realClient ?? unconfiguredClientProxy();
