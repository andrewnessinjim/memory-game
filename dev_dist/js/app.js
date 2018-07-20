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
  initializeCards();
  starsView.initializeStars();
  timerView.initializeTimer();
  initMovesListener();
});
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
let deckGenerator = (function(){
  const DECK_MOBILE_ICONS = 'mobile_icons';
  const DECK_SIZE = 16;

  const availableDecks = {
    [DECK_MOBILE_ICONS]: {
      count: 380
    }
  };

  function* generator(deckName, count) {
    if(count % 2 != 0) {
      throw `Cannot create deck with ${count} cards. Only even numbered decks can be created`;
    }

    let upperLimit =  availableDecks[deckName].count;
    let urlPrefix = `images/decks/${deckName}/`;

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
let gameState = (function() {
  let instance;

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
function initializeCards() {
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
    controller.cardClicked(event.target.getAttribute('card-index'));
    console.log(event.target);
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
function initMovesListener() {
  gameState.getInstance().addEventListener('moves',function(event) {
    let movesContainer = document.querySelector('.moves-val');
    movesContainer.textContent = event.detail.moves;
  })
}
let starsView = {
  initializeStars: function() {
    gameState.getInstance().setStars(1);
  }
}
let timerView = {
  initializeTimer: function() {
    gameState.getInstance().setTimer(0);
  }
}