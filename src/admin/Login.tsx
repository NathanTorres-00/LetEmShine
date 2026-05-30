import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { supabase } from "../utils/supabase/client";
import { Loader2 } from "lucide-react";
import { SupabaseGuard } from "./SupabaseGuard";

function LoginInner() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Surface the not-admin redirect from AdminLayout as a toast.
  useEffect(() => {
    if (searchParams.get("error") === "not-admin") {
      toast.error("This account doesn't have admin access.");
    }
  }, [searchParams]);

  // If the user is already an admin, send them straight to /admin.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (data.session?.user?.app_metadata?.role === "admin") {
          navigate("/admin", { replace: true });
        }
      } catch {
        // Ignore — the user will just see the login form.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session?.user?.app_metadata?.role !== "admin") {
        await supabase.auth.signOut();
        toast.error("This account doesn't have admin access.");
        return;
      }

      toast.success("Welcome back!");
      navigate("/admin", { replace: true });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Invalid credentials";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            Admin Login
          </h1>
          <p className="text-slate-500 mt-2">Sign in to manage your bookings</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="admin-email"
              className="text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="admin-password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function Login() {
  return (
    <SupabaseGuard>
      <LoginInner />
    </SupabaseGuard>
  );
}
