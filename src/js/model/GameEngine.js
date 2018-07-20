let gameEngine = {
  cardClicked: function(cardIndex) {
    let localGameState = gameState.getInstance();
    let waitingCard = localGameState.getWaitingCard();
    if(waitingCard) {
      localGameState.incMoves();
      let selectedCard = localGameState.getCard(cardIndex);
      if(selectedCard.getId() === waitingCard.getId()) {
        localGameState.setCardState(waitingCard.getIndex(), cards.STATE_OPEN);
        localGameState.setCardState(selectedCard.getIndex(), cards.STATE_OPEN);
        localGameState.setWaitingCard(null);
        controller.idle = true;
      } else {
        localGameState.setCardState(selectedCard.getIndex(), cards.STATE_OPEN);
        setTimeout(function() {
          localGameState.setCardState(selectedCard.getIndex(), cards.STATE_CLOSED);
          localGameState.setCardState(waitingCard.getIndex(), cards.STATE_CLOSED);
          localGameState.setWaitingCard(null);
          controller.idle = true;
        }, 2000);
      }
    } else {
      localGameState.setWaitingCard(localGameState.getCard(cardIndex));
      controller.idle = true;
    }
  }
}