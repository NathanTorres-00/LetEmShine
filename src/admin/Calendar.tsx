import React, { useState, useEffect, useMemo } from "react";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import { supabase } from "../utils/supabase/client";
import { Loader2, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import type { Booking } from "../types/booking";
import { formatPaymentLabel } from "../types/booking";

function toDateString(date: Date): string {
  const offset = date.getTimezoneOffset();
  const adjusted = new Date(date.getTime() - offset * 60 * 1000);
  return adjusted.toISOString().split("T")[0];
}

function parseTimeForSort(time: string): number {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("booking_date")
          .neq("status", "Cancelled");

        if (error) throw error;

        const dates = (data ?? []).map((row) => {
          const [y, m, d] = row.booking_date.split("-").map(Number);
          return new Date(y, m - 1, d);
        });
        setBookedDates(dates);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    };

    void fetchBookedDates();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!date) return;

      setIsLoading(true);
      try {
        const dateString = toDateString(date);

        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("booking_date", dateString)
          .order("booking_time", { ascending: true });

        if (error) throw error;

        const sorted = ((data ?? []) as Booking[]).sort(
          (a, b) => parseTimeForSort(a.booking_time) - parseTimeForSort(b.booking_time),
        );
        setBookings(sorted);
      } catch (error) {
        console.error("Error fetching calendar bookings:", error);
        toast.error("Failed to load schedule for this date");
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchBookings();
  }, [date]);

  const modifiers = useMemo(
    () => ({
      booked: bookedDates,
    }),
    [bookedDates],
  );

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-serif font-bold text-slate-900">Calendar</h2>
        <p className="text-slate-500 mt-1">View your schedule — synced from Calendly once connected</p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 md:col-span-1">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiers={modifiers}
            modifiersClassNames={{
              booked: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-sky-500",
            }}
            className="rounded-md border shadow"
          />
          <p className="text-xs text-slate-400 mt-4 text-center">
            Dots mark days with appointments
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 md:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-8">
            Schedule for {date?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <CalendarDays className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p>No appointments on this date.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex gap-6 p-5 rounded-xl border bg-sky-50 border-sky-100"
                >
                  <div className="w-24 shrink-0 text-sm font-semibold text-sky-700 pt-0.5">
                    {appointment.booking_time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900">{appointment.service_name}</h4>
                      <StatusBadge status={appointment.status} />
                    </div>
                    <p className="text-slate-700 mt-1">{appointment.customer_name}</p>
                    {appointment.customer_email && (
                      <p className="text-xs text-slate-500 mt-0.5">{appointment.customer_email}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-2">
                      {formatPaymentLabel(appointment)} · ${appointment.service_price} service
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
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
    Cancelled: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
        styles[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}
