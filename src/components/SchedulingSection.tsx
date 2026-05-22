import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { toast } from "sonner";
import { supabase } from "../utils/supabase/client";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ds } from "../design-system/classes";

export function SchedulingSection() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingBookings, setExistingBookings] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Hardcoded service details
  const serviceName = "Teeth Whitening";
  const servicePrice = 60;

  const availableSlots = ["03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"];

  useEffect(() => {
    if (date) {
      fetchBookedSlots(date);
    } else {
      setExistingBookings([]);
    }
  }, [date]);

  const fetchBookedSlots = async (selectedDate: Date) => {
    setIsLoadingSlots(true);
    try {
      const offset = selectedDate.getTimezoneOffset();
      const adjustedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
      const dateString = adjustedDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('booking_date', dateString)
        .neq('status', 'Cancelled');

      if (error) throw error;
      setExistingBookings(data?.map(b => b.booking_time) || []);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleBook = async () => {
    if (!date || !time || !name || !email) {
      toast.error("Please fill in all fields to book your appointment.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Re-check if slot is still available right before booking
      const offset = date.getTimezoneOffset();
      const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
      const dateString = adjustedDate.toISOString().split('T')[0];

      const { data: checkData } = await supabase
        .from('bookings')
        .select('id')
        .eq('booking_date', dateString)
        .eq('booking_time', time)
        .neq('status', 'Cancelled')
        .maybeSingle();

      if (checkData) {
        toast.error("Sorry, this time slot was just taken. Please select another time.");
        fetchBookedSlots(date);
        setTime(undefined);
        return;
      }

      const { error } = await supabase
        .from('bookings')
        .insert({
          customer_name: name,
          customer_email: email,
          service_name: serviceName,
          service_price: servicePrice,
          booking_date: dateString,
          booking_time: time,
          status: 'Pending'
        });

      if (error) throw error;

      toast.success("Appointment Scheduled!", {
        description: `You're booked for ${serviceName} on ${date.toLocaleDateString()} at ${time}.`,
      });

      // Reset form
      setDate(undefined);
      setTime(undefined);
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-bg-muted" id="contact">
      <div className="container mx-auto px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl ${ds.headingSection} mb-4`}>
              Schedule Your Appointment
            </h2>
            <p className={ds.textBody}>
              Ready to shine? Pick a date and time that works for you.
            </p>
          </div>

          <div className={`${ds.cardElevated} p-8`} style={{ borderRadius: "var(--radius-xl)" }}>
            {/* Two-Column Layout Matching Figma */}
            <div className="flex flex-col xl:flex-row gap-8 items-start justify-center w-full">

              {/* Left Column: Calendar Card */}
              <div className="w-full max-w-[320px] shrink-0 mx-auto xl:mx-0">
                <div className={`${ds.cardElevated} p-6`}>
                  {/* Calendar Header */}
                  <div className="flex flex-col items-center mb-6">
                    <h3 className="font-sans font-normal text-text-primary text-[18px] leading-[28px] text-center">
                      Select Date
                    </h3>
                    <p className={`${ds.textBodySm} text-center`}>
                      Mon - Fri availability
                    </p>
                  </div>

                  {/* Shadcn Calendar (Styled to match) */}
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate: Date | undefined) => {
                      setDate(newDate);
                      if (!newDate) {
                        setTime(undefined);
                      }
                    }}
                    className="p-0 w-full"
                    classNames={{
                      month: "space-y-4 w-full",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium font-sans text-text-primary",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-all active:scale-90 hover:bg-slate-100 rounded-full",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex w-full justify-between mb-2",
                      head_cell: "text-text-muted rounded-md w-8 font-normal text-[12.8px]",
                      row: "flex w-full justify-between mt-2",
                      cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-neutral-50 hover:text-text-primary rounded-xl transition-all duration-300 ease-out text-text-muted text-[14px] active:scale-75 hover:shadow-sm",
                      day_selected:
                        "bg-neutral-900 text-text-inverse hover:bg-neutral-900 hover:text-text-inverse focus:bg-neutral-900 focus:text-text-inverse rounded-xl shadow-md scale-110 font-medium shadow-neutral-50",
                      day_today: "bg-neutral-50 text-text-primary font-medium",
                      day_outside: "text-neutral-400 opacity-50",
                      day_disabled: "text-neutral-400 opacity-50",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                    disabled={(date: Date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      // Disable if before today OR if NOT Friday (5) or Saturday (6)
                      return date < today || (date.getDay() !== 5 && date.getDay() !== 6);
                    }}
                  />
                </div>
              </div>

              {/* Right Column: Time & Form Card */}
              {/* Show conditional on date selection, but keep layout stable */}
              <div className={`w-full max-w-[350px] mx-auto xl:mx-0 transition-all duration-500 ease-out transform ${date ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none hidden xl:block xl:opacity-0'}`}>
                {date && (
                  <div className={`${ds.cardElevated} p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500`}>

                    {/* Available Times Section */}
                    <div className="flex flex-col gap-4">
                      <h3 className={ds.textLabel}>
                        {isLoadingSlots ? "Checking Availability..." : "Available Times"}
                      </h3>

                      <div className="grid grid-cols-2 gap-3">
                        {availableSlots.map((slot) => {
                          const isBooked = existingBookings.includes(slot);
                          return (
                            <button
                              key={slot}
                              disabled={isBooked || isLoadingSlots}
                              onClick={() => setTime(slot)}
                              className={`${ds.btnTimeSlot} ${time === slot
                                ? ds.btnTimeSlotActive
                                : isBooked
                                  ? "bg-neutral-50 border-neutral-50 text-neutral-400 cursor-not-allowed line-through"
                                  : ds.btnTimeSlotIdle
                                }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Customer Details & Treatment Section */}
                    <div className={`flex flex-col gap-4 transition-opacity duration-300 ${time ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="name" className={`text-xs ${ds.textLabel}`}>Name</Label>
                          <Input
                            id="name"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={ds.inputField}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="email" className={`text-xs ${ds.textLabel}`}>Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={ds.inputField}
                          />
                        </div>
                      </div>

                      <div className="h-px bg-slate-100 my-1" />

                      <h3 className={ds.textLabel}>Service</h3>

                      <div className="h-[56px] rounded-[var(--radius-brand-button)] bg-slate-50 border border-slate-200 flex items-center justify-between px-4">
                        <span className="text-text-primary font-medium">{serviceName}</span>
                        <span className="text-text-secondary font-medium">${servicePrice}</span>
                      </div>

                      {/* Confirm Button */}
                      <Button
                        className={`h-[56px] w-full text-base mt-2 transition-all active:scale-95 ${ds.btnPrimary}`}
                        onClick={handleBook}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Booking...
                          </>
                        ) : "Confirm Appointment"}
                      </Button>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
