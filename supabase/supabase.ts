import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* - Cliente com persistência de sessão: "Lembre-me" marcado - */

const supabase = createClient(url, key);

/* - Cliente sem persistência de sessão: "Lembre-me" desmarcado - */

const supabaseTemp = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export { supabase, supabaseTemp };
