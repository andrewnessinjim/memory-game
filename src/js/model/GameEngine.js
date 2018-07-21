/*
The gameEngine receives calls from the controller, and decides how to change the
state of the game. The state of the game is implemented a a singleton object which
can be accessed by gameState.getInstance()
*/
let gameEngine = {
  cardClicked: function(cardIndex) {
    let localGameState = gameState.getInstance();
    let waitingCard = localGameState.getWaitingCard();
    if(waitingCard) { //A card is already open. We try to match it now.
      localGameState.incMoves();
      let selectedCard = localGameState.getCard(cardIndex);
      if(selectedCard.getId() === waitingCard.getId()) { //User matched a pair
        localGameState.setCardState(waitingCard.getIndex(), cards.STATE_OPEN);
        localGameState.setCardState(selectedCard.getIndex(), cards.STATE_OPEN);
        localGameState.setWaitingCard(null);
        controller.idle = true;
      } else { //User failed to match a pair
        localGameState.setCardState(selectedCard.getIndex(), cards.STATE_OPEN);
        setTimeout(function() {
          localGameState.setCardState(selectedCard.getIndex(), cards.STATE_CLOSED);
          localGameState.setCardState(waitingCard.getIndex(), cards.STATE_CLOSED);
          localGameState.setWaitingCard(null);
          controller.idle = true;
        }, 2000);
      }
    } else { //This is the first card of the pair the user is trying to match
      localGameState.setWaitingCard(localGameState.getCard(cardIndex));
      controller.idle = true;
    }
  }
}