/*
The gameEngine receives calls from the controller, and decides how to change the
state of the game. The state of the game is implemented a a singleton object which
can be accessed by gameState.getInstance()
*/
let gameEngine = (function() {
  const timerWeightage = 0.25;
  const movesWeightage = 0.75;

  let movesPenaltyFactor = 0.001;
  let timerPenaltyFactor = 0.01;
  let timerIncrementPenaltyFactor = 0.01;

  function calculateStars(didMove, didTimerIncrease) {
    const gState = gameState.getInstance();
    const deckSize = gState.getCards().length;
    const moves = gState.getMoves();
    const timerSeconds = gState.getTimerSeconds();

    let movesScore;
    if (moves < (3 * deckSize / 4)) {
      movesScore = 1;
    } else {
      movesScore = 1 - movesPenaltyFactor;
      if (didMove) {
        movesPenaltyFactor *= 2;
      }
    }

    let timerScore;
    if(timerSeconds < (2 * deckSize)) {
      timerScore = 1;
    } else {
      timerScore = 1 - timerPenaltyFactor;
      if(didTimerIncrease) {
        timerPenaltyFactor += timerIncrementPenaltyFactor;
      }
    }

    let stars = (timerScore * timerWeightage) + (movesScore * movesWeightage);
    gState.setStars(stars);

  };

  return {
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
        calculateStars(true, false);

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
      calculateStars(false, true);
    }
  };
})();