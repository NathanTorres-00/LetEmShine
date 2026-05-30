# Integrations: Calendly + Stripe

This document is the runbook for connecting **Calendly** (scheduling) and
**Stripe** (payments via Calendly's native integration) to this codebase
once the owner provides credentials.

Until both integrations are live, the marketing site shows a
"Booking opens soon" card (see `src/components/SchedulingSection.tsx`) and
the admin Bookings/Calendar pages query an empty `bookings` table.

## Architecture

```
Visitor → Calendly event page  ──┐
                                 │  (Calendly handles UI + Stripe payment)
                                 ▼
                  Calendly webhook (invitee.created / canceled)
                                 │
                                 ▼
              Supabase Edge Function: calendly-webhook
                                 │
                                 ▼
              public.bookings (Postgres) ← admin SPA reads via RLS
```

Key principles (from `LET_EM_SHINE_PRD.md`):
- Calendly + Stripe own scheduling and payment UI.
- The Supabase `bookings` table is a **read-only mirror** for the admin SPA.
- Webhooks are the **only** writers; the admin UI never inserts into bookings.
- Lucy refunds via the Stripe Dashboard (no admin-app code needed).

## 1. Provision the accounts

### Calendly
1. Owner signs up at https://calendly.com (Standard or Teams plan to enable
   webhooks and payments).
2. Create a **single event type** named **Teeth Whitening Session** with:
   - Duration: 60 minutes (or whatever Lucy uses)
   - Availability: tied to Lucy's working hours
   - Buffer: 15 min before/after
3. In **Workflows → Payment**, connect Stripe and set the reservation fee
   (`site.pricing.depositAmount` = $20 in `src/config/site.ts`).
4. Copy the **public event URL** (e.g.
   `https://calendly.com/shinebylucy/teeth-whitening`).

### Stripe
- Connect inside Calendly's Payment workflow above — no separate Stripe
  Dashboard setup needed for v1.
- For webhook signature verification we need a **separate Stripe webhook
  endpoint** (see step 3). Lucy's existing Stripe account is fine.

## 2. Update site config

Edit `src/config/site.ts`:

```ts
export const site = {
  // ...
  contact: {
    email: "hello@shinebylucy.com", // real email from owner
    phone: "...",
    address: "By appointment only",
    hours: "Fri – Sat by appointment",
  },
  social: {
    instagram: "https://instagram.com/shinebylucy",
    // ...
  },
  booking: {
    calendlyUrl: "https://calendly.com/shinebylucy/teeth-whitening",
  },
};
```

Once `booking.calendlyUrl` is non-null, the SchedulingSection automatically
swaps from the "coming soon" card to a "Book now" CTA that opens Calendly.

To upgrade from "popup" to a fully embedded scheduler, replace the
`CalendlyPlaceholder` component in `src/components/SchedulingSection.tsx`
with Calendly's `<InlineWidget url={calendlyUrl} />` from
`react-calendly`. Install with `npm i react-calendly`.

## 3. Calendly webhook → bookings table

Create a Supabase Edge Function:

```bash
supabase functions new calendly-webhook
```

Paste this into `supabase/functions/calendly-webhook/index.ts`:

