import { sendDiscordAlert } from '@/lib/alerts';

export async function register() {
  // Global error handlers for unhandled errors
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    process.on('unhandledRejection', (reason) => {
      console.error('🚨 Unhandled Rejection:', reason);
      sendDiscordAlert(`Unhandled Rejection:\n${reason}`).catch(console.error);
    });

    process.on('uncaughtException', (err) => {
      console.error('🚨 Uncaught Exception:', err);
      sendDiscordAlert(`Uncaught Exception:\n${err.message}\n${err.stack}`).catch(console.error);
    });
  }
}