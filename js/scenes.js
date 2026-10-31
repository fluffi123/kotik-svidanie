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
  lavender: (() => {
    const tops = [[10, 12], [17, 5], [25, 2], [33, 5], [40, 12], [21, 14], [30, 13]];
    const stems = tops.map(([x, y]) => `<path d="M25 62 Q${(25 + x) / 2} ${(62 + y) / 2 + 6} ${x} ${y + 14}" stroke="#7fae6a" stroke-width="2" fill="none"/>`).join("");
    const buds = tops.map(([x, y]) => [0, 1, 2, 3, 4].map(k =>
      `<ellipse cx="${x + (k % 2 ? 1.6 : -1.6)}" cy="${y + k * 3.2}" rx="2.6" ry="2.1" fill="${k % 2 ? "#a98ae0" : "#8f6fd0"}"/>`).join("")).join("");
    return `<svg viewBox="0 0 50 82">${stems}${buds}
      <path d="M9 44 L25 80 L41 44 Q25 52 9 44 Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M15 52 L25 76 L35 52" stroke="var(--lilac-d)" stroke-width="2" fill="none" opacity=".6"/>
      <path d="M25 58 q-10 -8 -11 0 q1 5 11 0 q10 5 11 0 q-1 -8 -11 0 M25 58 l-4 9 M25 58 l4 9" fill="var(--pink)" stroke="var(--ink)" stroke-width="1.8"/></svg>`;
  })(),
  ramen: `<svg viewBox="0 0 64 44">
    <path class="steam" d="M22 8 q-4 -4 0 -8 M32 8 q-4 -4 0 -8 M42 8 q-4 -4 0 -8" stroke="var(--ink)" stroke-width="2" fill="none" stroke-linecap="round" opacity=".45"/>
    <path d="M3 14 Q32 52 61 14 Z" fill="#f7a6a6" stroke="var(--ink)" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M14 26 q4 3 8 0 q4 3 8 0 q4 3 8 0 q4 3 8 0" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>
    <ellipse cx="32" cy="14" rx="29" ry="6" fill="#f6d38a" stroke="var(--ink)" stroke-width="2.2"/>
    <path d="M12 13 q3 -3 6 0 q3 3 6 0 q3 -3 6 0 M30 15 q3 -3 6 0 q3 3 6 0" stroke="#f3e2a9" stroke-width="2.4" fill="none"/>
    <ellipse cx="44" cy="12" rx="6" ry="4" fill="#fff" stroke="var(--ink)" stroke-width="1.4"/><circle cx="44" cy="12" r="2.4" fill="#f3b23e"/>
    <circle cx="22" cy="12" r="4" fill="#fff" stroke="var(--ink)" stroke-width="1.2"/><path d="M20 12 a2 2 0 1 1 2 2" stroke="#f08ab0" stroke-width="1.4" fill="none"/>
    <rect x="30" y="6" width="6" height="9" rx="1" fill="#4c6b4a" transform="rotate(-12 33 10)"/></svg>`,
  chopsticks: `<svg viewBox="0 0 40 40"><path d="M2 38 L36 4 M8 39 L39 10" stroke="#c9a96a" stroke-width="3" stroke-linecap="round"/>
    <path d="M18 24 q-3 5 0 10 q3 5 0 10 M23 22 q-3 5 0 10 q3 5 0 10" stroke="#f3e2a9" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`,
  torii: (() => {
    const gate = (cx, w, h, y0) => {
      const post = w * 0.07, top = y0, l = cx - w / 2, r = cx + w / 2;
      return `<g>
        <rect x="${l + w * 0.12}" y="${top + h * 0.12}" width="${post}" height="${h * 0.88}" fill="#f08a6f" stroke="var(--ink)" stroke-width="2"/>
        <rect x="${r - w * 0.12 - post}" y="${top + h * 0.12}" width="${post}" height="${h * 0.88}" fill="#f08a6f" stroke="var(--ink)" stroke-width="2"/>
        <rect x="${l + w * 0.06}" y="${top + h * 0.26}" width="${w * 0.88}" height="${h * 0.06}" fill="#f08a6f" stroke="var(--ink)" stroke-width="2"/>
        <path d="M${l} ${top + h * 0.06} Q${cx} ${top + h * 0.12} ${r} ${top + h * 0.06} L${r - w * 0.03} ${top + h * 0.15} Q${cx} ${top + h * 0.2} ${l + w * 0.03} ${top + h * 0.15} Z" fill="var(--ink)"/>
      </g>`;
    };
    return `<svg viewBox="0 0 308 208">
      <defs><clipPath id="toriiClip"><rect width="308" height="208" rx="26"/></clipPath></defs>
      <g clip-path="url(#toriiClip)">
        <rect width="308" height="208" fill="#cfe7d4"/>
        <path d="M110 208 L146 100 L162 100 L198 208 Z" fill="#e9dcc6"/>
        ${gate(154, 70, 70, 74)}${gate(154, 110, 100, 56)}${gate(154, 170, 150, 30)}${gate(154, 270, 220, 0)}
      </g></svg>`;
  })(),
  deer: `<svg viewBox="0 0 74 84">
    <path d="M18 60 v20 M28 62 v19 M50 62 v19 M60 60 v20" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>
    <path d="M18 60 v20 M28 62 v19 M50 62 v19 M60 60 v20" stroke="#d9a877" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="40" cy="52" rx="28" ry="16" fill="#d9a877" stroke="var(--ink)" stroke-width="2.6"/>
    <circle cx="30" cy="48" r="2.2" fill="#fff"/><circle cx="40" cy="45" r="2" fill="#fff"/><circle cx="48" cy="50" r="2.2" fill="#fff"/>
    <path d="M14 38 L10 24 L20 32 Z M28 32 L34 20 L34 34 Z" fill="#d9a877" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round"/>
    <ellipse cx="20" cy="40" rx="13" ry="12" fill="#d9a877" stroke="var(--ink)" stroke-width="2.6"/>
    <ellipse cx="11" cy="45" rx="6" ry="4.5" fill="#f3e2c9" stroke="var(--ink)" stroke-width="1.8"/>
    <circle cx="8" cy="44" r="1.6" fill="var(--ink)"/>
    <circle cx="18" cy="37" r="2.2" fill="var(--ink)"/><circle cx="18.7" cy="36.3" r=".7" fill="#fff"/>
    <ellipse cx="24" cy="44" rx="3" ry="1.8" fill="var(--blush)" opacity=".8"/></svg>`,
  senbei: `<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.5" fill="#e8c27e" stroke="var(--ink)" stroke-width="1.8"/><circle cx="7" cy="8" r="1" fill="#b98a46"/><circle cx="12" cy="12" r="1" fill="#b98a46"/></svg>`,
  coaster: `<svg viewBox="0 0 308 208">
    <defs><clipPath id="coasterClip"><rect width="308" height="208" rx="26"/></clipPath></defs>
    <g clip-path="url(#coasterClip)">
      <rect width="308" height="208" fill="#d7ecfa"/>
      <circle cx="60" cy="40" r="10" fill="#fff" opacity=".8"/><circle cx="74" cy="40" r="13" fill="#fff" opacity=".8"/><circle cx="88" cy="42" r="9" fill="#fff" opacity=".8"/>
      <path d="M60 196 V112 M120 196 V48 M180 196 V150 M236 196 V96 M280 196 V70" stroke="var(--lilac-d)" stroke-width="4"/>
      <path class="track" d="M-6 186 C40 186 70 46 120 46 C170 46 150 150 196 150 C236 150 240 92 270 72 C290 60 300 66 320 66" stroke="var(--ink)" stroke-width="5" fill="none"/>
      <path d="M-6 186 C40 186 70 46 120 46 C170 46 150 150 196 150 C236 150 240 92 270 72 C290 60 300 66 320 66" stroke="#f6a6c1" stroke-width="2" fill="none" stroke-dasharray="6 6"/>
    </g></svg>`,
  cart: `<svg viewBox="0 0 50 36" overflow="visible">
    <path d="M10 6 l-4 -8 M40 6 l4 -8" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="16" cy="12" r="8" fill="#fff" stroke="var(--ink)" stroke-width="2"/><path d="M10 7 l1 -6 l5 4 M17 5 l5 -4 l1 6" fill="#fff" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>
    <circle cx="34" cy="12" r="8" fill="var(--grey-cat)" stroke="var(--ink)" stroke-width="2"/><path d="M28 7 l1 -6 l5 4 M35 5 l5 -4 l1 6" fill="var(--grey-cat)" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>
    <ellipse cx="16" cy="15" rx="2" ry="2.6" fill="var(--ink)"/><ellipse cx="34" cy="15" rx="2" ry="2.6" fill="var(--ink)"/>
    <rect x="2" y="16" width="46" height="14" rx="5" fill="var(--pink-d)" stroke="var(--ink)" stroke-width="2.4"/>
    <circle cx="12" cy="31" r="4" fill="var(--ink)"/><circle cx="38" cy="31" r="4" fill="var(--ink)"/></svg>`,
  shinkansen: `<svg viewBox="0 0 210 44">
    <path d="M8 38 L170 38 Q206 38 206 30 Q200 10 150 8 L8 8 Q2 8 2 14 V32 Q2 38 8 38 Z" fill="#fff" stroke="var(--ink)" stroke-width="2.6"/>
    <path d="M2 28 H196 Q203 30 205 32" stroke="#6b8fd6" stroke-width="5" fill="none"/>
    <path d="M2 33 H170" stroke="#6b8fd6" stroke-width="2" fill="none"/>
    ${[14, 34, 54, 74, 94, 114, 134].map(x => `<rect x="${x}" y="14" width="13" height="8" rx="2" fill="#bcd6f2" stroke="var(--ink)" stroke-width="1.4"/>`).join("")}
    <path d="M154 14 Q176 14 186 22 L154 22 Z" fill="#bcd6f2" stroke="var(--ink)" stroke-width="1.4"/></svg>`,
  lantern: color => `<svg viewBox="0 0 30 50">
    <rect x="9" y="4" width="12" height="5" rx="1.5" fill="var(--ink)"/>
    <ellipse cx="15" cy="24" rx="13" ry="15" fill="${color}" stroke="var(--ink)" stroke-width="2.4"/>
    <path d="M3 19 Q15 23 27 19 M2 25 Q15 29 28 25 M3 31 Q15 35 27 31" stroke="var(--ink)" stroke-width="1.3" fill="none" opacity=".45"/>
    <rect x="9" y="38" width="12" height="4" rx="1.5" fill="var(--ink)"/>
    <path d="M15 42 v6 M12 48 h6" stroke="#e48fab" stroke-width="2"/></svg>`,
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
    {
      name: "Букет лаванды",
      async run() {
        const b = prop(SVG.lavender, 168, 84, 40, 5);
        await pop(b, 500);
        // the grey cat carries the bouquet over to the white one
        await Promise.all([
          move(grey, [{ transform: "none" }, { transform: "translateX(-14px) translateY(-8px)" }, { transform: "translateX(-28px)" }], 700),
          move(b, [{ transform: "none" }, { transform: "translate(-30px, -10px) rotate(-12deg)" }, { transform: "translate(-62px, 0) rotate(-20deg)" }], 700),
        ]);
        box.classList.add("blushing");
        const t = text("это тебе", 196, 44, 24);
        pop(t);
        await move(white, [{ transform: "none" }, { transform: "scale(1.08, .92)" }, { transform: "translateY(-18px) rotate(-6deg)" }, { transform: "none" }, { transform: "translateY(-10px)" }, { transform: "none" }], 1200, { easing: "ease-out" });
        hearts(108, 90, 8, 80);
        // a few lavender buds drift away
        for (let i = 0; i < 6; i++) {
          const bud = prop(`<svg viewBox="0 0 6 6"><ellipse cx="3" cy="3" rx="2.6" ry="2.1" fill="#a98ae0"/></svg>`, 108 + Math.random() * 20, 84, 7, 6);
          move(bud, [{ transform: "none", opacity: 1 }, { transform: `translate(${(Math.random() - .5) * 90}px, ${-30 - Math.random() * 40}px) rotate(120deg)`, opacity: 0 }], 1300, { delay: i * 120 }).then(() => bud.remove());
        }
        await wait(1600);
        fadeOut(t);
        await fadeOut(b);
        box.classList.remove("blushing");
      },
    },
    {
      name: "Рамен",
      async run() {
        const r1 = prop(SVG.ramen, 78, 136, 52, 3);
        const r2 = prop(SVG.ramen, 150, 136, 52, 3);
        await Promise.all([pop(r1), wait(150).then(() => pop(r2))]);
        box.querySelectorAll(".steam").forEach(s => anims.push(s.animate([{ transform: "translateY(0)", opacity: .6 }, { transform: "translateY(-8px)", opacity: 0 }], { duration: T(1000), iterations: 4 })));
        const c1 = prop(SVG.chopsticks, 96, 104, 30, 4);
        const c2 = prop(SVG.chopsticks, 154, 104, 30, 4);
        c2.firstElementChild.style.transform = "scaleX(-1)";
        await Promise.all([pop(c1), pop(c2)]);
        const slurp = text("ズルズル…", 140, 54, 22);
        pop(slurp);
        for (let i = 0; i < 2; i++) {
          await Promise.all([
            move(c1, [{ transform: "none" }, { transform: "translateY(-16px) rotate(-8deg)" }, { transform: "none" }], 650),
            move(white, [{ transform: "none" }, { transform: "rotate(-5deg) translateY(-3px)" }, { transform: "none" }], 650),
          ]);
          await Promise.all([
            move(c2, [{ transform: "none" }, { transform: "translateY(-16px) rotate(8deg)" }, { transform: "none" }], 650),
            move(grey, [{ transform: "none" }, { transform: "rotate(5deg) translateY(-3px)" }, { transform: "none" }], 650),
          ]);
        }
        slurp.remove();
        const yum = text("вкусно!", 140, 54, 26);
        pop(yum);
        hearts(140, 110, 5);
        await wait(1000);
        fadeOut(yum);
        await Promise.all([r1, r2, c1, c2].map(e => fadeOut(e)));
      },
    },
    {
      name: "Храмы Киото",
      async run() {
        const bg = prop(SVG.torii, -14, -14, 308, 0);
        await move(bg, [{ opacity: 0 }, { opacity: 1 }], 700);
        const gates = bg.firstElementChild;
        gates.style.transformOrigin = "50% 55%";
        anims.push(gates.animate([{ transform: "scale(1)" }, { transform: "scale(1.15)" }], { duration: T(2600), fill: "forwards", easing: "ease-in-out" }));
        box.classList.add("walking");
        await wait(2600);
        box.classList.remove("walking");
        // bow, bow, clap
        for (let i = 0; i < 2; i++) {
          await Promise.all([
            move(white, [{ transform: "none" }, { transform: "rotate(14deg) translateY(4px)" }, { transform: "none" }], 700),
            move(grey, [{ transform: "none" }, { transform: "rotate(-14deg) translateY(4px)" }, { transform: "none" }], 700),
          ]);
        }
        const clap = text("хлоп-хлоп", 140, 40, 24);
        pop(clap);
        await wait(700);
        hearts(140, 100, 5);
        await wait(700);
        fadeOut(clap);
        await fadeOut(bg, 600);
      },
    },
    {
      name: "Олени Нары",
      async run() {
        move(grey, [{ transform: "none" }, { transform: "translateX(-36px)" }], 700);
        const deer = prop(SVG.deer, 300, 66, 94, 3);
        deer.style.transformOrigin = "30% 100%";
        await move(deer, [{ transform: "translateX(0)" }, { transform: "translateX(-90px) translateY(-4px)", offset: .5 }, { transform: "translateX(-92px)" }], 1200);
        const hi = text("поклон!", 236, 48, 22);
        pop(hi);
        // the deer bows, the cats bow back
        await move(deer, [{ transform: "translateX(-92px)" }, { transform: "translateX(-92px) rotate(-16deg)" }, { transform: "translateX(-92px)" }], 800);
        await Promise.all([
          move(white, [{ transform: "none" }, { transform: "rotate(12deg)" }, { transform: "none" }], 700),
          move(grey, [{ transform: "translateX(-36px)" }, { transform: "translateX(-36px) rotate(12deg)" }, { transform: "translateX(-36px)" }], 700),
        ]);
        hi.remove();
        // the white cat shares a deer cracker
        const s = prop(SVG.senbei, 98, 118, 18, 5);
        await pop(s, 300);
        await move(s, [{ transform: "none" }, { transform: "translate(60px, -40px) rotate(180deg)" }, { transform: "translate(118px, 4px) rotate(360deg)" }], 800, { easing: "ease-out" });
        s.remove();
        const munch = text("ням", 236, 56, 22);
        pop(munch);
        await move(deer, [{ transform: "translateX(-92px)" }, { transform: "translateX(-92px) scale(1.04, .96)" }, { transform: "translateX(-92px)" }], 300, { iterations: 3 });
        hearts(232, 100, 5);
        await wait(600);
        munch.remove();
        await move(deer, [{ transform: "translateX(-92px)" }, { transform: "translateX(20px)", opacity: 0 }], 800);
        deer.remove();
      },
    },
    {
      name: "Юниверсал в Осаке",
      async run() {
        const bg = prop(SVG.coaster, -14, -14, 308, 0);
        await move(bg, [{ opacity: 0 }, { opacity: 1 }], 700);
        const track = bg.querySelector(".track"), len = track.getTotalLength();
        const cart = prop(SVG.cart, 0, 0, 40, 1);
        const frames = [];
        for (let i = 0; i <= 48; i++) {
          const d = len * i / 48, a = track.getPointAtLength(d), b = track.getPointAtLength(Math.min(len, d + 2));
          const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
          frames.push({ transform: `translate(${a.x - 14 - 20}px, ${a.y - 14 - 26}px) rotate(${ang}deg)` });
        }
        const scream = text("А-а-а-а!", 140, 20, 26);
        pop(scream);
        const ride = move(cart, frames, 2800, { easing: "ease-in-out" });
        for (let i = 0; i < 3; i++) {
          await Promise.all([
            move(white, [{ transform: "none" }, { transform: "translateY(-14px) rotate(-6deg)" }, { transform: "none" }], 450, { easing: "ease-out" }),
            move(grey, [{ transform: "none" }, { transform: "translateY(-14px) rotate(6deg)" }, { transform: "none" }], 450, { easing: "ease-out" }),
          ]);
          await wait(300);
        }
        await ride;
        scream.remove();
        cart.remove();
        const again = text("ещё раз!", 140, 40, 26);
        pop(again);
        hearts(140, 100, 6);
        await wait(1000);
        fadeOut(again);
        await fadeOut(bg, 600);
      },
    },
    {
      name: "Наше путешествие",
      async run() {
        const train = prop(SVG.shinkansen, -220, 52, 200, 1);
        await move(train, [{ transform: "translateX(0)" }, { transform: "translateX(560px)" }], 1500, { easing: "cubic-bezier(.5,0,.5,1)" });
        train.remove();
        const cities = [["Осака", 48, 46], ["Нара", 112, 26], ["Киото", 166, 48], ["Токио", 238, 30]]; // our route, west to east
        const route = prop(`<svg viewBox="0 0 280 70" overflow="visible">
          <path d="${cities.map(([, x, y], i) => (i ? "L" : "M") + x + " " + y).join(" ")}" stroke="var(--ink)" stroke-width="2.4" stroke-dasharray="5 6" fill="none" opacity=".6"/>
          ${cities.map(([name, x, y]) => `<g class="pin" style="opacity:0;transform-box:fill-box;transform-origin:50% 100%">
            <path d="M${x} ${y} c-7 -9 -7 -17 0 -17 c7 0 7 8 0 17z" fill="var(--pink-d)" stroke="var(--ink)" stroke-width="2"/>
            <text x="${x}" y="${y + 18}" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="18" fill="var(--ink)">${name}</text></g>`).join("")}
        </svg>`, 0, 0, 280, 1);
        for (const pin of route.querySelectorAll(".pin")) {
          await move(pin, [{ opacity: 0, transform: "translateY(-12px) scale(.5)" }, { opacity: 1, transform: "none" }], 420, { easing: "ease-out" });
        }
        await Promise.all([
          move(white, [{ transform: "none" }, { transform: "translateY(-12px)" }, { transform: "none" }], 500, { iterations: 2 }),
          move(grey, [{ transform: "none" }, { transform: "translateY(-12px)" }, { transform: "none" }], 500, { iterations: 2, delay: 150 }),
        ]);
        hearts(140, 100, 6);
        await wait(1200);
        await fadeOut(route, 600);
      },
    },
    {
      name: "Вечер в Осаке",
      async run() {
        const night = prop("", -14, -14, 308, 0, "night");
        const rope = prop(`<svg viewBox="0 0 280 30"><path d="M0 4 Q140 34 280 4" stroke="var(--ink)" stroke-width="2" fill="none"/></svg>`, 0, -6, 280, 1);
        const colors = ["#f7a6a6", "#fbd38a", "#f6a6c1"];
        const lanterns = [44, 118, 196].map((x, i) => prop(SVG.lantern(colors[i]), x, i === 1 ? 8 : 2, 34, 1, "lantern-glow"));
        await Promise.all([night, rope, ...lanterns].map(e => move(e, [{ opacity: 0 }, { opacity: 1 }], 700)));
        lanterns.forEach((l, i) => {
          l.style.transformOrigin = "50% 0";
          anims.push(l.animate([{ transform: "rotate(-6deg)" }, { transform: "rotate(6deg)" }], { duration: T(1300 + i * 200), iterations: Infinity, direction: "alternate", easing: "ease-in-out" }));
        });
        move(white, [{ transform: "none" }, { transform: "rotate(-7deg) translateX(8px)" }], 600);
        await move(grey, [{ transform: "none" }, { transform: "rotate(7deg) translateX(-8px)" }], 600);
        await wait(2400);
        hearts(140, 100, 5);
        await wait(700);
        await Promise.all([night, rope, ...lanterns].map(e => fadeOut(e, 600)));
      },
    },
  ];

  function nextScene() {
    if (!queue.length) queue = SCENES.map((_, i) => i).sort(() => Math.random() - .5);
    return SCENES[queue.pop()];
  }

  async function play(scene = nextScene()) {
    if (busy) return;
    busy = true;
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
  box.addEventListener("click", () => play());
  box.playScene = name => play(SCENES.find(s => s.name === name)); // handy for checking a scene from the console
  box.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); } });
}
