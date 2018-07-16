let gameState = (function() {
  let instance;

  class GameState extends EventTarget {
    constructor(moves, stars, cards, timerSeconds) {
      super();
      this.moves = moves;
      this.stars = stars,
      this.cards = cards;
      this.timerSeconds = timerSeconds;
    }

    setMoves(moves) {
      this.moves = moves;
      console.log("Dispatch moves event");
    }

    setStars(stars) {
      this.stars = stars;
      console.log("Dispatch stars event");
    }

    setTimer(timerSeconds) {
      this.timerSeconds = timerSeconds;
      console.log("Dispatch timer event");
    }

    setCard(card, index) {
      this.cards[index] = card;
      console.log("Dispatch card event");
    }

    setCards(cards) {
      this.cards = cards;
    }
  }

  function init() {
    return new GameState(0, 1, [], 0);
  }

  return {
    getInstance: function() {
      if(!instance){
        instance = init();
      }
      return instance;
    }
  }
})();