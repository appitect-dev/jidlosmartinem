import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClientGoogleDoc } from "@/lib/google-docs";
import { sendDiscordAlert } from "@/lib/alerts";

/**
 * Admin endpoint to backfill missing Google Docs for existing dotazník records
 * This will recreate Google Docs for all records (or specific ones)
 */
export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    // Authentication
    const auth = req.headers.get("Authorization");
    if (auth !== `Bearer ${process.env.BACKFILL_SECRET}`) {
      await sendDiscordAlert("🔴 **Backfill Unauthorized Access Attempt**");
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    console.log("🚀 Starting Google Docs backfill process...");

    // Optional: Get specific sessionIds from request body
    const body = await req.json().catch(() => ({}));
    const { sessionIds, limit } = body as { sessionIds?: string[]; limit?: number };

    // Build query - only records from 2025-10-26 onwards
    const cutoffDate = new Date('2025-10-26T00:00:00Z');
    
    const query: { 
      sessionId?: { in: string[] };
      createdAt: { gte: Date };
    } = {
      createdAt: { gte: cutoffDate },
      ...(sessionIds && sessionIds.length > 0 ? { sessionId: { in: sessionIds } } : {})
    };

    // Fetch records to backfill
    const records = await prisma.dotaznik.findMany({
      where: query,
      take: limit || undefined,
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Found ${records.length} records to process`);

    const results = {
      total: records.length,
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Process each record
    for (const record of records) {
      try {
        console.log(`Processing sessionId: ${record.sessionId}`);
        
        const result = await createClientGoogleDoc(record.sessionId);

        if (result.success) {
          results.success++;
          console.log(`✅ Created doc for ${record.email}: ${result.documentUrl}`);
        } else {
          results.failed++;
          results.errors.push(`${record.sessionId}: ${result.error}`);
          console.error(`❌ Failed to create doc for ${record.email}: ${result.error}`);
        }

      } catch (error) {
        results.failed++;
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`${record.sessionId}: ${errorMsg}`);
        console.error(`💥 Exception for record ${record.sessionId}:`, error);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Send completion alert
    await sendDiscordAlert(
      `📄 **Google Docs Backfill Complete**\n` +
      `Total: ${results.total}\n` +
      `✅ Success: ${results.success}\n` +
      `❌ Failed: ${results.failed}\n` +
      `Duration: ${duration}s`
    );

    return NextResponse.json({
      ok: true,
      ...results,
      duration: `${duration}s`
    });

  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error("💥 Backfill process crashed:", error);

    await sendDiscordAlert(
      `🔴 **Google Docs Backfill Crashed**\n` +
      `${error instanceof Error ? error.message : 'Unknown error'}\n` +
      `Duration: ${duration}s`
    );

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
