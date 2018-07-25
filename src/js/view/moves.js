function initMovesView() {
  const movesVal = document.querySelector('.moves__val');
  const summaryMovesVal = document.querySelector('.summary__movesVal');
  const gState = gameState.getInstance();

  gState.addEventListener('moves',function(event) {
    movesVal.textContent = gState.getMoves();
  });

  gState.addEventListener('reset',function() {
    movesVal.textContent = gState.getMoves();
  });

  gState.addEventListener('win',function() {
    summaryMovesVal.textContent = gState.getMoves();
  });
}