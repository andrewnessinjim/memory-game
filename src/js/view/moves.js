function initMovesView() {
  gameState.getInstance().addEventListener('moves',function(event) {
    let movesContainer = document.querySelector('.moves-val');
    movesContainer.textContent = event.detail.moves;
  })
}