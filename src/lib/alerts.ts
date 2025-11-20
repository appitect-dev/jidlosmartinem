export async function sendDiscordAlert(message: string) {
  try {
    if (!process.env.DISCORD_WEBHOOK_URL) {
      console.error("Discord webhook not configured");
      return;
    }

    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🚨 **Jídlo s Martinem – ERROR**\n${message}`
      })
    });
  } catch (err) {
    console.error("Failed to send Discord alert:", err);
  }
}
