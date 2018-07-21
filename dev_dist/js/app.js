let controller = {
  cardClicked: function(cardId) {
    if(this.idle) {
      this.idle = false;
      gameEngine.cardClicked(cardId);
    }
  },
  /* Controller will set this flag to false when calling the game engine.
   * Game Engine will set this flag to true before returning.
   */
  idle: true
}
document.addEventListener('DOMContentLoaded', function() {
  initCardsView();
  initStarsView();
  initTimerView();
  initMovesView();
});
/*
cards object exposes a Card class which holds data related to a single card.
It also exposes 3 constants, to be used as the values for the state of the card:
  - STATE_OPEN -> The card is visible to the user.
  - STATE_CLOSED -> The card is not visible to the user.
  - STATE_WAITING -> The card is visible to the user, but may get closed later.
 */
let cards = (function() {
  const
    STATE_OPEN= 'state_open',
    STATE_CLOSED= 'state_closed',
    STATE_WAITING= 'state_waiting';

  let _url = Symbol('URL');
  let _state = Symbol('state');
  let _id = Symbol('id');
  let _index = Symbol('index');

  return {
    Card: class Card {
      constructor(url, state, id) {
        this[_url] = url;
        this[_state] = state;
        this[_id] = id;
      }

      getURL() {
        return this[_url];
      }

      getId() {
        return this[_id];
      }

      getIndex() {
        return this[_index];
      }

      setIndex(index) {
        this[_index] = index;
      }

      setState(state) {
        this[_state] = state;
      }

      getState(){
        return this[_state];
      }
    },
    STATE_OPEN: STATE_OPEN,
    STATE_CLOSED: STATE_CLOSED,
    STATE_WAITING: STATE_WAITING
  }
})();
/*
deckGenerator object exposes a generator function that can be used to generate cards.
It also exposes some constants.
*/
let deckGenerator = (function(){
  //Only one deck and one deck size supported for now. Can be parameterized later.
  const DECK_MOBILE_ICONS = 'mobile_icons';
  const DECK_SIZE = 16;

  const availableDecks = {
    [DECK_MOBILE_ICONS]: {
      count: 380
    }
  };

  function* generator(deckName, count) {
    //Cards are matched in pairs. So we need even number of cards
    if(count % 2 != 0) {
      throw `Cannot create deck with ${count} cards. Only even numbered decks can be created`;
    }

    //Total number of cards in the deck
    let upperLimit =  availableDecks[deckName].count;

    //All cards of a deck are present in deckName directory
    let urlPrefix = `images/decks/${deckName}/`;

    //Each loop will generate 2 cards with same image. So looping half the number of cards
    for(let i = 0; i < count/2; i++) {
      let num = Math.floor(Math.random() * upperLimit) + 1;
      const url = `${urlPrefix}${num.toString().padStart(4, '0')}.svg`;
      let card1 = new cards.Card(url, cards.STATE_CLOSED, num);
      let card2 = new cards.Card(url, cards.STATE_CLOSED, num);
      yield card1;
      yield card2;
    }
  }

  return {
    DECK_MOBILE_ICONS: DECK_MOBILE_ICONS,
    DECK_SIZE: DECK_SIZE,
    generator: generator
  }
})();
/*
The gameEngine receives calls from the controller, and decides how to change the
state of the game. The state of the game is implemented a a singleton object which
can be accessed by gameState.getInstance()
*/
let gameEngine = {
  cardClicked: function(cardIndex) {
    let gState = gameState.getInstance();
    let waitingCard = gState.getWaitingCard();

    if(waitingCard) { //A card is already open. We try to match it now.
      gState.incMoves();
      let selectedCard = gState.getCard(cardIndex);

      if(selectedCard.getId() === waitingCard.getId()) { //User matched a pair

        gState.setCardState(waitingCard.getIndex(), cards.STATE_OPEN);
        gState.setCardState(selectedCard.getIndex(), cards.STATE_OPEN);
        gState.setWaitingCard(null);
        controller.idle = true;
      } else { //User failed to match a pair

        gState.setCardState(selectedCard.getIndex(), cards.STATE_OPEN);
        setTimeout(function() {

          gState.setCardState(selectedCard.getIndex(), cards.STATE_CLOSED);
          gState.setCardState(waitingCard.getIndex(), cards.STATE_CLOSED);
          gState.setWaitingCard(null);
          controller.idle = true;
        }, 2000);
      }
    } else { //This is the first card of the pair the user is trying to match

      gState.setWaitingCard(gState.getCard(cardIndex));
      controller.idle = true;
    }
  }
}
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

  class GameState extends EventTarget {
    constructor(moves, stars, cards, timerSeconds) {
      super();
      this[_moves] = moves;
      this[_stars] = stars,
      this[_cards] = cards;
      this[_timerSeconds] = timerSeconds;
    }

    incMoves() {
      this[_moves] += 1;
      let event = new CustomEvent('moves', {detail: {moves: this[_moves]}});
      this.dispatchEvent(event);
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
  }

  function init() {
    let deck = [];
    for(let card of deckGenerator.generator(
                    deckGenerator.DECK_MOBILE_ICONS,
                    deckGenerator.DECK_SIZE)) {
                      deck.push(card);
    }
    deck = util.shuffle(deck);

    for(let i = 0; i < deck.length; i++) {
      deck[i].setIndex(i);
    }

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
if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength,padString) {
      targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
      padString = String((typeof padString !== 'undefined' ? padString : ' '));
      if (this.length > targetLength) {
          return String(this);
      }
      else {
          targetLength = targetLength-this.length;
          if (targetLength > padString.length) {
              padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
          }
          return padString.slice(0,targetLength) + String(this);
      }
  };
}
let util = {
  shuffle: function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
}
function initCardsView() {
  const cardsContainer = document.querySelector('.cards-container');

  for(let card of gameState.getInstance().getCards()) {
    cardsContainer.appendChild(createCardDiv(card));
  }

  function createCardDiv(card){
    const div = document.createElement('div');
    div.classList.add('card');
    div.setAttribute('card_id', card.getId());
    div.setAttribute('card-index', card.getIndex());
    setCardState(div, card);

    return div;
  }

  cardsContainer.addEventListener('click', function(event) {
    const cardIndex = event.target.getAttribute('card-index');
    if(cardIndex) {
      controller.cardClicked(cardIndex);
    }
  });

  gameState.getInstance().addEventListener('state', function(event) {
    let card = event.detail.card;
    let div = document.querySelector(`.card[card-index="${card.getIndex()}"]`)
    setCardState(div, card);
  })

  function setCardState(div, card) {
    div.classList.remove('card-closed');
    if(card.getState() === cards.STATE_CLOSED) {
      div.classList.add('card-closed');
      div.style.backgroundImage = '';
    } else if (
      card.getState() === cards.STATE_OPEN
      || card.getState() === cards.STATE_WAITING
    ){
      div.style.backgroundImage = `url(${card.getURL()})`;
    }
  }
}
function initMovesView() {
  gameState.getInstance().addEventListener('moves',function(event) {
    let movesContainer = document.querySelector('.moves-val');
    movesContainer.textContent = event.detail.moves;
  })
}
function initStarsView() {
  gameState.getInstance().setStars(1);
}
function initTimerView() {
  gameState.getInstance().setTimer(0);
}