import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://glopcmhtipfupjcifqly.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_KEY as string)

export default supabase