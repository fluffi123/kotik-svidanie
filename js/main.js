import { initInvite } from "./invite.js";
import { notify, readCommand, enabled } from "./backend.js";
import { STAGES, stageById } from "./content.js";
import * as quiz from "./stages/quiz.js";
import * as deck from "./stages/deck.js";
import * as form from "./stages/form.js";
import * as match from "./stages/match.js";
import { initScenes } from "./scenes.js";

const ENGINES = { quiz, deck, form, match };
const $ = id => document.getElementById(id);
const views = { invite: $("invite"), hub: $("hub"), play: $("play") };

/* ---------- the start signal: you write «поехали» to the bot ---------- */
const GO = "kotik.go";
const store = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };
const read = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
let started = !enabled || read(GO) === "1";
let polling = null;

async function checkSignal() {
  let cmd = null;
  try { cmd = await readCommand(); } catch (e) { return; }
  const was = started;
  if (cmd === "go") { started = true; store(GO, "1"); }
  if (cmd === "stop") { started = false; store(GO, null); store("kotik.goNotified", null); }
  if (started === was) return;
  if (started && !read("kotik.goNotified")) {
    store("kotik.goNotified", "1");
    send("🚀 Этапы у неё открылись");
  }
  if (!views.hub.hidden) { renderHub(); if (started) hearts($("stageList")); }
  if (!started && !views.play.hidden) location.hash = "hub";
}
// polls only while the hub is on screen, so a closed tab costs nothing
function syncPolling() {
  const want = enabled && !views.hub.hidden;
  if (want && !polling) { checkSignal(); polling = setInterval(checkSignal, 4000); }
  if (!want && polling) { clearInterval(polling); polling = null; }
}

/* ---------- unlocking by a question about us ---------- */
const KEY = "kotik.unlocked";
const norm = w => w.toLowerCase().replace(/ё/g, "е").replace(/[^a-zа-я0-9]/g, "");
function unlockedIds() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
}
function markUnlocked(id) {
  try { localStorage.setItem(KEY, JSON.stringify([...new Set([...unlockedIds(), id])])); } catch (e) {}
}
const sessionUnlocked = new Set(); // keeps working when storage is blocked
const isOpen = s => !s.unlock || sessionUnlocked.has(s.id) || unlockedIds().includes(s.id);
// any answer counts while the list is empty; otherwise the answer has to contain one of the variants
function accepts(s, value) {
  const v = norm(value), variants = (s.unlock.answers || []).map(norm).filter(Boolean);
  return !!v && (!variants.length || variants.some(a => v.includes(a)));
}

/* ---------- messages to Telegram ---------- */
function describe(s, data) {
  if (s.type === "quiz") {
    const lines = data.answers.map(a => `• ${a.q}\n   ${a.a}${a.ok === true ? " ✅" : a.ok === false ? " ❌" : ""}`);
    return `🧠 ${s.title}\nРезультат: ${data.score} из ${data.total}\n\n${lines.join("\n")}`;
  }
  if (s.type === "match") {
    const lines = data.answers.map(a => `${a.same ? "✅" : "💬"} ${a.q}\n   она: ${a.her}\n   ты: ${a.his}`);
    return `💞 ${s.title}\nСовпали в ${data.matches} из ${data.total}\n\n${lines.join("\n")}`;
  }
  if (s.type === "form") {
    const lines = s.fields.filter(f => data[f.id] != null).map(f =>
      `${f.label}\n${f.type === "hearts" ? "❤️".repeat(data[f.id]) + "🤍".repeat(5 - data[f.id]) : data[f.id]}`);
    return `📝 ${s.title}\n\n${lines.join("\n\n")}`;
  }
  return `${s.title}\n${JSON.stringify(data)}`;
}
const send = text => notify(text).then(() => true, () => false);

function showView(name) {
  Object.entries(views).forEach(([k, el]) => el.hidden = k !== name);
  scrollTo(0, 0);
  syncPolling();
}

