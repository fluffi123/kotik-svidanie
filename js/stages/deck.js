export function render(root, stage) {
  const order = stage.cards.map((_, i) => i).sort(() => Math.random() - .5);
  let i = 0;

  root.innerHTML = `
    <div class="panel deck">
      <h2 class="panel-title">${stage.title}</h2>
      <p class="sub">${stage.desc}</p>
      <div class="qcard" aria-live="polite"><span class="qnum"></span><p class="qtext"></p></div>
      <div class="row">
        <button class="btn yes next" type="button">Следующий вопрос</button>
      </div>
    </div>`;
  const card = root.querySelector(".qcard");

  function show() {
    root.querySelector(".qnum").textContent = `${i + 1} / ${order.length}`;
    root.querySelector(".qtext").textContent = stage.cards[order[i]];
  }
  root.querySelector(".next").addEventListener("click", () => {
    i = (i + 1) % order.length;
    card.animate([{ transform: "rotateY(0)" }, { transform: "rotateY(90deg)" }], { duration: 160, easing: "ease-in" }).finished.then(() => {
      show();
      card.animate([{ transform: "rotateY(-90deg)" }, { transform: "rotateY(0)" }], { duration: 200, easing: "ease-out" });
    });
  });
  show();
}
