import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export interface SchedulerSettings {
  totalSlots: number;
  holidays: number[];
}

let globalServerScheduler: SchedulerSettings = {
  totalSlots: 5,
  holidays: [],
};

const DEFAULT_SUPABASE_URL = "https://sqmapdcfyhnpjnjjeary.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxbWFwZGNmeWhucGpuamplYXJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgwMjg2MiwiZXhwIjoyMTAwMzc4ODYyfQ.RQT8QJg3D2OoXp6lOxwPcKi5faFM_VzmB5xWDv0CPSY";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/scheduler — fetch global totalSlots & holidays from Supabase
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      // 1. Universal Config Fallback inside Supabase orders table
      try {
        const { data: configRow } = await supabase
          .from("orders")
          .select("brief_text")
          .eq("id", "_config_scheduler")
          .maybeSingle();

        if (configRow && configRow.brief_text) {
          const parsed = JSON.parse(configRow.brief_text);
          if (parsed && typeof parsed.totalSlots === "number" && parsed.totalSlots > 0) {
            globalServerScheduler = {
              totalSlots: Number(parsed.totalSlots) || 5,
              holidays: Array.isArray(parsed.holidays) ? parsed.holidays : [],
            };
            return NextResponse.json({ settings: globalServerScheduler, source: "supabase_kv" });
          }
        }
      } catch {}

      // 2. Try dedicated scheduler_settings table
      try {
        const { data, error } = await supabase.from("scheduler_settings").select("*").eq("id", "main").maybeSingle();
        if (!error && data) {
          const settings: SchedulerSettings = {
            totalSlots: Number(data.total_slots ?? data.totalSlots) || 5,
            holidays: Array.isArray(data.holidays) ? data.holidays : typeof data.holidays === "string" ? JSON.parse(data.holidays) : [],
          };
          globalServerScheduler = settings;
          return NextResponse.json({ settings, source: "supabase_table" });
        }
      } catch {}
    }
  } catch (err) {
    console.warn("Supabase scheduler fetch notice:", err);
  }

  return NextResponse.json({ settings: globalServerScheduler, source: "memory" });
}

// POST /api/scheduler — save global totalSlots & holidays set by Admin to Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { totalSlots, holidays } = body;

    const settings: SchedulerSettings = {
      totalSlots: Number(totalSlots) > 0 ? Number(totalSlots) : 5,
      holidays: Array.isArray(holidays) ? holidays : [],
    };

    globalServerScheduler = settings;

    const supabase = getSupabaseClient();
    if (supabase) {
      // 1. Universal Config Save inside Supabase orders table
      try {
        await supabase.from("orders").upsert({
          id: "_config_scheduler",
          code: "_SYSTEM_CONFIG_",
          official_code: "_SYSTEM_CONFIG_",
          temp_code: "_SYSTEM_CONFIG_",
          customer_name: "SYSTEM_CONFIG",
          brief_text: JSON.stringify(settings),
          created_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn("Supabase scheduler KV save notice:", e);
      }

      // 2. Try dedicated table if exists
      try {
        await supabase.from("scheduler_settings").upsert({
          id: "main",
          total_slots: settings.totalSlots,
          holidays: settings.holidays,
          updated_at: new Date().toISOString(),
        });
      } catch {}
    }

    return NextResponse.json({ success: true, settings: globalServerScheduler });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update scheduler settings" }, { status: 500 });
  }
}
