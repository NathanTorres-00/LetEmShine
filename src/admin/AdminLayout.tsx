import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  LogOut,
  ListTodo,
  Loader2,
  MessageSquareQuote,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { supabase } from "../utils/supabase/client";
import { SupabaseGuard } from "./SupabaseGuard";

type SessionState =
  | { status: "loading" }
  | { status: "unauthorized"; reason: "no-session" | "not-admin" }
  | { status: "error"; message: string }
  | { status: "ready" };

function isAdminSession(session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]): boolean {
  const role = session?.user?.app_metadata?.role;
  return role === "admin";
}

type NavItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  badge?: number;
};

function AdminLayoutInner() {
  const [state, setState] = useState<SessionState>({ status: "loading" });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pendingTestimonials, setPendingTestimonials] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error) {
          setState({ status: "error", message: error.message });
          return;
        }
        if (!data.session) {
          setState({ status: "unauthorized", reason: "no-session" });
          return;
        }
        if (!isAdminSession(data.session)) {
          setState({ status: "unauthorized", reason: "not-admin" });
          return;
        }
        setState({ status: "ready" });
      } catch (err) {
        if (cancelled) return;
        setState({
          status: "error",
          message: err instanceof Error ? err.message : String(err),
        });
      }
    };

    void checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (cancelled) return;
        if (!session) {
          setState({ status: "unauthorized", reason: "no-session" });
        } else if (!isAdminSession(session)) {
          setState({ status: "unauthorized", reason: "not-admin" });
        } else {
          setState({ status: "ready" });
        }
      },
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (state.status === "unauthorized") {
      const params =
        state.reason === "not-admin"
          ? "?error=not-admin"
          : "";
      navigate(`/login${params}`, { replace: true });
    }
  }, [state, navigate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { count, error } = await supabase
          .from("testimonial_submissions")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending");
        if (cancelled || error) return;
        setPendingTestimonials(count ?? 0);
      } catch {
        // Non-blocking — badge is optional polish
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // Even if signOut errors, force-clear local state and bounce to login.
      console.error("[admin] signOut failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: ListTodo, label: "Bookings", path: "/admin/bookings" },
    { icon: Calendar, label: "Calendar", path: "/admin/calendar" },
    {
      icon: MessageSquareQuote,
      label: "Testimonials",
      path: "/admin/testimonials",
      badge: pendingTestimonials > 0 ? pendingTestimonials : undefined,
    },
  ];

  if (state.status === "loading" || state.status === "unauthorized") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-bg-muted">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border border-slate-100">
          <div className="flex items-center gap-3 mb-4 text-amber-600">
            <AlertTriangle className="h-6 w-6" />
            <h1 className="text-xl font-serif font-semibold text-slate-900">
              Couldn&rsquo;t verify session
            </h1>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{state.message}</p>
          <Button
            className="mt-6"
            onClick={() => navigate("/login", { replace: true })}
          >
            Go to login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-muted font-sans text-text-primary overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-neutral-900 text-text-inverse flex-shrink-0">
        <AdminSidebar
          navItems={navItems}
          activePath={location.pathname}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-neutral-900 text-text-inverse px-4 h-14 border-b border-neutral-800">
        <h1 className="font-[family-name:var(--font-display-script)] text-xl tracking-tight">
          Shine
          <span className="text-neutral-400 text-[10px] ml-2 font-sans font-normal">
            Admin
          </span>
        </h1>
        <button
          type="button"
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((v) => !v)}
          className="p-2 -mr-2"
        >
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-neutral-900/70" onClick={() => setMobileNavOpen(false)}>
          <div
            className="absolute top-14 left-0 right-0 bg-neutral-900 text-text-inverse"
            onClick={(e) => e.stopPropagation()}
          >
            <AdminSidebar
              navItems={navItems}
              activePath={location.pathname}
              onLogout={handleLogout}
              compact
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12 pt-20 md:pt-12">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function AdminSidebar({
  navItems,
  activePath,
  onLogout,
  compact = false,
}: {
  navItems: NavItem[];
  activePath: string;
  onLogout: () => void;
  compact?: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      {!compact && (
        <div className="flex h-20 items-center px-8 border-b border-neutral-600 flex-shrink-0">
          <h1 className="font-[family-name:var(--font-display-script)] text-2xl tracking-tight">
            Shine
            <span className="text-neutral-400 text-xs ml-2 font-sans font-normal">
              Admin
            </span>
          </h1>
        </div>
      )}

      <nav className={`${compact ? "px-3 py-4" : "flex-1 px-4 py-8"} space-y-2 overflow-y-auto`}>
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-text-inverse text-neutral-900 shadow-lg"
                  : "text-neutral-400 hover:bg-neutral-950 hover:text-text-inverse"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-neutral-900" : "text-neutral-400"}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span
                  className={`min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-semibold flex items-center justify-center ${
                    isActive
                      ? "bg-neutral-900 text-text-inverse"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`${compact ? "px-3 pb-4 pt-2" : "p-4"} border-t border-neutral-600 flex-shrink-0`}>
        <button
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-400 rounded-xl hover:bg-neutral-950 hover:text-text-inverse transition-all duration-200"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function AdminLayout() {
  return (
    <SupabaseGuard>
      <AdminLayoutInner />
    </SupabaseGuard>
  );
}
