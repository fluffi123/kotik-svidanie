const GOOD = ["Котик в восторге!", "Точно в цель!", "Вот это знание!", "Мур, правильно!"];
const BAD = ["Котик в шоке…", "Почти! Но нет", "Мимо, но мило", "Котик запишет это в блокнот"];
const NEUTRAL = ["Котик запомнил", "Интересно-интересно…", "Ответ принят"];
const any = list => list[Math.floor(Math.random() * list.length)];

export function render(root, stage, api) {
  const qs = stage.questions;
  let i = 0, score = 0;
  const answers = [];

  root.innerHTML = `
    <div class="panel quiz">
      <h2 class="panel-title">${stage.title}</h2>
      <div class="progress"><span class="qn"></span><div class="bar"><i></i></div></div>
      <p class="question"></p>
      <div class="opts"></div>
      <p class="react" aria-live="polite"></p>
      <div class="row"><button class="btn yes next" type="button" hidden>Дальше</button></div>
    </div>`;
  const $ = s => root.querySelector(s);

  function show() {
    const q = qs[i];
    $(".qn").textContent = `${i + 1} / ${qs.length}`;
    $(".bar i").style.width = (i / qs.length * 100) + "%";
    $(".question").textContent = q.q;
    $(".react").textContent = "";
    $(".next").hidden = true;
    const box = $(".opts");
    box.innerHTML = "";
    q.options.forEach((text, k) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "opt"; b.textContent = text;
      b.addEventListener("click", () => pick(k));
      box.appendChild(b);
    });
  }

  function pick(k) {
    const q = qs[i], btns = [...$(".opts").children];
    btns.forEach(b => b.disabled = true);
    btns[k].classList.add("chosen");
    let ok = null;
    if (Number.isInteger(q.correct)) {
      ok = k === q.correct;
      if (ok) score++;
      btns[q.correct].classList.add("right");
      if (!ok) btns[k].classList.add("wrong");
    }
    $(".react").textContent = any(ok === null ? NEUTRAL : ok ? GOOD : BAD);
    answers.push({ q: q.q, a: q.options[k], ok });
    const next = $(".next");
    next.textContent = i === qs.length - 1 ? "Узнать результат" : "Дальше";
    next.hidden = false;
    next.focus();
  }

  $(".next").addEventListener("click", () => { i++; i < qs.length ? show() : finish(); });

  async function finish() {
    const total = qs.filter(q => Number.isInteger(q.correct)).length;
    const share = total ? score / total : 1;
    const verdict = share === 1 ? "Ты знаешь меня лучше всех!" : share >= .6 ? "Очень хорошо! Котик доволен" : share >= .3 ? "Есть куда расти, будем узнавать друг друга" : "Похоже, нам нужно больше свиданий";
    root.innerHTML = `
      <div class="panel quiz done">
        <h2 class="panel-title">${stage.title}</h2>
        <p class="big-score">${score} <small>из ${total}</small></p>
        <p class="verdict">${verdict}</p>
        <p class="note" aria-live="polite"></p>
        <div class="row"><button class="btn yes" type="button">К этапам</button></div>
      </div>`;
    root.querySelector(".btn").addEventListener("click", api.back);
    api.celebrate();
    const note = root.querySelector(".note");
    note.textContent = await api.save({ score, total, answers });
  }

  show();
}
