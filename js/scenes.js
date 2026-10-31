// Little couple scenes the hub cats play when tapped.
// The box is 280×180: white cat on the left (x 10–140), grey cat on the right (x 140–270), both standing on y 180.
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const T = t => reduced ? t * 0.4 : t;
const wait = t => new Promise(r => setTimeout(r, T(t)));
const HEART_PATH = "M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z";
const heartSvg = color => `<svg viewBox="0 0 24 24"><path d="${HEART_PATH}" fill="${color}" stroke="var(--ink)" stroke-width="1.4"/></svg>`;

const SVG = {
  blanket: `<svg viewBox="0 0 280 92">
    <path d="M6 30 Q140 -8 274 30 L278 84 Q140 98 2 84 Z" fill="var(--pink)" stroke="var(--ink)" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M60 18 L56 90 M120 12 L118 94 M180 12 L182 94 M238 20 L242 88" stroke="#fff" stroke-width="9" opacity=".55"/>
    <path d="M8 58 Q140 40 276 58" stroke="var(--lilac-d)" stroke-width="9" fill="none" opacity=".8"/>
    <path d="M6 30 Q140 -8 274 30 L278 84 Q140 98 2 84 Z" fill="none" stroke="var(--ink)" stroke-width="3.5" stroke-linejoin="round"/></svg>`,
  mug: color => `<svg viewBox="0 0 44 46">
    <path class="steam" d="M14 12 q-5 -5 0 -10 M24 12 q-5 -5 0 -10" stroke="var(--ink)" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".5"/>
    <path d="M31 22 q9 0 9 7 q0 7 -9 7" stroke="var(--ink)" stroke-width="3" fill="none"/>
    <rect x="5" y="16" width="27" height="27" rx="6" fill="${color}" stroke="var(--ink)" stroke-width="3"/>
    <path d="M8 20 h21" stroke="#8a5a44" stroke-width="3" stroke-linecap="round"/>
    <path d="M14 30 l4 3 l4 -3" stroke="var(--ink)" stroke-width="1.6" fill="none" opacity=".4"/></svg>`,
  umbrella: `<svg viewBox="0 0 200 124">
    <path d="M100 66 V112 q0 9 -9 9 q-7 0 -8 -7" stroke="var(--ink)" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M8 68 Q100 -24 192 68 Q174 55 156 68 Q137 55 118 68 Q100 55 82 68 Q63 55 44 68 Q26 55 8 68 Z" fill="var(--lilac)" stroke="var(--ink)" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M100 6 Q82 30 82 68 M100 6 Q118 30 118 68 M100 6 Q52 26 44 68 M100 6 Q148 26 156 68" stroke="var(--ink)" stroke-width="2" fill="none" opacity=".35"/></svg>`,
  cone: scoop => `<svg viewBox="0 0 34 56">
    <path d="M6 24 L17 54 L28 24 Z" fill="#f3d39b" stroke="var(--ink)" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M10 30 l12 10 M24 30 l-12 10" stroke="var(--ink)" stroke-width="1.4" opacity=".4"/>
    <circle cx="17" cy="17" r="12" fill="${scoop}" stroke="var(--ink)" stroke-width="2.6"/>
    <circle cx="13" cy="13" r="2.5" fill="#fff" opacity=".8"/></svg>`,
  phone: `<svg viewBox="0 0 60 100">
    <rect x="3" y="3" width="54" height="94" rx="10" fill="var(--ink)"/>
    <rect x="8" y="12" width="44" height="72" rx="4" fill="var(--mint)"/>
    <circle cx="30" cy="90" r="3" fill="var(--paper)"/>
    <circle cx="22" cy="44" r="7" fill="#fff" stroke="var(--ink)" stroke-width="1.5"/><circle cx="38" cy="44" r="7" fill="var(--grey-cat)" stroke="var(--ink)" stroke-width="1.5"/>
    </svg>`,
  gift: `<svg viewBox="0 0 54 58" overflow="visible">
    <rect x="6" y="24" width="42" height="32" rx="4" fill="var(--pink)" stroke="var(--ink)" stroke-width="3"/>
    <rect x="23" y="24" width="8" height="32" fill="var(--butter)" stroke="var(--ink)" stroke-width="2"/>
    <g class="lid"><rect x="2" y="14" width="50" height="12" rx="3" fill="var(--pink-d)" stroke="var(--ink)" stroke-width="3"/>
    <rect x="23" y="14" width="8" height="12" fill="var(--butter)" stroke="var(--ink)" stroke-width="2"/>
    <path d="M27 14 q-14 -14 -16 -4 q2 6 16 4 q14 2 16 -4 q-2 -10 -16 4" fill="var(--butter)" stroke="var(--ink)" stroke-width="2.4"/></g></svg>`,
  moon: `<svg viewBox="0 0 40 40"><path d="M26 4 a16 16 0 1 0 10 26 a13 13 0 1 1 -10 -26 z" fill="#fff3b8" stroke="var(--ink)" stroke-width="2"/></svg>`,
  polaroid: `<svg viewBox="0 0 60 70"><rect x="2" y="2" width="56" height="66" rx="3" fill="#fff" stroke="var(--ink)" stroke-width="2.5"/>
    <rect x="8" y="8" width="44" height="40" fill="var(--lilac)"/><circle cx="22" cy="32" r="8" fill="#fff" stroke="var(--ink)" stroke-width="1.5"/>
    <circle cx="38" cy="32" r="8" fill="var(--grey-cat)" stroke="var(--ink)" stroke-width="1.5"/><path d="${HEART_PATH}" transform="translate(23 6) scale(.6)" fill="var(--pink-d)"/></svg>`,
};

