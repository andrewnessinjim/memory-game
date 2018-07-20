let gameEngine = {
  cardClicked: function(cardIndex) {
    let localGameState = gameState.getInstance();
    let waitingCard = localGameState.getWaitingCard();
    if(waitingCard) {

    } else {
      localGameState.setWaitingCard(localGameState.getCard(cardIndex));
    }
  }
}