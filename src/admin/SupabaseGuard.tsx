import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  isSupabaseConfigured,
  getSupabaseConfigError,
} from "../utils/supabase/client";

/**
 * Renders children only when Supabase is configured. Otherwise shows a
 * friendly error screen — admin pages depend on Supabase auth + data and
 * would otherwise crash via the lazy proxy.
 */
export function SupabaseGuard({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured()) {
    return <>{children}</>;
  }

  const error = getSupabaseConfigError() ?? "Supabase is not configured.";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border border-slate-100">
        <div className="flex items-center gap-3 mb-4 text-amber-600">
          <AlertTriangle className="h-6 w-6" />
          <h1 className="text-xl font-serif font-semibold text-slate-900">
            Admin temporarily unavailable
          </h1>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          The admin area can&rsquo;t reach its backend right now. This usually
          means environment variables are missing or invalid for this
          deployment.
        </p>
        <pre className="mt-4 p-3 bg-slate-50 rounded-md text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap break-words">
          {error}
        </pre>
        <p className="mt-4 text-xs text-slate-500">
          If you&rsquo;re the developer: confirm{" "}
          <code className="font-mono">VITE_SUPABASE_URL</code> and{" "}
          <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> are set in
          the deployment environment, then redeploy.
        </p>
      </div>
    </div>
  );
}
