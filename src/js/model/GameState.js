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
  let _moves = Symbol('moves');
  let _stars = Symbol('stars');
  let _cards = Symbol('cards');
  let _timerSeconds = Symbol('timerSeconds');
  let _waitingCard = Symbol('waitingCard');
  let _dispatchMovesEvent = Symbol('dispatchMovesEvent');
  let _dispatchStarsEvent = Symbol('dispatchStarsEvent');
  let _dispatchResetEvent = Symbol('dispatchResetEvent');

  class GameState extends EventTarget {
    constructor(moves, stars, cards, timerSeconds) {
      super();
      this[_moves] = moves;
      this[_stars] = stars,
      this[_cards] = cards;
      this[_timerSeconds] = timerSeconds;
    }

    [_dispatchMovesEvent]() {
      let event = new CustomEvent('moves', {detail: {moves: this[_moves]}});
      this.dispatchEvent(event);
    }

    [_dispatchStarsEvent]() {
      let event = new CustomEvent('stars', {detail: {stars: this[_stars]}});
      this.dispatchEvent(event);
    }

    [_dispatchResetEvent]() {
      let resetEvent = new CustomEvent('reset', {
        detail: {
          moves: this[_moves],
          stars: this[_stars]
        }
      });
      this.dispatchEvent(resetEvent);
    }

    incMoves() {
      this[_moves] += 1;
      this[_dispatchMovesEvent]();
    }

    setStars(stars) {
      this[_stars] = stars;
      console.log('Dispatch stars event');
    }

    setTimer(timerSeconds) {
      this[_timerSeconds] = timerSeconds;
      console.log('Dispatch timer event');
    }

    getCards(){
      return this[_cards];
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

    reset() {
      this[_moves] = 0;
      this[_stars] = 1;
      this[_timerSeconds] = 0;
      this[_cards] = generateDeck();
      this[_dispatchResetEvent]();
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