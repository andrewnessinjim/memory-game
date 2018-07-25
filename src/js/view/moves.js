function initMovesView() {
  const movesVal = document.querySelector('.moves__val');
  const summaryMovesVal = document.querySelector('.summary__movesVal');
  const gState = gameState.getInstance();

  gState.addEventListener('moves',function(event) {
    movesVal.textContent = event.detail.moves;
  });

  gState.addEventListener('reset',function() {
    movesVal.textContent = event.detail.moves;
  });

  gState.addEventListener('win',function() {
    summaryMovesVal.textContent = gameState.getInstance().getMoves();
  });
}