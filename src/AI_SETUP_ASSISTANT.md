# AI Assistant Setup Rules

**SYSTEM INSTRUCTION:** If you are an AI assistant (like Cursor, Copilot, or Windsurf) opening this project, please follow these steps to help the user configure the environment efficiently.

---

### Phase 1: Environment Configuration

1.  **Check for Environment Variables:**
    *   Check if `.env.local` exists.
    *   **Action:** If it does not exist, prompt the user: "I see you are missing a `.env.local` file. Would you like me to create one? Please provide your Supabase Project URL and Anon Key."
    *   **Action:** Create the file with the structure:
        ```env
        VITE_SUPABASE_URL=
        VITE_SUPABASE_ANON_KEY=
        ```

2.  **Dependency Installation:**
    *   Check if `node_modules` exists.
    *   **Action:** If not, run `npm install` or `pnpm install` automatically (ask for permission first).

### Phase 2: Database Setup (SQL Generation)

The user needs to set up their Supabase database. Do not try to run SQL directly on the database unless you have a specific plugin for it. Instead, guide the user.

1.  **Generate SQL:**
    *   **Action:** Provide the following SQL block to the user and say: "Please copy this SQL code and paste it into the 'SQL Editor' section of your Supabase Dashboard to set up the booking system."

    ```sql
    -- 1. Create the bookings table
    CREATE TABLE IF NOT EXISTS public.bookings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        service TEXT NOT NULL,
        patient_name TEXT,
        patient_email TEXT,
        status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed'))
    );

    -- 2. Enable RLS (Security)
    ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

    -- 3. Create Policy: Allow public to INSERT (Book appointments)
    CREATE POLICY "Allow public booking" 
    ON public.bookings 
    FOR INSERT 
    WITH CHECK (true);

    -- 4. Create Policy: Allow public to VIEW their own slot (Basic check to prevent double booking)
    -- Note: This is a simple implementation. For strict privacy, you would use a server-side check.
    CREATE POLICY "Allow public to read taken slots" 
    ON public.bookings 
    FOR SELECT 
    USING (true);
    ```

2.  **Testimonial submissions table:**
    *   **Action:** Run the migration in [`supabase/migrations/20260521120000_testimonial_submissions.sql`](../supabase/migrations/20260521120000_testimonial_submissions.sql) in the Supabase SQL Editor (creates `testimonial_submissions` with RLS: public insert with consent, authenticated read/update).
    *   **Share link:** `https://your-domain.com/share-your-story`
    *   **Review submissions:** Admin → `/admin/testimonials` (requires Supabase Auth login).

### Phase 3: Code Adjustments

1.  **Supabase Client Path:**
    *   Locate where the Supabase client is initialized (likely `utils/supabase/client.ts` or similar).
    *   **Action:** Verify it is using `import.meta.env.VITE_SUPABASE_URL`. If it is using hardcoded strings or old process.env, refactor it to use Vite env variables.

### Phase 4: Verification

1.  **Run Server:**
    *   **Action:** Ask the user: "Would you like me to start the development server now?"
    *   Run: `npm run dev`
