import { createClient } from "@supabase/supabase-js";

// المفتاح هنا هو المفتاح العام (publishable) ومصمم ليظهر في المتصفح.
// الحماية الحقيقية تأتي من سياسات RLS في ملف supabase/schema.sql.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jetxkhyvcxuxvheastlr.supabase.co";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_KEY || "sb_publishable_ubU3voY3OYZr10bVmyB6HA_07Djetpw";
export const BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "Twix";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
