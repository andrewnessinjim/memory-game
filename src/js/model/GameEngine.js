/*
The gameEngine receives calls from the controller, and decides how to change the
state of the game. The state of the game is implemented a a singleton object which
can be accessed by gameState.getInstance()
*/
let gameEngine = {
  cardClicked: function(cardIndex) {
    let gState = gameState.getInstance();
    let waitingCard = gState.getWaitingCard();
    let selectedCard = gState.getCard(cardIndex);

    if(selectedCard.getState() === cards.STATE_OPEN ||
        selectedCard.getState() === cards.STATE_WAITING) {
          //User clicked on already opened card, ignore
          controller.idle = true;
          return;
    }

    if(waitingCard) { //A card is already open. We try to match it now.
      gState.incMoves();

      if(selectedCard.getId() === waitingCard.getId()) { //User matched a pair

        gState.setCardState(waitingCard.getIndex(), cards.STATE_OPEN);
        gState.setCardState(selectedCard.getIndex(), cards.STATE_OPEN);
        gState.setWaitingCard(null);
      } else { //User failed to match a pair

        gState.setCardState(selectedCard.getIndex(), cards.STATE_OPEN);
        setTimeout(function() {

          gState.setCardState(selectedCard.getIndex(), cards.STATE_CLOSED);
          gState.setCardState(waitingCard.getIndex(), cards.STATE_CLOSED);
          gState.setWaitingCard(null);
        }, 2000);
      }
    } else { //This is the first card of the pair the user is trying to match

      gState.setWaitingCard(selectedCard);
    }
  },
  reset: function() {
    gameState.getInstance().reset();
  },
  incTimer: function() {
    gameState.getInstance().incTimerSeconds();
  }
}