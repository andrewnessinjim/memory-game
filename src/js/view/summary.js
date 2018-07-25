function initSummaryView() {
  let summary = document.querySelector('.summary');
  let timerVal = document.querySelector('.summary__timerVal');
  let movesVal = document.querySelector('.summary__movesVal')

  gameState.getInstance().addEventListener('win',function(event) {
    summary.classList.remove('summary--hide');

    let seconds = gameState.getInstance().getTimerSeconds();
    timerVal.textContent = util.secsToMinSecs(seconds);
    movesVal.textContent = gameState.getInstance().getMoves();
  })

  gameState.getInstance().addEventListener('reset',function(event) {
    summary.classList.add('summary--hide');
  })
}