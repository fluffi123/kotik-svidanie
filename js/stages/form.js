const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z"/></svg>';

export function render(root, stage, api) {
  const values = {};
  root.innerHTML = `
    <form class="panel form">
      <h2 class="panel-title">${stage.title}</h2>
      ${stage.fields.map(f => f.type === "hearts" ? `
        <div class="field"><div class="lbl">${f.label}</div>
          <div class="hearts" data-id="${f.id}" role="radiogroup" aria-label="${f.label}">
            ${[1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="false" aria-label="${n} из 5" data-n="${n}">${HEART}</button>`).join("")}
          </div></div>` : `
        <div class="field"><label class="lbl" for="f-${f.id}">${f.label}</label>
          <textarea id="f-${f.id}" data-id="${f.id}" rows="2" maxlength="500"></textarea></div>`).join("")}
      <p class="note" aria-live="polite"></p>
      <div class="row"><button class="btn yes" type="submit">Отправить котикам</button></div>
    </form>`;

  root.querySelectorAll(".hearts").forEach(group => {
    const btns = [...group.children];
    btns.forEach(b => b.addEventListener("click", () => {
      const n = +b.dataset.n;
      values[group.dataset.id] = n;
      btns.forEach(x => {
        const on = +x.dataset.n <= n;
        x.classList.toggle("on", on);
        x.setAttribute("aria-checked", +x.dataset.n === n ? "true" : "false");
      });
    }));
  });

  const form = root.querySelector("form");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    root.querySelectorAll("textarea").forEach(t => { if (t.value.trim()) values[t.dataset.id] = t.value.trim(); });
    const note = root.querySelector(".note");
    if (!Object.keys(values).length) { note.textContent = "Котик ждёт хотя бы пару слов"; return; }
    form.querySelector("[type=submit]").disabled = true;
    const status = await api.save(values);
    root.innerHTML = `
      <div class="panel form done">
        <h2 class="panel-title">Спасибо!</h2>
        <p class="verdict">Котики унесли твой ответ</p>
        <p class="note">${status}</p>
        <div class="row"><button class="btn yes" type="button">К этапам</button></div>
      </div>`;
    root.querySelector(".btn").addEventListener("click", api.back);
    api.celebrate();
  });
}
