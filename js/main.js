import { initInvite } from "./invite.js";
import { saveAnswer, watchUnlocked, enabled } from "./backend.js";
import { STAGES, stageById } from "./content.js";
import * as quiz from "./stages/quiz.js";
import * as deck from "./stages/deck.js";
import * as form from "./stages/form.js";

const ENGINES = { quiz, deck, form };
const $ = id => document.getElementById(id);
const views = { invite: $("invite"), hub: $("hub"), play: $("play") };
let unlocked = enabled ? {} : null; // null = no backend, everything open

function showView(name) {
  Object.entries(views).forEach(([k, el]) => el.hidden = k !== name);
  scrollTo(0, 0);
}

const isOpen = s => s.open || unlocked === null || !!unlocked[s.id];

function renderHub() {
  const list = $("stageList");
  list.innerHTML = "";
  STAGES.forEach((s, i) => {
    const open = isOpen(s);
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="stage-item${open ? "" : " locked"}" type="button" ${open ? "" : "disabled"}>
        <span class="stage-num">${i + 1}</span>
        <span class="stage-text"><b></b><small></small></span>
        <span class="pill">${open ? "открыто" : "котик спит"}</span>
      </button>`;
    li.querySelector("b").textContent = s.title;
    li.querySelector("small").textContent = open ? s.desc : "Откроется во время прогулки";
    li.querySelector("button").addEventListener("click", () => { location.hash = "stage-" + s.id; });
    list.appendChild(li);
  });
}

function openStage(id) {
  const s = stageById(id);
  if (!s || !isOpen(s)) return;
  showView("play");
  const body = $("playBody");
  ENGINES[s.type].render(body, s, {
    back: () => { location.hash = "hub"; },
    save: data => saveAnswer(s.id, data).then(
      () => "Котики уже доставили ответ",
      () => enabled ? "Не получилось отправить, покажи этот экран мне" : ""),
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
}

const invite = initInvite({
  sendLetter: data => saveAnswer("letter", data).then(() => true, () => false),
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
watchUnlocked(u => { unlocked = u; if (!views.hub.hidden) renderHub(); });
