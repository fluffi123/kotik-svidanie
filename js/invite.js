// The invitation: scratch card, runaway "no", the letter, the clumsy courier cat.
// sendLetter(data) resolves true when the letter reached the backend; goHub() leaves for the stages.
export function initInvite({ sendLetter, goHub }) {
  const $ = id => document.getElementById(id);
  const stage = $("stage"), say = $("say"), card = $("card"), canvas = $("scratch");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const T = t => reduced ? t * 0.35 : t;
  const wait = t => new Promise(r => setTimeout(r, T(t)));
  const HEART = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z"/></svg>';
  const MOUTH = 0.74; // mouth position as a share of cat width, when facing right

  function play(el, frames, opts) {
    const a = el.animate(frames, { fill: "forwards", easing: "ease", ...opts, duration: T(opts.duration) });
    return a.finished.then(() => a);
  }
  function speak(text) {
    say.style.opacity = 0;
    setTimeout(() => { say.textContent = text; say.style.opacity = 1; }, 200);
  }
  function rectIn(el) {
    const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height };
  }
  const W = () => stage.clientWidth;

  /* ---------- cats ---------- */
  function makeCat(wrap) {
    const c = {
      el: wrap, flip: wrap.querySelector(".catflip"), body: wrap.querySelector(".catbody"),
      carry: wrap.querySelector(".carry"), stars: wrap.querySelector(".stars"), x: 0, dir: "right",
      get w() { return wrap.offsetWidth; },
      place(x) { c.x = x; wrap.style.transform = `translateX(${x}px)`; },
      face(dir) { c.dir = dir; c.flip.style.transform = dir === "left" ? "scaleX(-1)" : "scaleX(1)"; },
      hold(kind) { c.carry.innerHTML = kind ? $(kind === "paper" ? "tplPaper" : "tplEnv").innerHTML : ""; },
      // x for the cat so that its mouth lands on stage x `mx`
      mouthAt(mx, dir) { return mx - c.w * (dir === "left" ? 1 - MOUTH : MOUTH); },
      async walkTo(x, speed = 170) {
        const dist = Math.abs(x - c.x);
        if (dist < 1) return;
        c.face(x < c.x ? "left" : "right");
        wrap.classList.add("walking");
        const a = await play(wrap, [{ transform: `translateX(${c.x}px)` }, { transform: `translateX(${x}px)` }],
          { duration: dist / speed * 1000, easing: "linear" });
        c.place(x); a.cancel();
        wrap.classList.remove("walking");
      }
    };
    return c;
  }
  const cat = makeCat($("cat"));
  const greyWrap = $("cat").cloneNode(true);
  greyWrap.removeAttribute("id"); greyWrap.classList.add("grey"); greyWrap.hidden = true;
  stage.appendChild(greyWrap);
  const grey = makeCat(greyWrap);

  function fitStage(el) {
    stage.style.height = "";
    const base = stage.clientHeight;
    const need = el.offsetTop + el.offsetHeight + cat.el.offsetHeight * 0.9 + 14;
    if (need > base) stage.style.height = need + "px";
  }
  const toStage = () => stage.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });

  /* ---------- scratch card ---------- */
  const ctx = canvas.getContext("2d");
  let scratched = false, moves = 0, last = null;
  async function paintFoil() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w) return;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#d9cbf7"); g.addColorStop(.5, "#f8c3d6"); g.addColorStop(1, "#c3ebd9");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) {
      ctx.fillStyle = `rgba(255,255,255,${.25 + Math.random() * .5})`;
      ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2.4 + .6, 0, 7); ctx.fill();
    }
    try { await document.fonts.load('40px "Pacifico"'); } catch (e) {}
    ctx.fillStyle = "#5a4560"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = '38px "Pacifico", "Comic Sans MS", cursive';
    ctx.fillText("сотри меня", w / 2, h / 2 - 8);
    ctx.font = '700 15px "Nunito", sans-serif';
    ctx.globalAlpha = .7; ctx.fillText("пальчиком или мышкой", w / 2, h / 2 + 34); ctx.globalAlpha = 1;
  }
  function scratchAt(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 42; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(last ? last.x : x, last ? last.y : y); ctx.lineTo(x, y); ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
    last = { x, y };
    if (++moves % 8 === 0) checkCleared();
  }
  function checkCleared() {
    const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0, total = 0;
    for (let i = 3; i < d.length; i += 64) { total++; if (d[i] < 128) clear++; }
    if (clear / total > 0.5) revealQuestion();
  }
  const pos = e => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  let down = false;
  canvas.addEventListener("pointerdown", e => { down = true; last = null; canvas.setPointerCapture(e.pointerId); const p = pos(e); scratchAt(p.x, p.y); });
  canvas.addEventListener("pointermove", e => { if (!down) return; const p = pos(e); scratchAt(p.x, p.y); });
  ["pointerup", "pointercancel"].forEach(t => canvas.addEventListener(t, () => { down = false; last = null; }));
  $("skip").addEventListener("click", revealQuestion);

  function revealQuestion() {
    if (scratched) return;
    scratched = true;
    canvas.style.opacity = 0; canvas.style.pointerEvents = "none";
    $("helper").hidden = true;
    $("answers").classList.add("on");
    speak("Ну что, согласна?");
  }

  /* ---------- runaway "no" ---------- */
  const no = $("no"), yes = $("yes");
  const pleas = ["Точно нет?", "Подумай ещё", "Котик расстроится", "Ну пожалуйста", "Последний шанс", "Ладно, да"];
  let dodges = 0;
  function dodge(e) {
    if (e) e.preventDefault();
    if (dodges >= pleas.length - 1) {
      if (no.textContent !== pleas[pleas.length - 1]) { no.textContent = pleas[pleas.length - 1]; no.style.background = "var(--pink)"; speak("Кнопка «нет» сдалась"); }
      return;
    }
    if (!no.classList.contains("loose")) {
      const r = rectIn(no);
      stage.appendChild(no); no.classList.add("loose");
      no.style.left = r.x + "px"; no.style.top = r.y + "px";
      no.offsetWidth;
    }
    no.textContent = pleas[dodges];
    dodges++;
    yes.style.transform = `scale(${1 + dodges * 0.14})`;
    const bw = no.offsetWidth, bh = no.offsetHeight;
    const maxX = Math.max(0, W() - bw), minY = 60, maxY = stage.clientHeight - bh - 150;
    let x, y, tries = 0;
    const yr = rectIn(yes);
    do {
      x = Math.random() * maxX; y = minY + Math.random() * (maxY - minY); tries++;
    } while (tries < 20 && x < yr.x + yr.w + 10 && x + bw > yr.x - 10 && y < yr.y + yr.h + 10 && y + bh > yr.y - 10);
    no.style.left = x + "px"; no.style.top = y + "px";
  }
  no.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") dodge(); });
  no.addEventListener("pointerdown", dodge);
  no.addEventListener("click", e => {
    if (no.textContent === pleas[pleas.length - 1]) onYes();
    else if (e.detail === 0) dodge(e); // keyboard press; pointer presses already dodged on pointerdown
  });
  yes.addEventListener("click", onYes);

  function burst(cx, cy, n = 18) {
    const colors = ["var(--pink)", "var(--pink-d)", "var(--lilac-d)", "#f3c64e", "#8fd3b6"];
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "burst"; s.innerHTML = HEART; s.style.color = colors[i % colors.length];
      s.style.left = cx - 11 + "px"; s.style.top = cy - 11 + "px";
      stage.appendChild(s);
      const ang = Math.random() * Math.PI * 2, d = 80 + Math.random() * 140;
      play(s, [{ transform: "translate(0,0) scale(.4)", opacity: 1 },
               { transform: `translate(${Math.cos(ang) * d}px, ${Math.sin(ang) * d - 40}px) scale(${.8 + Math.random()}) rotate(${Math.random() * 80 - 40}deg)`, opacity: 0 }],
        { duration: 1100 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" }).then(() => s.remove());
    }
  }

  /* ---------- story ---------- */
  let busy = false;
  async function onYes() {
    if (busy) return; busy = true;
    const yr = rectIn(yes);
    burst(yr.x + yr.w / 2, yr.y + yr.h / 2, 26);
    speak("Ура-а! Сейчас всё оформим…");
    $("answers").classList.remove("on");
    no.style.opacity = 0; no.style.pointerEvents = "none";
    await play(card, [{ transform: "scale(1)", opacity: 1 }, { transform: "scale(.6) rotate(-6deg)", opacity: 0 }], { duration: 500 });
    card.hidden = true; no.hidden = true;

    const letter = $("letter");
    letter.hidden = false; letter.style.visibility = "hidden";
    fitStage(letter);
    await wait(500);

    cat.hold("paper");
    cat.place(W() + 20);
    speak("Котик несёт тебе бумагу для письма");
    await cat.walkTo(cat.mouthAt(W() / 2, "left"), 150);
    await wait(400);

    // paper leaves the cat's mouth and becomes the letter
    const pr = rectIn(cat.carry);
    cat.hold(null);
    letter.style.visibility = "";
    const lr = rectIn(letter);
    const sx = pr.x + pr.w / 2 - (lr.x + lr.w / 2), sy = pr.y + pr.h / 2 - (lr.y + lr.h / 2);
    speak("Напиши, какой хочешь видеть нашу прогулку");
    await play(letter, [{ transform: `translate(${sx}px, ${sy}px) scale(.08) rotate(-10deg)`, opacity: .4 },
                        { transform: "translate(0,0) scale(1) rotate(0)", opacity: 1 }],
      { duration: 650, easing: "cubic-bezier(.3,1.4,.5,1)" });
    await cat.walkTo(W() - cat.w * 0.95, 140);
    cat.face("left");
    busy = false;
  }

  // quick ideas append to the wishes field
  document.querySelectorAll("#ideas .chip").forEach(c => c.addEventListener("click", () => {
    const t = $("wish"), v = t.value.trim();
    if (v.toLowerCase().includes(c.textContent)) return;
    t.value = v ? v.replace(/[,.\s]*$/, "") + ", " + c.textContent : c.textContent[0].toUpperCase() + c.textContent.slice(1);
    c.classList.add("added");
  }));

  let letterText = "", delivery = null;
  $("letter").addEventListener("submit", async e => {
    e.preventDefault();
    if (busy) return;
    const where = $("where").value.trim(), wish = $("wish").value.trim();
    if (!where && !wish) {
      const g = $("give"); g.classList.remove("shake"); g.offsetWidth; g.classList.add("shake");
      speak("Котик ждёт хотя бы пару слов");
      $("where").focus();
      return;
    }
    busy = true;
    if (document.activeElement) document.activeElement.blur();
    const lines = [];
    if (where) lines.push("Куда пойдём: " + where);
    if (wish) lines.push("Пожелания: " + wish);
    letterText = lines.join("\n");
    delivery = sendLetter({ where, wish }).catch(() => false);
    await wait(250);
    toStage();
    await sealAndSend();
  });

  async function sealAndSend() {
    const letter = $("letter"), env = $("bigenv"), flap = $("flap"), seal = $("seal");
    speak("Складываем…");
    await play(letter, [{ transform: "scale(1)", opacity: 1 }, { transform: "scale(.5, .2) translateY(260px)", opacity: 0 }], { duration: 550, easing: "ease-in" });
    letter.hidden = true;
    stage.style.height = "";
    env.hidden = false;
    flap.style.transform = "scaleY(-1)";
    await play(env, [{ transform: "scale(.4)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 400, easing: "cubic-bezier(.3,1.5,.5,1)" });
    const fa = await play(flap, [{ transform: "scaleY(-1)" }, { transform: "scaleY(1)" }], { duration: 500, easing: "ease-in-out" });
    flap.style.transform = "scaleY(1)"; fa.cancel();
    seal.style.transformBox = "fill-box"; seal.style.transformOrigin = "50% 50%";
    await play(seal, [{ opacity: 0, transform: "scale(2)" }, { opacity: 1, transform: "scale(1)" }], { duration: 300, easing: "cubic-bezier(.3,1.6,.5,1)" });
    const er = rectIn(env);
    burst(er.x + er.w / 2, er.y + er.h * 0.7, 10);
    speak("Запечатано! Котик, забирай");
    await wait(500);

    // cat comes under the envelope, the envelope drops into its mouth
    await cat.walkTo(cat.mouthAt(W() / 2, "left"), 160);
    cat.face("left");
    await wait(150);
    cat.hold("env");
    const cr = rectIn(cat.carry);
    cat.carry.style.visibility = "hidden";
    const e2 = rectIn(env);
    await play(env, [{ transform: "none" },
      { transform: `translate(${cr.x + cr.w / 2 - (e2.x + e2.w / 2)}px, ${cr.y + cr.h / 2 - (e2.y + e2.h / 2)}px) scale(${cr.w / e2.w}) rotate(-8deg)` }],
      { duration: 600, easing: "cubic-bezier(.5,0,.6,1)" });
    env.hidden = true;
    cat.carry.style.visibility = "";
    await wait(300);
    await kissScreen();
    speak("Очень важный котик несёт очень важное письмо");
    await wait(300);

    await cat.walkTo(Math.max(W() * 0.2, 30), 130);
    await trip();
  }

  // the cat puts the letter down, comes right up to the glass, kisses it and picks the letter up again
  async function kissScreen() {
    speak("Подожди, сначала самое важное…");
    const cr = rectIn(cat.carry);
    const mx = cr.x + cr.w / 2, my = cr.y + cr.h / 2;
    const env = document.createElement("div");
    env.className = "flyenv"; env.innerHTML = $("tplEnv").innerHTML;
    env.style.width = cr.w + "px"; env.style.left = cr.x + "px"; env.style.top = cr.y + "px";
    cat.hold(null);
    stage.appendChild(env);
    const ground = stage.clientHeight - 10 - cr.h - cr.y;
    await play(env, [{ transform: "none" }, { transform: `translate(${-cat.w * 0.4}px, ${ground}px) rotate(-12deg)` }], { duration: 450, easing: "ease-in" });
    await wait(250);

    const body = cat.body, lift = Math.min(120, stage.clientHeight * 0.2), near = `translateY(${-lift}px) scale(2.8)`;
    body.style.transformOrigin = "74% 58%"; // the face, in the cat's own (unflipped) drawing
    await play(body, [{ transform: "none" }, { transform: near }], { duration: 850, easing: "cubic-bezier(.4,0,.2,1)" });
    play(body, [{ transform: near }, { transform: `translateY(${-lift}px) scale(3.1, 2.6)` }, { transform: near }], { duration: 420 });
    await wait(200);
    const lips = document.createElement("div");
    lips.className = "kissmark";
    lips.innerHTML = `<svg viewBox="0 0 60 34"><g transform="rotate(-10 30 17)" fill="#e8638c" opacity=".85">
      <path d="M4 16 C10 6 20 2 30 10 C40 2 50 6 56 16 C44 18 16 18 4 16Z"/><path d="M4 17 C16 20 44 20 56 17 C48 30 12 30 4 17Z"/></g></svg>`;
    lips.style.left = mx - 55 + "px"; lips.style.top = my - lift - 30 + "px";
    stage.appendChild(lips);
    speak("Чмок!");
    play(lips, [{ transform: "scale(.3)", opacity: 0 }, { transform: "scale(1.15)", opacity: 1, offset: .6 }, { transform: "scale(1)", opacity: 1 }], { duration: 350, easing: "ease-out" });
    burst(mx, my - lift, 14);
    await wait(900);
    await play(body, [{ transform: near }, { transform: "none" }], { duration: 700, easing: "ease-in-out" });
    body.getAnimations().forEach(a => a.cancel());
    body.style.transformOrigin = "";
    play(lips, [{ opacity: 1 }, { opacity: 0 }], { duration: 1200, delay: 600 }).then(() => lips.remove());

    const er = rectIn(env);
    await cat.walkTo(cat.mouthAt(er.x + er.w / 2, "left"), 120);
    env.remove(); cat.hold("env");
    await wait(200);
  }

  async function trip() {
    const cr = rectIn(cat.carry);
    // envelope flies out ahead (to the left, the way the cat faces)
    const fly = document.createElement("div");
    fly.className = "flyenv"; fly.innerHTML = $("tplEnv").innerHTML;
    fly.style.width = cr.w + "px"; fly.style.left = cr.x + "px"; fly.style.top = cr.y + "px";
    cat.hold(null);
    stage.appendChild(fly);
    const groundY = stage.clientHeight - 10 - cr.h - cr.y;
    const ahead = -Math.min(cr.x - 4, cat.w * 0.7);
    speak("Ой!");
    const fall = play(cat.body, [
      { transform: "rotate(0)" },
      { transform: "rotate(-10deg)", offset: .2 },
      { transform: "rotate(40deg)", offset: .5 },
      { transform: "rotate(62deg) translateY(6px)", offset: .72 },
      { transform: "rotate(54deg)", offset: .86 },
      { transform: "rotate(60deg) translateY(4px)" }],
      { duration: 800, easing: "ease-in" });
    const flight = play(fly, [
      { transform: "translate(0,0) rotate(0)" },
      { transform: `translate(${ahead * 0.5}px, -110px) rotate(-200deg)`, offset: .45 },
      { transform: `translate(${ahead}px, ${groundY}px) rotate(-350deg)`, offset: .85 },
      { transform: `translate(${ahead}px, ${groundY - 10}px) rotate(-355deg)`, offset: .92 },
      { transform: `translate(${ahead}px, ${groundY}px) rotate(-360deg)` }],
      { duration: 1200, easing: "ease-out" });
    await fall;
    cat.stars.style.opacity = 1;
    await flight;
    speak("Ой-ой-ой…");
    await wait(1300);
    cat.stars.style.opacity = 0;
    cat.el.classList.add("hurt");
    const up = await play(cat.body, [
      { transform: "rotate(60deg)" }, { transform: "rotate(-8deg)", offset: .6 },
      { transform: "rotate(4deg)", offset: .8 }, { transform: "rotate(0)" }],
      { duration: 650, easing: "ease-out" });
    up.cancel();
    await play(cat.body, [{ transform: "translateX(0)" }, { transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "translateX(-3px)" }, { transform: "translateX(0)" }], { duration: 350 }).then(a => a.cancel());
    speak("Я в порядке! Я профессионал!");
    await wait(500);

    // walk to where the envelope landed and pick it up
    const fr = rectIn(fly);
    await cat.walkTo(cat.mouthAt(fr.x + fr.w / 2, "left"), 110);
    fly.remove(); cat.hold("env");
    await wait(250);
    await cat.walkTo(-cat.w - 30, 260);
    await showFinal();
  }

  async function showFinal() {
    const fin = $("final");
    const delivered = await delivery;
    $("summary").textContent = letterText;
    $("finalNote").textContent = delivered
      ? "Почти без происшествий. Котики уже передали письмо. Завтра гуляем!"
      : "Почти без происшествий. Нажми «Скопировать» и пришли мне сообщением, тогда котики точно ничего не потеряют.";
    $("copy").hidden = delivered;
    try { localStorage.setItem("kotik.letterSent", "1"); } catch (e) {}
    say.style.opacity = 0;
    fin.hidden = false;
    fitStage(fin);
    toStage();
    await play(fin, [{ transform: "translateY(20px) scale(.9)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 500, easing: "cubic-bezier(.3,1.4,.5,1)" });
    const r = rectIn(fin);
    burst(r.x + r.w / 2, r.y + 30, 16);

    // the grey cat now has the letter, the white one (with a plaster) follows
    cat.hold(null);
    grey.hold("env");
    grey.place(-grey.w - 30); grey.el.hidden = false;
    cat.place(-cat.w * 2 - 50);
    await wait(500);
    const gap = 4, mid = W() / 2;
    await Promise.all([
      grey.walkTo(mid + gap, 150),
      cat.walkTo(mid - cat.w - gap, 150 * (mid - cat.w - gap - cat.x) / (mid + gap - grey.x))
    ]);
    grey.face("left"); cat.face("right");
    await wait(300);
    burst(mid, stage.clientHeight - cat.el.offsetHeight - 10, 12);
    busy = false;
  }

  $("copy").addEventListener("click", () => {
    const text = "Наша прогулка завтра:\n" + letterText;
    const done = () => { $("copied").textContent = "Скопировано! Теперь отправь мне"; };
    const fallback = () => {
      const sel = getSelection(), range = document.createRange();
      range.selectNodeContents($("summary")); sel.removeAllRanges(); sel.addRange(range);
      $("copied").textContent = "Текст выделен, скопируй его и отправь мне";
    };
    try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
  });

  $("toHub").addEventListener("click", () => { if (!busy) goHub(); });

  function reset() {
    $("final").hidden = true; $("copied").textContent = "";
    stage.style.height = "";
    card.hidden = false;
    [card, $("letter"), $("bigenv"), $("seal"), $("final")].forEach(el => el.getAnimations().forEach(a => a.cancel()));
    $("letter").hidden = true; $("bigenv").hidden = true;
    $("answers").classList.remove("on");
    $("answers").appendChild(no);
    no.hidden = false; no.className = "btn no"; no.style.cssText = ""; no.textContent = "Нет";
    yes.style.transform = ""; dodges = 0;
    canvas.style.opacity = 1; canvas.style.pointerEvents = "";
    $("helper").hidden = false;
    document.querySelectorAll("#ideas .chip").forEach(c => c.classList.remove("added"));
    scratched = false; moves = 0; busy = false;
    cat.el.classList.remove("hurt"); cat.hold(null); cat.place(W() + 40);
    grey.el.hidden = true; grey.hold(null);
    say.style.opacity = 1; say.textContent = "Тут кое-что для тебя. Потри карточку";
    paintFoil();
  }
  $("again").addEventListener("click", () => { if (!busy) { reset(); toStage(); } });

  cat.place(W() + 40);
  paintFoil();
  addEventListener("resize", () => { if (!scratched) paintFoil(); });

  return { restart: reset };
}
