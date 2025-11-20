import { NextResponse } from "next/server";
import { sendDiscordAlert } from "@/lib/alerts";

export async function GET() {
  try {
    await sendDiscordAlert("🚨 **Test Discord alert** – funguje!");
    return NextResponse.json({ ok: true, message: "Test alert odeslán na Discord" });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
