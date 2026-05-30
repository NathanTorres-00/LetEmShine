import React, { useState, useEffect } from "react";
import { Filter, MoreHorizontal, Check, X, Trash2, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "../utils/supabase/client";
import type { Booking, BookingStatus } from "../types/booking";
import { formatPaymentLabel, bookingSource } from "../types/booking";

export function Bookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filter, setFilter] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    const [pendingDelete, setPendingDelete] = useState<Booking | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("bookings")
                .select("*")
                .order("booking_date", { ascending: false });

            if (error) throw error;
            setBookings((data ?? []) as Booking[]);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load bookings");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchBookings();

        const channel = supabase
            .channel("bookings_changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "bookings" },
                () => {
                    void fetchBookings();
                },
            )
            .subscribe();

        return () => {
            void supabase.removeChannel(channel);
        };
    }, []);

    const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
        try {
            const { error } = await supabase
                .from("bookings")
                .update({ status: newStatus })
                .eq("id", id);

            if (error) throw error;

            toast.success(`Booking marked as ${newStatus}`);
            setBookings((prev) =>
                prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
            );
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from("bookings")
                .delete()
                .eq("id", pendingDelete.id);
            if (error) throw error;
            toast.success("Booking deleted");
            setBookings((prev) => prev.filter((b) => b.id !== pendingDelete.id));
            setPendingDelete(null);
        } catch (error) {
            console.error("Error deleting booking:", error);
            toast.error("Failed to delete booking");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredBookings =
        filter === "All" ? bookings : bookings.filter((b) => b.status === filter);

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Bookings</h2>
                    <p className="text-slate-500 mt-1">
                        Appointments mirrored from Calendly once connected
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={fetchBookings}>
                        <Filter className="w-4 h-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {(["All", "Pending", "Confirmed", "Completed", "Cancelled"] as const).map(
                    (status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                                filter === status
                                    ? "bg-slate-900 text-white"
                                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                            }`}
                        >
                            {status}
                        </button>
                    ),
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-16 flex justify-center items-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="p-16 text-center text-slate-500">
                        No bookings yet. They&apos;ll appear here automatically when clients book
                        through Calendly.
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="p-16 text-center text-slate-500">
                        No bookings match the &ldquo;{filter}&rdquo; filter.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-5 font-semibold text-slate-700">
                                        Customer
                                    </th>
                                    <th className="px-6 py-5 font-semibold text-slate-700">
                                        Service
                                    </th>
                                    <th className="px-6 py-5 font-semibold text-slate-700">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-5 font-semibold text-slate-700">
                                        Status
                                    </th>
                                    <th className="px-6 py-5 font-semibold text-slate-700">
                                        Payment
                                    </th>
                                    <th className="px-6 py-5 font-semibold text-slate-700">
                                        Source
                                    </th>
                                    <th className="px-6 py-5 font-semibold text-slate-700">
                                        Price
                                    </th>
                                    <th className="px-6 py-5 font-semibold text-slate-700 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredBookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="font-medium text-slate-900">
                                                {booking.customer_name}
                                            </div>
                                            {booking.customer_email && (
                                                <div className="text-slate-500 text-xs mt-0.5">
                                                    {booking.customer_email}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-slate-600">
                                            {booking.service_name}
                                        </td>
                                        <td className="px-6 py-5 text-slate-600">
                                            <div>{booking.booking_date}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">
                                                {booking.booking_time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <PaymentBadge booking={booking} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <SourceBadge source={bookingSource(booking)} />
                                        </td>
                                        <td className="px-6 py-5 font-medium text-slate-900">
                                            ${booking.service_price}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            navigator.clipboard.writeText(booking.id)
                                                        }
                                                    >
                                                        Copy ID
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                booking.id,
                                                                "Confirmed",
                                                            )
                                                        }
                                                    >
                                                        <Check className="mr-2 h-4 w-4" /> Confirm
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                booking.id,
                                                                "Completed",
                                                            )
                                                        }
                                                    >
                                                        <Check className="mr-2 h-4 w-4" /> Mark
                                                        completed
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                booking.id,
                                                                "Cancelled",
                                                            )
                                                        }
                                                    >
                                                        <X className="mr-2 h-4 w-4" /> Cancel
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={() => setPendingDelete(booking)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        booking
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

            <AlertDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) setPendingDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingDelete ? (
                                <>
                                    This permanently removes{" "}
                                    <span className="font-medium text-slate-900">
                                        {pendingDelete.customer_name}
                                    </span>
                                    &rsquo;s appointment on {pendingDelete.booking_date} at{" "}
                                    {pendingDelete.booking_time}. This action can&rsquo;t be undone.
                                </>
                            ) : null}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                void handleConfirmDelete();
                            }}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete booking"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Confirmed: "bg-emerald-100 text-emerald-700",
        Pending: "bg-amber-100 text-amber-700",
        Completed: "bg-blue-100 text-blue-700",
        Cancelled: "bg-slate-100 text-slate-700",
    };
    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                styles[status] ?? "bg-slate-100 text-slate-700"
            }`}
        >
            {status}
        </span>
    );
}

function PaymentBadge({ booking }: { booking: Booking }) {
    const label = formatPaymentLabel(booking);
    const styles =
        booking.payment_status === "paid"
            ? "bg-emerald-100 text-emerald-700"
            : booking.payment_status === "unpaid"
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-500";
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles}`}>
            {label}
        </span>
    );
}

function SourceBadge({ source }: { source: "Calendly" | "Manual" }) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                source === "Calendly"
                    ? "bg-sky-100 text-sky-700"
                    : "bg-slate-100 text-slate-600"
            }`}
        >
            {source}
        </span>
    );
}
