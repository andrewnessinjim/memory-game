function initMovesListener() {
  gameState.getInstance().addEventListener('moves',function(event) {
    let movesContainer = document.querySelector('.moves-container__moves-val');
    movesContainer.textContent = event.detail.moves;
  })
}