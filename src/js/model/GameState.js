/*
gameState object is created from the GameState class as a singleton object.
All the game state is stored in this object, and whenever any setter methods
are called on this object, it emits events to notify all listeners. The listeners
are typically UI components which update themselves on receiving events from
gameState object.
*/
let gameState = (function() {
  let instance;

  //Symbols for implementing private variables.
  const _moves = Symbol('moves');
  const _stars = Symbol('stars');
  const _cards = Symbol('cards');
  const _timerSeconds = Symbol('timerSeconds');
  const _waitingCard = Symbol('waitingCard');
  const _currentMatches = Symbol('currentMatches');
  const _maxMatches = Symbol('maxMatches');
  const _hasWon = Symbol('hasWon');

  class GameState extends EventTarget {
    constructor(moves, stars, cards, timerSeconds) {
      super();
      this[_moves] = moves;
      this[_stars] = stars,
      this[_cards] = cards;
      this[_timerSeconds] = timerSeconds;
      this[_currentMatches] = 0;
      this[_maxMatches] = cards.length / 2;
      this[_hasWon] = false;
    }

    win() {
      this[_hasWon] = true;
      this.dispatchEvent(new Event('win'));
    }

    incMatches() {
      this[_currentMatches] += 1;
    }

    incMoves() {
      this[_moves] += 1;
      this.dispatchEvent(new Event('moves'));
    }

    setStars(stars) {
      this[_stars] = stars;
      this.dispatchEvent(new Event('stars'));
    }

    incTimerSeconds() {
      this[_timerSeconds] += 1;
      this.dispatchEvent(new Event('timer'));
    }

    getCards(){
      return this[_cards];
    }

    getTimerSeconds() {
      return this[_timerSeconds];
    }

    getStars() {
      return this[_stars];
    }

    getMoves() {
      return this[_moves];
    }

    setCardState(index, state) {
      this[_cards][index].setState(state);
      let cardStateEvent = new CustomEvent("state", {detail: {card: this[_cards][index]}});
      this.dispatchEvent(cardStateEvent);
    }

    setWaitingCard(card) {
      this[_waitingCard] = card;

      if(card) {
        card.setState(cards.STATE_WAITING);
        let cardStateEvent = new CustomEvent("state", {detail: {card: card}});
        this.dispatchEvent(cardStateEvent);
      }
    }

    getWaitingCard() {
      return this[_waitingCard];
    }

    getCard(cardIndex) {
      return this[_cards][cardIndex];
    }

    getCurrentMatches() {
      return this[_currentMatches];
    }

    getMaxMatches() {
      return this[_maxMatches];
    }

    reset() {
      this[_moves] = 0;
      this[_stars] = 1;
      this[_timerSeconds] = 0;
      this[_cards] = generateDeck();
      this[_currentMatches] = 0;
      this[_maxMatches] = this[_cards].length / 2;
      this[_hasWon] = false;
      this.dispatchEvent(new Event('reset'));
    }
  }

  function init() {
    let deck = generateDeck();
    return new GameState(0, 1, deck, 0);
  }

  function generateDeck() {
    let deck = [];
    for (let card of deckGenerator.generator(deckGenerator.DECK_MOBILE_ICONS, deckGenerator.DECK_SIZE)) {
      deck.push(card);
    }
    deck = util.shuffle(deck);
    for (let i = 0; i < deck.length; i++) {
      deck[i].setIndex(i);
    }
    return deck;
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