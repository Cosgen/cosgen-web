import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export interface SchedulerSettings {
  totalSlots: number;
  holidays: number[];
}

let globalServerScheduler: SchedulerSettings = {
  totalSlots: 25,
  holidays: [],
};

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/scheduler — fetch global totalSlots & holidays set by Admin
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from("scheduler_settings").select("*").eq("id", "main").single();
      if (!error && data) {
        const settings: SchedulerSettings = {
          totalSlots: Number(data.total_slots ?? data.totalSlots) || 25,
          holidays: Array.isArray(data.holidays) ? data.holidays : typeof data.holidays === "string" ? JSON.parse(data.holidays) : [],
        };
        globalServerScheduler = settings;
        return NextResponse.json({ settings, source: "supabase" });
      }
    }
  } catch (err) {
    console.warn("Supabase scheduler fetch notice:", err);
  }

  return NextResponse.json({ settings: globalServerScheduler, source: "memory" });
}

// POST /api/scheduler — save global totalSlots & holidays set by Admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { totalSlots, holidays } = body;

    const settings: SchedulerSettings = {
      totalSlots: Number(totalSlots) || 25,
      holidays: Array.isArray(holidays) ? holidays : [],
    };

    globalServerScheduler = settings;

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from("scheduler_settings").upsert({
          id: "main",
          total_slots: settings.totalSlots,
          holidays: settings.holidays,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn("Supabase scheduler upsert notice:", e);
      }
    }

    return NextResponse.json({ success: true, settings: globalServerScheduler });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update scheduler settings" }, { status: 500 });
  }
}
