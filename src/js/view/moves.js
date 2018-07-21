function initMovesView() {
  let movesContainer = document.querySelector('.moves-val');

  gameState.getInstance().addEventListener('moves',function(event) {
    movesContainer.textContent = event.detail.moves;
  })

  gameState.getInstance().addEventListener('reset',function() {
    movesContainer.textContent = event.detail.moves;
  })
}