```ts
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "node:crypto";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CALENDLY_WEBHOOK_SIGNING_KEY = Deno.env.get("CALENDLY_WEBHOOK_SIGNING_KEY")!;

serve(async (req) => {
  const rawBody = await req.text();
  const signatureHeader = req.headers.get("calendly-webhook-signature") ?? "";

  if (!verifySignature(rawBody, signatureHeader, CALENDLY_WEBHOOK_SIGNING_KEY)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  if (payload.event === "invitee.created") {
    const i = payload.payload;
    const { error } = await supabase.from("bookings").upsert(
      {
        customer_name: i.name,
        customer_email: i.email,
        service_name: i.event_type?.name ?? "Teeth Whitening Session",
        service_price: 60, // matches site.pricing.servicePrice
        booking_date: i.scheduled_event.start_time.slice(0, 10),
        booking_time: i.scheduled_event.start_time.slice(11, 16),
        status: "Confirmed",
        calendly_event_uri: i.scheduled_event.uri,
        calendly_invitee_uri: i.uri,
        calendly_event_type: i.event_type?.uri ?? null,
      },
      { onConflict: "calendly_invitee_uri" },
    );
    if (error) console.error("Upsert error", error);
  }

  if (payload.event === "invitee.canceled") {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "Cancelled" })
      .eq("calendly_invitee_uri", payload.payload.uri);
    if (error) console.error("Cancel error", error);
  }

  return new Response("ok");
});

function verifySignature(body: string, header: string, secret: string): boolean {
  // Calendly sends: "t=timestamp,v1=signature"
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const expected = createHmac("sha256", secret)
    .update(`${parts.t}.${body}`)
    .digest("hex");
  return parts.v1 === expected;
}
```

Deploy and set secrets:

```bash
supabase functions deploy calendly-webhook --no-verify-jwt
supabase secrets set \
  CALENDLY_WEBHOOK_SIGNING_KEY=whsec_xxx \
  --project-ref qgklishrflfclmixxfcn
```

In **Calendly → Workflows → Webhooks**, add:

- URL: `https://qgklishrflfclmixxfcn.supabase.co/functions/v1/calendly-webhook`
- Scope: User
- Events: `invitee.created`, `invitee.canceled`
- Signing key: copy what Calendly generates into `CALENDLY_WEBHOOK_SIGNING_KEY`

## 4. Optional: Stripe webhook for payment metadata

Calendly's webhook already tells us a booking was created and (since
Calendly handles payment) reserves are paid at booking time. If finer
detail is needed (refunds, partial payments), add a separate Stripe
webhook that updates `bookings.payment_status` and `amount_paid_cents`
by matching the customer's email or by storing the Calendly URI in
Stripe metadata.

Skeleton:

```ts
import Stripe from "https://esm.sh/stripe@14?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

serve(async (req) => {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig!, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    await supabase
      .from("bookings")
      .update({
        stripe_payment_intent_id: pi.id,
        payment_status: "paid",
        amount_paid_cents: pi.amount_received,
      })
      .eq("customer_email", pi.receipt_email);
  }

  return new Response("ok");
});
```

## 5. Database schema reference

Already applied via
`supabase/migrations/20260523000000_admin_role_and_bookings_hardening.sql`:

```sql
public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  service_name TEXT NOT NULL,
  service_price NUMERIC NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,           -- HH:MM (24h)
  status TEXT NOT NULL DEFAULT 'Pending' -- 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
  calendly_event_uri TEXT,
  calendly_invitee_uri TEXT,            -- UNIQUE when not null
  calendly_event_type TEXT,
  stripe_payment_intent_id TEXT,
  payment_status TEXT,
  amount_paid_cents INTEGER
);
```

RLS: admin (`app_metadata.role = 'admin'`) read/write; anon has no SELECT.
Webhooks bypass RLS using `SUPABASE_SERVICE_ROLE_KEY`.

## 6. Provisioning a new admin user

Use the Supabase Studio:
1. **Auth → Users → Add user** (email + password).
2. **SQL Editor**:

   ```sql
   UPDATE auth.users
   SET raw_app_meta_data =
     COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
   WHERE email = 'lucy@shinebylucy.com';
   ```

3. Tell the user to log out and back in (the JWT only refreshes on sign-in).

## 7. Open questions for the owner meeting

- Confirm legal/brand name: **"Shine by Lucy"** vs older **"Let 'Em Shine"**.
- Confirm reservation fee amount and refund policy.
- Confirm working hours / Calendly availability windows.
- Confirm marketing photography source (Lucy's own photos vs. licensed
  stock).
- Confirm social handles to surface in the footer.

Once those are decided, update `src/config/site.ts` and you're live.