export function initScenes(box, caption) {
  const [white, grey] = box.querySelectorAll(".mini-cat");
  let busy = false, queue = [];

  const anims = [];
  function move(el, frames, duration, opts = {}) {
    const a = el.animate(frames, { duration: T(duration), fill: "forwards", easing: "ease-in-out", ...opts });
    anims.push(a);
    return a.finished.catch(() => {});
  }
  function prop(html, x, y, w, z = 3, cls = "") {
    const d = document.createElement("div");
    d.className = "scene-prop " + cls;
    d.innerHTML = html;
    Object.assign(d.style, { left: x + "px", top: y + "px", width: w + "px", zIndex: z });
    box.appendChild(d);
    return d;
  }
  function text(str, x, y, size = 24) {
    const d = prop(`<span>${str}</span>`, x, y, 0, 5, "scene-text");
    d.style.fontSize = size + "px";
    return d;
  }
  function hearts(x, y, n = 6, spread = 70) {
    const colors = ["var(--pink)", "var(--pink-d)", "var(--lilac-d)", "var(--butter)"];
    for (let i = 0; i < n; i++) {
      const h = prop(heartSvg(colors[i % colors.length]), x - 9, y - 9, 18, 6);
      const dx = (Math.random() - .5) * spread, dy = -50 - Math.random() * 50;
      move(h, [{ transform: "scale(.3)", opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(1.2)`, opacity: 0 }],
        900 + Math.random() * 500, { easing: "ease-out", delay: i * 90 }).then(() => h.remove());
    }
  }
  const pop = (el, dur = 450) => move(el, [{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1.2)", opacity: 1, offset: .7 }, { transform: "scale(1)", opacity: 1 }], dur, { easing: "ease-out" });
  const fadeOut = (el, dur = 400) => move(el, [{ opacity: 1 }, { opacity: 0 }], dur).then(() => el.remove());
  const reset = () => Promise.all([white, grey].map(c => move(c, [{ transform: getComputedStyle(c).transform === "none" ? "none" : getComputedStyle(c).transform }, { transform: "none" }], 450)));

  const SCENES = [
    {
      name: "Под пледиком",
      async run() {
        move(white, [{ transform: "none" }, { transform: "translateX(10px)" }], 500);
        move(grey, [{ transform: "none" }, { transform: "translateX(-10px)" }], 500);
        const b = prop(SVG.blanket, 0, 104, 280, 4);
        await move(b, [{ transform: "translateY(-150px) rotate(-8deg)", opacity: 0 }, { transform: "translateY(6px) rotate(1deg)", opacity: 1, offset: .75 }, { transform: "none", opacity: 1 }], 800, { easing: "ease-out" });
        box.classList.add("sleepy");
        const zs = [0, 1, 2].map(i => {
          const z = text("z", 120 + i * 14, 70 - i * 6, 18 + i * 6);
          move(z, [{ transform: "translateY(10px)", opacity: 0 }, { transform: "translateY(-30px)", opacity: 1, offset: .5 }, { transform: "translateY(-60px)", opacity: 0 }], 1600, { iterations: 2, delay: i * 350 });
          return z;
        });
        await wait(3100);
        zs.forEach(z => z.remove());
        box.classList.remove("sleepy");
        await move(b, [{ transform: "none", opacity: 1 }, { transform: "translateY(60px)", opacity: 0 }], 500);
        b.remove();
      },
    },
    {
      name: "Кофе вдвоём",
      async run() {
        const m1 = prop(SVG.mug("var(--mint)"), 92, 128, 40);
        const m2 = prop(SVG.mug("var(--butter)"), 150, 128, 40);
        m2.style.transform = "scaleX(-1)";
        await Promise.all([pop(m1), wait(150).then(() => pop(m2))]);
        m2.getAnimations().forEach(a => a.cancel()); m2.style.transform = "scaleX(-1)";
        box.querySelectorAll(".steam").forEach(s => anims.push(s.animate([{ transform: "translateY(0)", opacity: .6 }, { transform: "translateY(-8px)", opacity: 0 }], { duration: T(1100), iterations: 3 })));
        for (let i = 0; i < 2; i++) {
          await move(white, [{ transform: "none" }, { transform: "rotate(-5deg) translateY(-3px)" }, { transform: "none" }], 700);
          await move(grey, [{ transform: "none" }, { transform: "rotate(5deg) translateY(-3px)" }, { transform: "none" }], 700);
        }
        hearts(140, 100, 5);
        await wait(900);
        await Promise.all([fadeOut(m1), fadeOut(m2)]);
      },
    },
    {
      name: "Обнимашки",
      async run() {
        await Promise.all([
          move(white, [{ transform: "none" }, { transform: "translateX(26px) rotate(4deg)" }], 600),
          move(grey, [{ transform: "none" }, { transform: "translateX(-26px) rotate(-4deg)" }], 600),
        ]);
        const h = prop(heartSvg("var(--pink-d)"), 116, 34, 48, 6);
        pop(h, 600);
        await Promise.all([
          move(white, [{ transform: "translateX(26px) rotate(4deg)" }, { transform: "translateX(26px) rotate(4deg) scale(1.05, .95)" }, { transform: "translateX(26px) rotate(4deg)" }], 500, { iterations: 3 }),
          move(grey, [{ transform: "translateX(-26px) rotate(-4deg)" }, { transform: "translateX(-26px) rotate(-4deg) scale(1.05, .95)" }, { transform: "translateX(-26px) rotate(-4deg)" }], 500, { iterations: 3 }),
        ]);
        hearts(140, 60, 6);
        await wait(500);
        fadeOut(h);
      },
    },
    {
      name: "Чмок",
      async run() {
        await Promise.all([
          move(white, [{ transform: "none" }, { transform: "translateX(16px) rotate(10deg)" }], 600),
          move(grey, [{ transform: "none" }, { transform: "translateX(-16px) rotate(-10deg)" }], 600),
        ]);
        const t = text("чмок!", 140, 50, 30);
        pop(t);
        hearts(140, 110, 8, 50);
        await wait(1400);
        fadeOut(t);
      },
    },
    {
      name: "Под одним зонтиком",
      async run() {
        const drops = [];
        for (let i = 0; i < 22; i++) {
          const d = prop("", Math.random() * 300 - 10, -20, 2, 1, "drop");
          move(d, [{ transform: "translateY(0)" }, { transform: "translateY(210px)" }], 650 + Math.random() * 300, { iterations: 5, delay: Math.random() * 600, easing: "linear" });
          drops.push(d);
        }
        move(white, [{ transform: "none" }, { transform: "translateX(14px)" }], 500);
        move(grey, [{ transform: "none" }, { transform: "translateX(-14px)" }], 500);
        await wait(400);
        const u = prop(SVG.umbrella, 40, -4, 200, 4);
        await move(u, [{ transform: "translateY(-120px) rotate(20deg)", opacity: 0 }, { transform: "translateY(4px) rotate(-3deg)", opacity: 1, offset: .75 }, { transform: "none", opacity: 1 }], 700, { easing: "ease-out" });
        await move(u, [{ transform: "rotate(0)" }, { transform: "rotate(-4deg)" }, { transform: "rotate(4deg)" }, { transform: "rotate(0)" }], 1400);
        hearts(140, 70, 4);
        await wait(900);
        drops.forEach(d => fadeOut(d, 300));
        await fadeOut(u);
      },
    },
    {
      name: "Мороженое",
      async run() {
        const c1 = prop(SVG.cone("var(--pink)"), 92, 116, 30);
        const c2 = prop(SVG.cone("var(--mint)"), 160, 116, 30);
        await Promise.all([pop(c1), wait(150).then(() => pop(c2))]);
        for (let i = 0; i < 3; i++) {
          await Promise.all([
            move(c1, [{ transform: "rotate(0)" }, { transform: "rotate(-14deg) translate(-4px, 2px)" }, { transform: "rotate(0)" }], 520),
            move(white, [{ transform: "none" }, { transform: "translateY(-4px) rotate(3deg)" }, { transform: "none" }], 520),
          ]);
          await Promise.all([
            move(c2, [{ transform: "rotate(0)" }, { transform: "rotate(14deg) translate(4px, 2px)" }, { transform: "rotate(0)" }], 520),
            move(grey, [{ transform: "none" }, { transform: "translateY(-4px) rotate(-3deg)" }, { transform: "none" }], 520),
          ]);
        }
        hearts(140, 100, 5);
        await wait(600);
        await Promise.all([fadeOut(c1), fadeOut(c2)]);
      },
    },
    {
      name: "Танцы",
      async run() {
        const notes = [];
        for (let i = 0; i < 6; i++) {
          const n = text(i % 2 ? "♫" : "♪", 40 + Math.random() * 200, 70, 22);
          move(n, [{ transform: "translateY(0) rotate(0)", opacity: 0 }, { transform: "translateY(-30px) rotate(-15deg)", opacity: 1, offset: .4 }, { transform: "translateY(-70px) rotate(15deg)", opacity: 0 }], 1400, { delay: i * 380 });
          notes.push(n);
        }
        for (let i = 0; i < 3; i++) {
          await move(white, [{ transform: "none" }, { transform: "translateY(-22px) rotate(-10deg)" }, { transform: "none" }], 420, { easing: "ease-out" });
          await move(grey, [{ transform: "none" }, { transform: "translateY(-22px) rotate(10deg)" }, { transform: "none" }], 420, { easing: "ease-out" });
        }
        await Promise.all([
          move(white, [{ transform: "none" }, { transform: "translateY(-16px) rotate(360deg)" }, { transform: "none" }], 700),
          move(grey, [{ transform: "none" }, { transform: "translateY(-16px) rotate(-360deg)" }, { transform: "none" }], 700),
        ]);
        await wait(400);
        notes.forEach(n => n.remove());
      },
    },
    {
      name: "Смотрим на звёзды",
      async run() {
        const night = prop("", -14, -14, 308, 0, "night");
        const moon = prop(SVG.moon, 222, 4, 32, 1);
        const stars = [];
        for (let i = 0; i < 14; i++) {
          const s = prop("", 6 + Math.random() * 270, 4 + Math.random() * 90, 4, 1, "star");
          anims.push(s.animate([{ opacity: .2 }, { opacity: 1 }, { opacity: .2 }], { duration: T(900 + Math.random() * 900), iterations: Infinity }));
          stars.push(s);
        }
        await Promise.all([night, moon, ...stars].map(e => move(e, [{ opacity: 0 }, { opacity: 1 }], 700)));
        move(white, [{ transform: "none" }, { transform: "rotate(-7deg) translateX(8px)" }], 600);
        await move(grey, [{ transform: "none" }, { transform: "rotate(7deg) translateX(-8px)" }], 600);
        const shoot = prop("", 30, 20, 60, 1, "shooting");
        await move(shoot, [{ transform: "translate(0,0) rotate(20deg)", opacity: 0 }, { transform: "translate(80px, 30px) rotate(20deg)", opacity: 1, offset: .3 }, { transform: "translate(200px, 70px) rotate(20deg)", opacity: 0 }], 1100, { easing: "ease-out" });
        shoot.remove();
        hearts(140, 90, 4);
        await wait(1200);
        await Promise.all([night, moon, ...stars].map(e => fadeOut(e, 600)));
      },
    },
    {
      name: "Селфи",
      async run() {
        await Promise.all([
          move(white, [{ transform: "none" }, { transform: "translateX(16px) rotate(8deg)" }], 500),
          move(grey, [{ transform: "none" }, { transform: "translateX(-16px) rotate(-8deg)" }], 500),
        ]);
        const p = prop(SVG.phone, 222, 0, 40, 5);
        await move(p, [{ transform: "translate(40px, -30px) rotate(20deg)", opacity: 0 }, { transform: "rotate(-8deg)", opacity: 1 }], 500, { easing: "ease-out" });
        const t = text("3… 2… 1…", 140, 20, 22);
        await wait(900);
        t.remove();
        const flash = prop("", -14, -14, 308, 7, "flash");
        await move(flash, [{ opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: 0 }], 500);
        flash.remove();
        const click = text("щёлк!", 140, 30, 28);
        pop(click);
        fadeOut(p);
        const photo = prop(SVG.polaroid, 112, 10, 56, 6);
        await move(photo, [{ transform: "translateY(-40px) rotate(-20deg) scale(.6)", opacity: 0 }, { transform: "translateY(0) rotate(6deg)", opacity: 1 }], 600, { easing: "ease-out" });
        await wait(1200);
        fadeOut(click);
        await fadeOut(photo);
      },
    },
    {
      name: "Подарок",
      async run() {
        const g = prop(SVG.gift, 114, 124, 52, 4);
        await move(grey, [{ transform: "none" }, { transform: "translateX(-12px) translateY(-10px)" }, { transform: "translateX(-12px)" }], 500);
        await pop(g, 500);
        await move(white, [{ transform: "none" }, { transform: "scale(1.06, .94)" }, { transform: "none" }], 400);
        const lid = g.querySelector(".lid");
        lid.style.transformBox = "fill-box"; lid.style.transformOrigin = "50% 100%";
        await move(lid, [{ transform: "none" }, { transform: "translate(-14px, -26px) rotate(-30deg)" }], 400, { easing: "ease-out" });
        hearts(140, 130, 10, 110);
        await move(white, [{ transform: "none" }, { transform: "translateY(-20px)" }, { transform: "none" }, { transform: "translateY(-12px)" }, { transform: "none" }], 900, { easing: "ease-out" });
        await wait(900);
        await fadeOut(g);
      },
    },
  ];

  function nextScene() {
    if (!queue.length) queue = SCENES.map((_, i) => i).sort(() => Math.random() - .5);
    return SCENES[queue.pop()];
  }

  async function play() {
    if (busy) return;
    busy = true;
    const scene = nextScene();
    caption.textContent = scene.name;
    try {
      await scene.run();
      await reset();
    } finally {
      anims.splice(0).forEach(a => a.cancel());
      box.querySelectorAll(".scene-prop").forEach(p => p.remove());
      box.classList.remove("sleepy");
      caption.textContent = "Нажми на котиков ещё раз";
      busy = false;
    }
  }

  box.setAttribute("role", "button");
  box.setAttribute("tabindex", "0");
  box.setAttribute("aria-label", "Котики. Нажми, чтобы увидеть сценку");
  box.removeAttribute("aria-hidden");
  box.addEventListener("click", play);
  box.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); } });
}
