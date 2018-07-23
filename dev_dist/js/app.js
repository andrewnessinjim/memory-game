let controller = {
  cardClicked: function(cardId) {
    if(this.idle) {
      this.idle = false;
      gameEngine.cardClicked(cardId);
    }
  },
  reset: function() {
    if(this.idle) {
      this.idle =false;
      gameEngine.reset();
    }
  },
  incTimer: function() {
    gameEngine.incTimer();
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
  initResetButton();
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
    if(timerSeconds < (1 * deckSize)) {
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
          gState.incMatches();
          if(gState.getMaxMatches() === gState.getCurrentMatches()) {
            gState.win();
          }
          controller.idle = true;
        } else { //User failed to match a pair

          gState.setCardState(selectedCard.getIndex(), cards.STATE_OPEN);
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
      gameState.getInstance().reset();
    },
    incTimer: function() {
      gameState.getInstance().incTimerSeconds();
      calculateStars(false, true);
    }
  };
})();
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
  let _currentMatches = Symbol('currentMatches');
  let _maxMatches = Symbol('maxMatches');
  let _hasWon = Symbol('hasWon');
  let _dispatchMovesEvent = Symbol('dispatchMovesEvent');
  let _dispatchStarsEvent = Symbol('dispatchStarsEvent');
  let _dispatchResetEvent = Symbol('dispatchResetEvent');
  let _dispatchTimerEvent = Symbol('dispatchTimerEvent');
  let _dispatchWinEvent = Symbol('dispatchWinEvent');

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

    [_dispatchMovesEvent]() {
      let movesEvent = new CustomEvent('moves', {detail: {moves: this[_moves]}});
      this.dispatchEvent(movesEvent);
    }

    [_dispatchStarsEvent]() {
      let starsEvent = new CustomEvent('stars', {detail: {stars: this[_stars]}});
      this.dispatchEvent(starsEvent);
    }

    [_dispatchResetEvent]() {
      let resetEvent = new CustomEvent('reset', {
        detail: {
          moves: this[_moves],
          stars: this[_stars],
          seconds: this[_timerSeconds]
        }
      });
      this.dispatchEvent(resetEvent);
    }

    [_dispatchTimerEvent]() {
      let timerEvent = new CustomEvent('timer', {
        detail: {
          seconds: this[_timerSeconds]
        }
      });
      this.dispatchEvent(timerEvent);
    }

    [_dispatchWinEvent]() {
      let winEvent = new Event('win');
      this.dispatchEvent(winEvent);
    }

    win() {
      this[_hasWon] = true;
      this[_dispatchWinEvent]();
    }

    incMatches() {
      this[_currentMatches] += 1;
    }

    incMoves() {
      this[_moves] += 1;
      this[_dispatchMovesEvent]();
    }

    setStars(stars) {
      this[_stars] = stars;
      this[_dispatchStarsEvent]();
    }

    incTimerSeconds() {
      this[_timerSeconds] += 1;
      this[_dispatchTimerEvent]();
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

  drawCards();

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

  gameState.getInstance().addEventListener('reset', function() {
    while(cardsContainer.firstChild) {
      cardsContainer.removeChild(cardsContainer.firstChild);
    }
    drawCards();
    controller.idle = true;
  })

  function drawCards() {
    for (let card of gameState.getInstance().getCards()) {
      cardsContainer.appendChild(createCardDiv(card));
    }
    function createCardDiv(card) {
      const div = document.createElement('div');
      div.classList.add('card');
      div.setAttribute('card_id', card.getId());
      div.setAttribute('card-index', card.getIndex());
      setCardState(div, card);
      return div;
    }
  }

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
  let movesContainer = document.querySelector('.moves-val');

  gameState.getInstance().addEventListener('moves',function(event) {
    movesContainer.textContent = event.detail.moves;
  })

  gameState.getInstance().addEventListener('reset',function() {
    movesContainer.textContent = event.detail.moves;
  })
}
function initResetButton() {
  let resetButton = document.querySelector('.controls__reset');
  resetButton.addEventListener('click', function() {
    controller.reset();
  });
}
function initStarsView() {
  let starsVal = document.querySelector('.stars__val');
  starsVal.textContent = gameState.getInstance().getStars();

  gameState.getInstance().addEventListener('stars', function(event) {
    starsVal.textContent = event.detail.stars;
  })
}
function initTimerView() {
  const timerView = document.querySelector('.timer__seconds');
  const gState = gameState.getInstance();

  drawTime(gState.getTimerSeconds());

  let timerInterval = setInterval(function() {
    controller.incTimer()
  }, 1000);

  gState.addEventListener('timer', function(event) {
    drawTime(event.detail.seconds);
  });

  gState.addEventListener('reset', function(event) {
    drawTime(event.detail.seconds);
    clearInterval(timerInterval);
    timerInterval = setInterval(function() {
      controller.incTimer()
    }, 1000);
  });

  gState.addEventListener('win', function(){
    clearInterval(timerInterval);
  })

  function drawTime(seconds) {
    let minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    seconds = Math.floor(seconds - (minutes * 60)).toString().padStart(2, '0');
    timerView.textContent = `${minutes}:${seconds}`;
  }
}