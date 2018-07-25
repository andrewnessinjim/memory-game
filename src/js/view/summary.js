function initSummaryView() {
  let summary = document.querySelector('.summary');
  const gState = gameState.getInstance();

  gState.addEventListener('win',function(event) {
    summary.classList.remove('summary--hide');
  });

  gState.addEventListener('reset',function(event) {
    summary.classList.add('summary--hide');
  });
}