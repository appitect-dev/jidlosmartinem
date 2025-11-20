import { NextResponse } from "next/server";
import { google } from "googleapis";
import { sendDiscordAlert } from "@/lib/alerts";

export async function GET() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI!;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN!;

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    oauth2Client.setCredentials({ refresh_token: refreshToken });

    // This refreshes the access token → makes Google treat refresh token as active
    const res = await oauth2Client.getAccessToken();

    const expiresIn = res.res?.data?.expires_in ?? 0;
    const expiresInMinutes = Math.floor(expiresIn / 60);

    // ✅ Success alert to Discord
    await sendDiscordAlert(
      `💚 **Google Keep-Alive Success**\nAccess token refreshed successfully.\nExpires in: ${expiresInMinutes} minutes (${expiresIn}s)`
    );

    return NextResponse.json({
      ok: true,
      message: "Access token refreshed successfully",
      expiresIn
    });
  } catch (error) {
    console.error("Keep-alive failed:", error);

    // ❌ Error alert to Discord
    await sendDiscordAlert(
      `🔴 **Google Keep-Alive Failed**\n${error instanceof Error ? error.message : 'Unknown error'}`
    );

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
