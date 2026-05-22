import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, LogOut, ListTodo, Loader2, MessageSquareQuote } from "lucide-react";
import { Button } from "../components/ui/button";
import { supabase } from "../utils/supabase/client";

export function AdminLayout() {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/login");
            } else {
                setIsLoading(false);
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate("/login");
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
        { icon: ListTodo, label: "Bookings", path: "/admin/bookings" },
        { icon: Calendar, label: "Calendar", path: "/admin/calendar" },
        { icon: MessageSquareQuote, label: "Testimonials", path: "/admin/testimonials" },
    ];

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-bg-muted">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-bg-muted font-sans text-text-primary overflow-hidden">
            <aside className="hidden md:flex w-64 flex-col bg-neutral-900 text-text-inverse flex-shrink-0">
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-20 items-center px-8 border-b border-neutral-600 flex-shrink-0">
                        <h1 className="font-[family-name:var(--font-display-script)] text-2xl tracking-tight">
                            Shine
                            <span className="text-neutral-400 text-xs ml-2 font-sans font-normal">Admin</span>
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                        ? "bg-text-inverse text-neutral-900 shadow-lg"
                                        : "text-neutral-400 hover:bg-neutral-950 hover:text-text-inverse"
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? "text-neutral-900" : "text-neutral-400 group-hover:text-text-inverse"}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-neutral-600 flex-shrink-0">
                        <button
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-400 rounded-xl hover:bg-neutral-950 hover:text-text-inverse transition-all duration-200"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content - Takes remaining space and scrolls independently */}
            <main className="flex-1 overflow-y-auto p-12">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
