import { NextResponse } from "next/server";
import { google } from "googleapis";

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

    return NextResponse.json({
      ok: true,
      message: "Access token refreshed successfully",
      expiresIn: res.res?.data?.expires_in ?? null
    });
  } catch (error) {
    console.error("Keep-alive failed:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
