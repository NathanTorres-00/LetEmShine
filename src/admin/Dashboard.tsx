import React, { useEffect, useState } from "react";
import { Users, Calendar, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "../utils/supabase/client";

export function Dashboard() {
    const [stats, setStats] = useState({
        revenue: 0,
        bookings: 0,
        customers: 0,
        growth: 0
    });
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [weeklyRevenue, setWeeklyRevenue] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch recent bookings
                const { data: bookings, error: bookingsError } = await supabase
                    .from('bookings')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (bookingsError) throw bookingsError;
                setRecentBookings(bookings || []);

                // Fetch all bookings for stats
                const { data: allBookings, error: allBookingsError } = await supabase
                    .from('bookings')
                    .select('*');

                if (allBookingsError) throw allBookingsError;

                const confirmedBookings = (allBookings || []).filter(b => b.status !== 'Cancelled');
                const totalRevenue = confirmedBookings.reduce((sum, b) => sum + Number(b.service_price), 0);
                const uniqueCustomers = new Set((allBookings || []).map(b => b.customer_email)).size;

                setStats({
                    revenue: totalRevenue,
                    bookings: confirmedBookings.length,
                    customers: uniqueCustomers,
                    growth: 0 // Placeholder for growth calculation
                });

                // Prepare weekly revenue data
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const weeklyData = days.map(day => ({ name: day, revenue: 0 }));

                confirmedBookings.forEach(booking => {
                    const date = new Date(booking.booking_date);
                    const dayName = days[date.getDay()];
                    const dayObj = weeklyData.find(d => d.name === dayName);
                    if (dayObj) dayObj.revenue += Number(booking.service_price);
                });

                setWeeklyRevenue(weeklyData);

            } catch (error) {
                console.error("Dashboard data fetching error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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
                <p className="text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: "Total Revenue", value: `$${stats.revenue}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Bookings", value: stats.bookings.toString(), icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Total Customers", value: stats.customers.toString(), icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Growth", value: "+0%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
                        <div className={`p-4 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts & Recent Activity */}
            <div className="grid lg:grid-cols-3 gap-10">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-8">Revenue by Day</h3>
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
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `$${value}`} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-8">Recent Activity</h3>
                    <div className="space-y-8">
                        {recentBookings.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">No recent activity</p>
                        ) : recentBookings.map((booking, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-lg">
                                        {booking.customer_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{booking.customer_name}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{booking.booking_date} • {booking.booking_time}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                    booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                        booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-slate-100 text-slate-700'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
