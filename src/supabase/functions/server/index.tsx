import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-6c8cffa7/health", (c) => {
  return c.json({ status: "ok" });
});

app.post("/make-server-6c8cffa7/bookings", async (c) => {
  try {
    const body = await c.req.json();
    const { date, time, service } = body;

    if (!date || !time || !service) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create a unique key to prevent double booking
    // We'll use the date string directly if it's passed as ISO or localized string
    const dateStr = String(date).split('T')[0];
    const cleanTime = String(time).replace(/[^a-zA-Z0-9]/g, '');
    
    // Since staff is removed, we assume only one booking per time slot globally
    const key = `booking:${dateStr}:${cleanTime}`;
    
    const existing = await kv.get(key);
    if (existing) {
      return c.json({ error: "This appointment slot is already taken." }, 409);
    }

    // Store the booking
    await kv.set(key, { ...body, createdAt: new Date().toISOString() });
    
    return c.json({ success: true, message: "Booking confirmed" });
  } catch (e) {
    console.error("Booking error:", e);
    return c.json({ error: "Failed to process booking" }, 500);
  }
});

Deno.serve(app.fetch);