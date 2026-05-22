import React, { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Check, X, Eye, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "../utils/supabase/client";

// Define Booking type
type Booking = {
    id: string;
    customer_name: string;
    customer_email: string;
    service_name: string;
    service_price: number;
    booking_date: string;
    booking_time: string;
    status: string;
};

export function Bookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filter, setFilter] = useState("All");
    const [isLoading, setIsLoading] = useState(true);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('booking_date', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load bookings");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();

        // Subscribe to changes
        const channel = supabase
            .channel('bookings_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
                fetchBookings();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            toast.success(`Booking marked as ${newStatus}`);
            // Optimistic update or wait for subscription
            setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const filteredBookings = filter === "All"
        ? bookings
        : bookings.filter(b => b.status === filter);

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Bookings</h2>
                    <p className="text-slate-500 mt-1">Manage your appointments</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={fetchBookings}>
                        <Filter className="w-4 h-4" />
                        Refresh
                    </Button>
                    {/* <Button className="bg-sky-600 hover:bg-sky-700 text-white gap-2">
                        + New Booking
                    </Button> */}
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${filter === status
                            ? "bg-slate-900 text-white"
                            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-16 flex justify-center items-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="p-16 text-center text-slate-500">
                        No bookings found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-6 font-semibold text-slate-700">Customer</th>
                                    <th className="px-8 py-6 font-semibold text-slate-700">Service</th>
                                    <th className="px-8 py-6 font-semibold text-slate-700">Date & Time</th>
                                    <th className="px-8 py-6 font-semibold text-slate-700">Status</th>
                                    <th className="px-8 py-6 font-semibold text-slate-700">Price</th>
                                    <th className="px-8 py-6 font-semibold text-slate-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="font-medium text-slate-900">{booking.customer_name}</div>
                                            <div className="text-slate-500 text-xs mt-0.5">{booking.customer_email}</div>
                                        </td>
                                        <td className="px-8 py-6 text-slate-600">{booking.service_name}</td>
                                        <td className="px-8 py-6 text-slate-600">
                                            <div>{booking.booking_date}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">{booking.booking_time}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                                booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                    booking.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-medium text-slate-900">${booking.service_price}</td>
                                        <td className="px-8 py-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.id)}>
                                                        Copy ID
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "Confirmed")}>
                                                        <Check className="mr-2 h-4 w-4" /> Confirm
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "Cancelled")}>
                                                        <X className="mr-2 h-4 w-4" /> Cancel
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={async () => {
                                                            if (window.confirm("Are you sure you want to delete this booking?")) {
                                                                try {
                                                                    const { error } = await supabase.from('bookings').delete().eq('id', booking.id);
                                                                    if (error) throw error;
                                                                    toast.success("Booking deleted");
                                                                    setBookings(bookings.filter(b => b.id !== booking.id));
                                                                } catch (error) {
                                                                    toast.error("Failed to delete booking");
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        Delete Booking
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
