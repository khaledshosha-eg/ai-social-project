import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

/**
 * App-level Supabase client. Uses the same env vars as `@/integrations/supabase/client`.
 *
 * ```ts
 * import { supabase } from '@/lib/supabaseClient';
 * ```
 */
export const supabase = createClient<Database>(SUPABASE_URL ?? '', SUPABASE_KEY ?? '', {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
