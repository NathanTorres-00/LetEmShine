export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type Booking = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string | null;
  service_name: string;
  service_price: number;
  booking_date: string;
  booking_time: string;
  status: BookingStatus;
  calendly_event_uri?: string | null;
  calendly_invitee_uri?: string | null;
  calendly_event_type?: string | null;
  stripe_payment_intent_id?: string | null;
  payment_status?: string | null;
  amount_paid_cents?: number | null;
};

export function formatPaymentLabel(booking: Booking): string {
  if (booking.payment_status === "paid" && booking.amount_paid_cents != null) {
    return `Paid $${(booking.amount_paid_cents / 100).toFixed(0)}`;
  }
  if (booking.payment_status === "unpaid") {
    return "Unpaid";
  }
  return "—";
}

export function bookingSource(booking: Booking): "Calendly" | "Manual" {
  return booking.calendly_invitee_uri ? "Calendly" : "Manual";
}
