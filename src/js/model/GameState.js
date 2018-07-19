let gameState = (function() {
  let instance;

  let _moves = Symbol('moves');
  let _stars = Symbol('stars');
  let _cards = Symbol('cards');
  let _timerSeconds = Symbol('timerSeconds');

  class GameState extends EventTarget {
    constructor(moves, stars, cards, timerSeconds) {
      super();
      this[_moves] = moves;
      this[_stars] = stars,
      this[_cards] = cards;
      this[_timerSeconds] = timerSeconds;
    }

    setMoves(moves) {
      this[_moves] = moves;
      let event = new Event("moves");
      this.dispatchEvent(event);
    }

    incMoves() {
      this[_moves] += 1;
      let event = new CustomEvent("moves", {detail: {moves: this[_moves]}});
      this.dispatchEvent(event);
    }

    setStars(stars) {
      this[_stars] = stars;
      console.log("Dispatch stars event");
    }

    setTimer(timerSeconds) {
      this[_timerSeconds] = timerSeconds;
      console.log("Dispatch timer event");
    }

    setCard(card, index) {
      this.cards[index] = card;
      console.log("Dispatch card event");
    }

    setCards(cards) {
      this[_cards] = cards;
    }

    getCards(){
      return this[_cards];
    }
  }

  function init() {
    let deck = [];
    for(let card of deckGenerator.generator(
                    deckGenerator.DECK_MOBILE_ICONS,
                    deckGenerator.DECK_SIZE)) {
                      deck.push(card);
    }
    deck = util.shuffle(deck);

    return new GameState(0, 1, deck, 0);
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