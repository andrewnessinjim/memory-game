function initMovesView() {
  let movesVal = document.querySelector('.moves__val');
  let summaryMovesVal = document.querySelector('.summary__movesVal')

  gameState.getInstance().addEventListener('moves',function(event) {
    movesVal.textContent = event.detail.moves;
  });

  gameState.getInstance().addEventListener('reset',function() {
    movesVal.textContent = event.detail.moves;
  });

  gameState.getInstance().addEventListener('win',function() {
    summaryMovesVal.textContent = gameState.getInstance().getMoves();
  });
}