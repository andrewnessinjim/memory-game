/*
The gameEngine receives calls from the controller, and decides how to change the
state of the game. The state of the game is implemented a a singleton object which
can be accessed by gameState.getInstance()
*/
let gameEngine = (function() {
  let hasGameStarted = false;

  const timerWeightage = 0.25;
  const movesWeightage = 0.75;

  let movesPenaltyFactor = 0.05;
  let movesIncrementPenaltyFactor = 0.05;
  let timerPenaltyFactor = 0.02;
  let timerIncrementPenaltyFactor = 0.01;

  let timer;
  let beginTimer = function() {
    return setInterval(function() {
      gameState.getInstance().incTimerSeconds();
      calculateStars(false, true);
    }, 1000);
  };

  let stopTimer = function(timer) {
    clearInterval(timer);
  };

  function calculateStars(didMove, didTimerIncrease) {
    const gState = gameState.getInstance();
    const deckSize = gState.getCards().length;
    const moves = gState.getMoves();
    const timerSeconds = gState.getTimerSeconds();

    let movesScore;
    if (moves <= deckSize) {
      movesScore = 1;
    } else {
      movesScore = 1 - movesPenaltyFactor;
      if (didMove) {
        movesPenaltyFactor += movesIncrementPenaltyFactor;
      }
    }

    let timerScore;
    if(timerSeconds <= (1.5 * deckSize)) {
      timerScore = 1;
    } else {
      timerScore = 1 - timerPenaltyFactor;
      if(didTimerIncrease) {
        timerPenaltyFactor += timerIncrementPenaltyFactor;
      }
    }

    let stars = 0;
    if(timerScore >= 0) {
      stars += (timerScore * timerWeightage);
    }

    if(movesScore >= 0) {
      stars += (movesScore * movesWeightage);
    }
    gState.setStars(stars);
  };

  let winListener =function() {
    stopTimer(timer);
  };

  return {
    cardClicked: function(cardIndex) {
      if(!hasGameStarted) {
        hasGameStarted = true;
        timer = beginTimer();

        gameState.getInstance().addEventListener('win', winListener);
      }
      let gState = gameState.getInstance();
      let waitingCard = gState.getWaitingCard();
      let selectedCard = gState.getCard(cardIndex);

      if(selectedCard.getState() === cards.STATE_WAITING ||
          selectedCard.getState() === cards.STATE_CORRECT_MATCH ||
          selectedCard.getState() === cards.STATE_INCORRECT_MATCH) {
            //User clicked on already opened card, ignore
            controller.idle = true;
            return;
      }

      if(waitingCard) { //A card is already open. We try to match it now.
        gState.incMoves();
        calculateStars(true, false);

        if(selectedCard.getId() === waitingCard.getId()) { //User matched a pair

          gState.setCardState(waitingCard.getIndex(), cards.STATE_CORRECT_MATCH);
          gState.setCardState(selectedCard.getIndex(), cards.STATE_CORRECT_MATCH);
          gState.setWaitingCard(null);
          gState.incMatches();
          if(gState.getMaxMatches() === gState.getCurrentMatches()) {
            gState.win();
          }
          controller.idle = true;
        } else { //User failed to match a pair
          gState.setCardState(waitingCard.getIndex(), cards.STATE_INCORRECT_MATCH);
          gState.setCardState(selectedCard.getIndex(), cards.STATE_INCORRECT_MATCH);
          setTimeout(function() {

            gState.setCardState(selectedCard.getIndex(), cards.STATE_CLOSED);
            gState.setCardState(waitingCard.getIndex(), cards.STATE_CLOSED);
            gState.setWaitingCard(null);
            controller.idle = true;
          }, 1000);
        }
      } else { //This is the first card of the pair the user is trying to match

        gState.setWaitingCard(selectedCard);
        controller.idle = true;
      }
    },
    reset: function() {
      movesPenaltyFactor = 0.001;
      timerPenaltyFactor = 0.01;
      timerIncrementPenaltyFactor = 0.01;
      hasGameStarted = false;
      clearInterval(timer);
      gameState.getInstance().removeEventListener('win', winListener);
      gameState.getInstance().reset();
    },
    incTimer: function() {
      gameState.getInstance().incTimerSeconds();
      calculateStars(false, true);
    }
  };
})();