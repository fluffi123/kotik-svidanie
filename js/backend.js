// Answers go to a Telegram chat through the Bot API.
// The request is a plain form POST, so the browser sends it without a CORS preflight.
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from "../config.js";

export const enabled = !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);

export async function notify(text) {
  if (!enabled) throw new Error("not configured");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      body: new URLSearchParams({ chat_id: TELEGRAM_CHAT_ID, text: text.slice(0, 4000) }),
      signal: ctrl.signal,
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.description || "telegram error");
  } finally {
    clearTimeout(timer);
  }
}
