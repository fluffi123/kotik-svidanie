// «Совпадём?»: one phone, two players. She picks first, passes the phone, he picks, then both answers are shown.
export function render(root, stage, api) {
  const qs = stage.questions;
  let i = 0, matches = 0;
  const answers = [];

  root.innerHTML = `
    <div class="panel quiz match">
      <h2 class="panel-title">${stage.title}</h2>
      <div class="progress"><span class="qn"></span><div class="bar"><i></i></div></div>
      <p class="turn"></p>
      <p class="question"></p>
      <div class="opts"></div>
      <div class="reveal" hidden></div>
      <p class="react" aria-live="polite"></p>
      <div class="row"><button class="btn yes next" type="button" hidden></button></div>
    </div>`;
  const $ = s => root.querySelector(s);

  function options(onPick) {
    const box = $(".opts");
    box.innerHTML = "";
    box.hidden = false;
    qs[i].options.forEach((text, k) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "opt"; b.textContent = text;
      b.addEventListener("click", () => onPick(k));
      box.appendChild(b);
    });
  }

  function step(turn, text, onNext) {
    $(".turn").textContent = turn;
    $(".react").textContent = "";
    const next = $(".next");
    next.hidden = !onNext;
    if (onNext) { next.textContent = text; next.onclick = onNext; next.focus(); }
  }

  function show() {
    const q = qs[i];
    $(".qn").textContent = `${i + 1} / ${qs.length}`;
    $(".bar i").style.width = (i / qs.length * 100) + "%";
    $(".question").textContent = q.q;
    $(".reveal").hidden = true;
    step("Выбирай ты. Я не подглядываю", "", null);
    options(her => {
      $(".opts").hidden = true;
      step("Теперь передай телефон мне", "Телефон у меня", () => {
        step("Мой выбор", "", null);
        options(his => reveal(her, his));
      });
    });
  }

  function reveal(her, his) {
    const q = qs[i], same = her === his;
    if (same) matches++;
    answers.push({ q: q.q, her: q.options[her], his: q.options[his], same });
    $(".opts").hidden = true;
    const r = $(".reveal");
    r.hidden = false;
    r.innerHTML = `<div><small>Ты</small><b></b></div><div><small>Я</small><b></b></div>`;
    const [a, b] = r.querySelectorAll("b");
    a.textContent = q.options[her]; b.textContent = q.options[his];
    r.classList.toggle("same", same);
    step(same ? "Совпали!" : "У нас разные ответы", i === qs.length - 1 ? "Узнать итог" : "Дальше", () => { i++; i < qs.length ? show() : finish(); });
    $(".react").textContent = same ? "Котики в восторге" : "Обсудите, почему так";
    if (same) api.celebrate();
  }

  async function finish() {
    const share = matches / qs.length;
    const verdict = share >= .75 ? "Мы думаем одинаково. Это любовь" : share >= .5 ? "Очень похоже! Котики довольны" : share >= .25 ? "Мы разные, и это интересно" : "Похоже, нам есть о чём поговорить";
    root.innerHTML = `
      <div class="panel quiz done">
        <h2 class="panel-title">${stage.title}</h2>
        <p class="big-score">${matches} <small>из ${qs.length}</small></p>
        <p class="verdict">${verdict}</p>
        <p class="note" aria-live="polite"></p>
        <div class="row"><button class="btn yes" type="button">К этапам</button></div>
      </div>`;
    root.querySelector(".btn").addEventListener("click", api.back);
    api.celebrate();
    root.querySelector(".note").textContent = await api.save({ matches, total: qs.length, answers });
  }

  show();
}
