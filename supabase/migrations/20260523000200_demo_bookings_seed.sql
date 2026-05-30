-- Demo bookings for owner-meeting admin dashboard preview.
-- Idempotent: fixed UUIDs with ON CONFLICT DO NOTHING.
-- Remove before go-live:
--   DELETE FROM public.bookings WHERE id IN (
--     'a1000001-0000-4000-8000-000000000001',
--     'a1000002-0000-4000-8000-000000000002',
--     'a1000003-0000-4000-8000-000000000003'
--   );

INSERT INTO public.bookings (
  id,
  customer_name,
  customer_email,
  service_name,
  service_price,
  booking_date,
  booking_time,
  status,
  calendly_event_uri,
  calendly_invitee_uri,
  calendly_event_type,
  payment_status,
  amount_paid_cents
) VALUES
  (
    'a1000001-0000-4000-8000-000000000001',
    'Jordan Lee',
    'jordan@example.com',
    'Teeth Whitening',
    60,
    (date_trunc('week', CURRENT_DATE)::date + INTERVAL '4 days')::date,
    '03:30 PM',
    'Confirmed',
    'https://api.calendly.com/scheduled_events/demo-event-1',
    'https://api.calendly.com/scheduled_events/demo-event-1/invitees/jordan',
    'https://api.calendly.com/event_types/demo-whitening',
    'paid',
    2000
  ),
  (
    'a1000002-0000-4000-8000-000000000002',
    'Sam Rivera',
    'sam@example.com',
    'Teeth Whitening',
    60,
    (date_trunc('week', CURRENT_DATE)::date + INTERVAL '5 days')::date,
    '04:30 PM',
    'Pending',
    NULL,
    NULL,
    NULL,
    'unpaid',
    NULL
  ),
  (
    'a1000003-0000-4000-8000-000000000003',
    'Alex Chen',
    'alex@example.com',
    'Teeth Whitening',
    60,
    (CURRENT_DATE - INTERVAL '7 days')::date,
    '05:00 PM',
    'Completed',
    'https://api.calendly.com/scheduled_events/demo-event-3',
    'https://api.calendly.com/scheduled_events/demo-event-3/invitees/alex',
    'https://api.calendly.com/event_types/demo-whitening',
    'paid',
    2000
  )
ON CONFLICT (id) DO NOTHING;
