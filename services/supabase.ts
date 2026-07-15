import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ftwxsunkkelgnikdxtpt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0d3hzdW5ra2VsZ25pa2R4dHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMzc1MTIsImV4cCI6MjA5OTYxMzUxMn0.X1m98LattCnlKVyIHlDmp0eBx4pOEoYL581lXFZnQaY";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);