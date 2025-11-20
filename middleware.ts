import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sendDiscordAlert } from '@/lib/alerts';

// Global error handlers for unhandled errors
if (typeof process !== 'undefined') {
  process.on('unhandledRejection', (reason) => {
    console.error('🚨 Unhandled Rejection:', reason);
    sendDiscordAlert(`Unhandled Rejection:\n${reason}`).catch(console.error);
  });

  process.on('uncaughtException', (err) => {
    console.error('🚨 Uncaught Exception:', err);
    sendDiscordAlert(`Uncaught Exception:\n${err.message}\n${err.stack}`).catch(console.error);
  });
}

// Middleware function (optional - can add request logging here)
export function middleware(request: NextRequest) {
  // You can add request logging or other middleware logic here
  return NextResponse.next();
}

// Configure which paths middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
