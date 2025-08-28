import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json({ 
      error: `Authorization failed: ${error}` 
    }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ 
      error: 'No authorization code provided' 
    }, { status: 400 });
  }

  try {
    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    return NextResponse.json({
      success: true,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      message: 'Authorization successful!',
      instructions: [
        '1. Copy the refresh_token below',
        '2. Add it to your Vercel environment variables as: GOOGLE_REFRESH_TOKEN',
        '3. Redeploy your application',
        '4. Test the Google Docs integration'
      ],
      next_steps: 'After setting GOOGLE_REFRESH_TOKEN, your Google Docs integration will be ready!'
    });
  } catch (error) {
    console.error('Error getting tokens:', error);
    return NextResponse.json({ 
      error: 'Failed to exchange authorization code for tokens',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