function renderHub() {
  const list = $("stageList");
  list.innerHTML = "";
  if (!started) {
    list.innerHTML = `
      <li class="waiting">
        <b>Котики ждут сигнала</b>
        <span>Этапы откроются, когда начнётся наше свидание. Не закрывай страницу.</span>
        <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
      </li>`;
    return;
  }
  STAGES.forEach((s, i) => {
    const open = isOpen(s);
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="stage-item${open ? "" : " locked"}" type="button" ${open ? "" : "disabled"}>
        <span class="stage-num">${i + 1}</span>
        <span class="stage-text"><b></b><small></small></span>
        <span class="pill">${open ? "открыто" : "закрыто"}</span>
      </button>`;
    li.querySelector("b").textContent = s.title;
    li.querySelector("small").textContent = open ? s.desc : "Ответь на вопрос, и котик откроет этап";
    li.querySelector("button").addEventListener("click", () => { location.hash = "stage-" + s.id; });
    if (!open) li.appendChild(unlockForm(s));
    list.appendChild(li);
  });
}

function unlockForm(s) {
  const f = document.createElement("form");
  f.className = "unlock";
  f.innerHTML = `
    <label class="unlock-q" for="w-${s.id}"></label>
    <input id="w-${s.id}" type="text" placeholder="твой ответ" autocomplete="off" enterkeyhint="go">
    <button class="btn yes" type="submit">Открыть</button>
    <p class="note" aria-live="polite"></p>`;
  f.querySelector(".unlock-q").textContent = s.unlock.q;
  f.addEventListener("submit", e => {
    e.preventDefault();
    const input = f.querySelector("input");
    if (accepts(s, input.value)) {
      sessionUnlocked.add(s.id);
      markUnlocked(s.id);
      send(`🔓 Она открыла этап «${s.title}»
${s.unlock.q}
Её ответ: ${input.value.trim()}`);
      renderHub();
      hearts($("stageList"));
    } else {
      f.querySelector(".note").textContent = "Котик помнит иначе. Попробуй ещё раз";
      input.classList.remove("shake"); input.offsetWidth; input.classList.add("shake");
    }
  });
  return f;
}

function openStage(id) {
  const s = stageById(id);
  if (!s || !started || !isOpen(s)) return;
  showView("play");
  const body = $("playBody");
  ENGINES[s.type].render(body, s, {
    back: () => { location.hash = "hub"; },
    save: data => send(describe(s, data)).then(ok =>
      ok ? "Котики уже доставили ответ" : enabled ? "Не получилось отправить, покажи этот экран мне" : ""),
    celebrate: () => hearts(body),
  });
}

function hearts(root) {
  const colors = ["var(--pink)", "var(--pink-d)", "var(--lilac-d)", "#f3c64e", "#8fd3b6"];
  const r = root.getBoundingClientRect();
  for (let i = 0; i < 20; i++) {
    const s = document.createElement("span");
    s.className = "burst fixed";
    s.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z"/></svg>';
    s.style.color = colors[i % colors.length];
    s.style.left = r.left + r.width / 2 + "px"; s.style.top = Math.max(80, r.top + 60) + "px";
    document.body.appendChild(s);
    const a = Math.random() * Math.PI * 2, d = 80 + Math.random() * 140;
    s.animate([{ transform: "scale(.4)", opacity: 1 },
      { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d - 40}px) scale(1.3)`, opacity: 0 }],
      { duration: 1300, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" }).finished.then(() => s.remove());
  }
}

// mini cats on the hub reuse the courier's drawing
function drawHubCats() {
  const svg = document.querySelector("#cat .catbody svg").outerHTML;
  $("hubCats").innerHTML = `<div class="mini-cat">${svg}</div><div class="mini-cat grey flipped">${svg}</div>`;
  initScenes($("hubCats"), $("sceneCaption"));
}

const invite = initInvite({
  sendLetter: ({ where, wish }) => send(
    "💌 Письмо от неё\n\n" + [where && "Куда пойдём: " + where, wish && "Пожелания: " + wish].filter(Boolean).join("\n\n")),
  goHub: () => { location.hash = "hub"; },
});

$("replay").addEventListener("click", () => { location.hash = "invite"; });
$("back").addEventListener("click", () => { location.hash = "hub"; });

function route() {
  const h = location.hash.slice(1);
  let sent = false;
  try { sent = localStorage.getItem("kotik.letterSent") === "1"; } catch (e) {}
  if (h === "invite") { showView("invite"); invite.restart(); return; }
  if (h.startsWith("stage-") && stageById(h.slice(6))) { openStage(h.slice(6)); if (!views.play.hidden) return; }
  if (h === "hub" || (sent && !h)) { renderHub(); showView("hub"); return; }
  showView("invite");
}

drawHubCats();
addEventListener("hashchange", route);
route();
