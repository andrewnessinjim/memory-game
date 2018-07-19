let gameEngine = {
  cardClicked: function(cardId) {
    gameState.getInstance().incMoves();
  }
}