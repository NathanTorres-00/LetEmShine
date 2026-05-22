import React, { useState, useEffect } from "react";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import { supabase } from "../utils/supabase/client";
import { Loader2 } from "lucide-react";

type Booking = {
    id: string;
    customer_name: string;
    service_name: string;
    booking_date: string;
    booking_time: string;
    status: string;
};

export function Calendar() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!date) return;

            setIsLoading(true);
            try {
                // Format date to YYYY-MM-DD
                const offset = date.getTimezoneOffset();
                const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
                const dateString = adjustedDate.toISOString().split('T')[0];

                const { data, error } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('booking_date', dateString);

                if (error) throw error;
                setBookings(data || []);
            } catch (error) {
                console.error("Error fetching calendar bookings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [date]);

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900">Calendar</h2>
                <p className="text-slate-500 mt-1">View your schedule</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
                {/* Calendar Widget */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 md:col-span-1">
                    <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow"
                    />
                </div>

                {/* Daily Schedule */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 md:col-span-2">
                    <h3 className="text-lg font-bold text-slate-900 mb-8">
                        Schedule for {date?.toLocaleDateString()}
                    </h3>

                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Time Slots */}
                            {["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"].map((time) => {
                                const appointment = bookings.find(b => b.booking_time === time);

                                return (
                                    <div key={time} className="flex gap-6 group">
                                        <div className="w-24 text-sm font-medium text-slate-400 pt-3">{time}</div>
                                        <div className={`flex-1 p-5 rounded-xl border transition-all ${appointment
                                            ? "bg-sky-50 border-sky-100 hover:shadow-md hover:border-sky-200"
                                            : "bg-slate-50 border-transparent border-dashed hover:border-slate-200"
                                            }`}>
                                            {appointment ? (
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-slate-900 text-lg">{appointment.service_name}</h4>
                                                        <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${appointment.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                                            appointment.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {appointment.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 mt-1">{appointment.customer_name}</p>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400 group-hover:text-slate-500">Available</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
