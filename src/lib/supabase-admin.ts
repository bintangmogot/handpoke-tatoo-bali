import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase admin credentials missing. Please set SUPABASE_SERVICE_ROLE_KEY in .env.local");
}

// This client bypasses RLS, so it MUST ONLY BE USED ON THE SERVER (API routes, Server Actions, Server Components).
// NEVER expose this to the browser.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
