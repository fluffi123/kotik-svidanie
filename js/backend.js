// Answers go to a Telegram chat through the Bot API.
// The request is a plain form POST, so the browser sends it without a CORS preflight.
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from "../config.js";

export const enabled = !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);

// Reads what you last wrote to the bot: "go" for «поехали», "stop" for «стоп», null if neither.
// No offset is passed, so updates stay on Telegram's side (it keeps them for about a day)
// and every open copy of the site sees the same messages.
export async function readCommand() {
  if (!enabled) return null;
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`, {
    method: "POST",
    body: new URLSearchParams({ allowed_updates: '["message"]' }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.description || "telegram error");
  let command = null;
  for (const u of json.result) {
    const m = u.message;
    if (!m || String(m.chat.id) !== String(TELEGRAM_CHAT_ID) || !m.text) continue;
    const t = m.text.toLowerCase().replace(/ё/g, "е");
    if (t.includes("поехали")) command = "go";
    else if (t.includes("стоп")) command = "stop";
  }
  return command;
}

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
