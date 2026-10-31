import { fb, enabled } from "./backend.js";
import { ADMIN_EMAIL } from "../config.js";
import { STAGES, stageById } from "./content.js";

const $ = id => document.getElementById(id);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

if (!enabled) {
  $("noConfig").hidden = false;
} else {
  start();
}

async function start() {
  const { fs, db, auth, authInst } = await fb();
  let stops = [];

  $("login").addEventListener("submit", async e => {
    e.preventDefault();
    $("loginError").textContent = "";
    try {
      await auth.signInWithEmailAndPassword(authInst, $("email").value.trim(), $("password").value);
    } catch (err) {
      $("loginError").textContent = "Не получилось войти: проверь почту и пароль";
    }
  });
  $("logout").addEventListener("click", () => auth.signOut(authInst));

  auth.onAuthStateChanged(authInst, user => {
    stops.forEach(s => s()); stops = [];
    $("login").hidden = !!user;
    $("panel").hidden = !user;
    if (!user) return;
    $("who").textContent = user.email + (ADMIN_EMAIL && user.email !== ADMIN_EMAIL ? " (не совпадает с ADMIN_EMAIL в config.js)" : "");
    stops.push(watchToggles(fs, db), watchFeed(fs, db));
  });
}

function watchToggles(fs, db) {
  const ref = fs.doc(db, "config", "state");
  let unlocked = {};
  const list = $("toggles");
  const draw = () => {
    list.innerHTML = "";
    STAGES.forEach(s => {
      const li = el("li", "toggle");
      const text = el("div");
      text.append(el("b", null, s.title), el("small", null, s.open ? "открыт всегда" : s.desc));
      const sw = el("button", "switch");
      sw.type = "button";
      sw.setAttribute("role", "switch");
      sw.setAttribute("aria-label", s.title);
      sw.setAttribute("aria-checked", String(!!(s.open || unlocked[s.id])));
      sw.disabled = !!s.open;
      sw.addEventListener("click", async () => {
        sw.disabled = true;
        try { await fs.setDoc(ref, { unlocked: { ...unlocked, [s.id]: !unlocked[s.id] } }, { merge: true }); }
        catch (e) { alertOnce("Не получилось переключить: проверь правила Firestore и ADMIN_EMAIL"); }
        sw.disabled = false;
      });
      li.append(text, sw);
      list.appendChild(li);
    });
  };
  draw();
  return fs.onSnapshot(ref, snap => { unlocked = (snap.exists() && snap.data().unlocked) || {}; draw(); });
}

function watchFeed(fs, db) {
  const q = fs.query(fs.collection(db, "answers"), fs.orderBy("createdAt", "desc"), fs.limit(100));
  return fs.onSnapshot(q, snap => {
    const feed = $("feed");
    feed.innerHTML = "";
    if (snap.empty) { feed.appendChild(el("p", "empty", "Пока пусто. Котики ждут.")); return; }
    snap.forEach(d => feed.appendChild(entry(fs, d)));
  }, () => {
    $("feed").innerHTML = "";
    $("feed").appendChild(el("p", "warn", "Нет доступа к ответам: проверь, что почта в firestore.rules совпадает с твоей."));
  });
}

function entry(fs, d) {
  const { stage, data = {}, createdAt } = d.data();
  const s = stageById(stage);
  const box = el("article", "entry");
  const head = el("header");
  head.append(el("b", null, stage === "letter" ? "Письмо с пожеланиями" : s ? s.title : stage),
              el("time", null, createdAt ? createdAt.toDate().toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : "только что"));
  box.appendChild(head);

  if (stage === "letter") {
    box.appendChild(el("p", "txt", [data.where && "Куда пойдём: " + data.where, data.wish && "Пожелания: " + data.wish].filter(Boolean).join("\n")));
  } else if (s && s.type === "quiz") {
    box.appendChild(el("p", "txt", `Результат: ${data.score} из ${data.total}`));
    const ol = el("ol");
    (data.answers || []).forEach(a => ol.appendChild(el("li", null, `${a.q} → ${a.a}${a.ok === true ? " ✓" : a.ok === false ? " ✗" : ""}`)));
    box.appendChild(ol);
  } else if (s && s.type === "form") {
    const lines = s.fields.filter(f => data[f.id] != null).map(f =>
      f.label + " " + (f.type === "hearts" ? "♥".repeat(data[f.id]) + "♡".repeat(5 - data[f.id]) : data[f.id]));
    box.appendChild(el("p", "txt", lines.join("\n")));
  } else {
    box.appendChild(el("p", "txt", JSON.stringify(data, null, 2)));
  }

  const del = el("button", "link del", "удалить");
  del.type = "button";
  let armed = false;
  del.addEventListener("click", async () => {
    if (!armed) { armed = true; del.textContent = "точно удалить?"; setTimeout(() => { armed = false; del.textContent = "удалить"; }, 3000); return; }
    await fs.deleteDoc(d.ref).catch(() => {});
  });
  box.appendChild(del);
  return box;
}

let alerted = false;
function alertOnce(msg) {
  if (alerted) return;
  alerted = true;
  const p = el("p", "warn", msg);
  $("panel").prepend(p);
}
