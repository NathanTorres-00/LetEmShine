import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  DollarSign,
  MessageSquareQuote,
  Loader2,
  AlertTriangle,
  X,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { supabase } from "../utils/supabase/client";
import type { Booking } from "../types/booking";
import { site } from "../config/site";

type DashboardStats = {
  revenue: number;
  bookings: number;
  pendingTestimonials: number;
  depositsCollected: number;
};

const SETUP_NOTE_KEY = "admin-dashboard-setup-dismissed";

function bookingRevenue(booking: Booking): number {
  if (booking.payment_status === "paid" && booking.amount_paid_cents != null) {
    return booking.amount_paid_cents / 100;
  }
  if (booking.payment_status == null && booking.amount_paid_cents == null) {
    return Number(booking.service_price);
  }
  return 0;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    revenue: 0,
    bookings: 0,
    pendingTestimonials: 0,
    depositsCollected: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState<{ name: string; revenue: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showSetupNote, setShowSetupNote] = useState(
    () => localStorage.getItem(SETUP_NOTE_KEY) !== "true",
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const [recentResult, allBookingsResult, pendingResult] = await Promise.all([
          supabase
            .from("bookings")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase.from("bookings").select("*"),
          supabase
            .from("testimonial_submissions")
            .select("id", { count: "exact", head: true })
            .eq("status", "pending"),
        ]);

        if (recentResult.error) throw recentResult.error;
        if (allBookingsResult.error) throw allBookingsResult.error;
        if (pendingResult.error) throw pendingResult.error;

        const allBookings = (allBookingsResult.data ?? []) as Booking[];
        setRecentBookings((recentResult.data ?? []) as Booking[]);

        const activeBookings = allBookings.filter((b) => b.status !== "Cancelled");
        const paidBookings = allBookings.filter((b) => b.payment_status === "paid");
        const totalRevenue = activeBookings.reduce((sum, b) => sum + bookingRevenue(b), 0);

        setStats({
          revenue: totalRevenue,
          bookings: activeBookings.length,
          pendingTestimonials: pendingResult.count ?? 0,
          depositsCollected: paidBookings.length,
        });

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weeklyData = days.map((name) => ({ name, revenue: 0 }));
        activeBookings.forEach((booking) => {
          const date = new Date(`${booking.booking_date}T12:00:00`);
          const dayName = days[date.getDay()];
          const dayObj = weeklyData.find((d) => d.name === dayName);
          if (dayObj) dayObj.revenue += bookingRevenue(booking);
        });
        setWeeklyRevenue(weeklyData);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load dashboard data";
        setFetchError(message);
        toast.error(message);
        console.error("Dashboard data fetching error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDashboardData();
  }, []);

  const dismissSetupNote = () => {
    localStorage.setItem(SETUP_NOTE_KEY, "true");
    setShowSetupNote(false);
  };

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-serif font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500 mt-1">
          Welcome back — here&apos;s what&apos;s happening with {site.name}.
        </p>
        {recentBookings.length === 0 && !fetchError && (
          <p className="text-sm text-slate-400 mt-2">
            Bookings populate automatically once Calendly is connected.
          </p>
        )}
      </div>

      {showSetupNote && (
        <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 flex items-start gap-3">
          <p className="text-sm text-sky-900 flex-1">
            Booking data is mirrored from Calendly. Connect your account after the owner
            meeting — see{" "}
            <span className="font-medium">docs/INTEGRATIONS.md</span> in the repo.
          </p>
          <button
            type="button"
            onClick={dismissSetupNote}
            className="text-sky-600 hover:text-sky-800 p-1"
            aria-label="Dismiss setup note"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {fetchError && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900">{fetchError}</p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            label: "Total Revenue",
            value: `$${stats.revenue.toFixed(0)}`,
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Bookings",
            value: stats.bookings.toString(),
            icon: Calendar,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Pending testimonials",
            value: stats.pendingTestimonials.toString(),
            icon: MessageSquareQuote,
            color: "text-purple-600",
            bg: "bg-purple-50",
            link: stats.pendingTestimonials > 0 ? "/admin/testimonials" : undefined,
          },
          {
            label: "Deposits collected",
            value: stats.depositsCollected.toString(),
            icon: Users,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5"
          >
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              {stat.link && (
                <Link
                  to={stat.link}
                  className="text-xs text-purple-600 hover:underline mt-1 inline-flex items-center gap-1"
                >
                  Review now <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Revenue by weekday</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b" }}
                  tickFormatter={(value) => `$${value}`}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            {recentBookings.length > 0 && (
              <Link
                to="/admin/bookings"
                className="text-xs text-sky-600 hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
          <div className="space-y-8">
            {recentBookings.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No recent activity</p>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-lg">
                      {booking.customer_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{booking.customer_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {booking.booking_date} · {booking.booking_time}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Confirmed: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Completed: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`text-xs font-medium px-3 py-1 rounded-full ${
        styles[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}
