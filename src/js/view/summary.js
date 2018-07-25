function initSummaryView() {
  let summary = document.querySelector('.summary');

  gameState.getInstance().addEventListener('win',function(event) {
    summary.classList.remove('summary--hide');
  });

  gameState.getInstance().addEventListener('reset',function(event) {
    summary.classList.add('summary--hide');
  });
}