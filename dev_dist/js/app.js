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
  initDashboardView();
  initSummaryView();
  initCardsView();
  initStarsView();
  initTimerView();
  initMovesView();
  initWelcomeForm();
  initControls();
  initMagnetButton();

  document.querySelector('.app').classList.remove('app--hide');
});
/*
cards object exposes a Card class which holds data related to a single card.
It also exposes 3 constants, to be used as the values for the state of the card:
  - STATE_CLOSED -> The card is not visible to the user.
  - STATE_WAITING -> The card is visible to the user, but may get closed later.
  - STATE_CORRECT_MATCH -> Card is matched correctly. It will stay open.
  - STATE_INCORRECT_MATCH -> Card is matched incorrctly. May get closed later.
 */
let cards = (function() {
  const
    STATE_CLOSED= 'STATE_CLOSED',
    STATE_WAITING= 'STATE_WAITING';
    STATE_CORRECT_MATCH = 'STATE_CORRECT_MATCH';
    STATE_INCORRECT_MATCH = 'STATE_INCORRECT_MATCH';

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

    STATE_CLOSED: STATE_CLOSED,
    STATE_WAITING: STATE_WAITING,
    STATE_CORRECT_MATCH: STATE_CORRECT_MATCH,
    STATE_INCORRECT_MATCH: STATE_INCORRECT_MATCH
  }
})();
/*
deckGenerator object exposes a generator function that can be used to generate cards.
It also exposes constants for deck names and deck size.
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
function initCardsView() {
  const cardsContainer = document.querySelector('.cards');
  const gState = gameState.getInstance();

  drawCards();

  cardsContainer.addEventListener('click', function(event) {
    const cardIndex = event.target.getAttribute('card-index');
    if(cardIndex) { //Ensure a card was clicked
      controller.cardClicked(cardIndex);
    }
  });

  gState.addEventListener('state', function(event) {
    let card = event.detail.card;
    let div = document.querySelector(`.card[card-index="${card.getIndex()}"]`)
    setCardState(div, card);
  });

  gState.addEventListener('reset', function() {
    util.removeAllChildren(cardsContainer);
    drawCards();
    cardsContainer.classList.remove('cards--hide');
    controller.idle = true;
  });

  gState.addEventListener('win', function() {
    cardsContainer.classList.add('cards--hide');
  });

  function drawCards() {
    for (let card of gameState.getInstance().getCards()) {
      cardsContainer.appendChild(createCardDiv(card));
    }

    function createCardDiv(card) {
      const frontDiv = document.createElement('div');

      const cardImg = document.createElement('img');
      cardImg.classList.add('card__image');
      cardImg.setAttribute('src', card.getURL());
      frontDiv.appendChild(cardImg);
      frontDiv.classList.add('card__front');

      const backDiv = document.createElement('div');
      backDiv.classList.add('card__back');

      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      cardDiv.setAttribute('card_id', card.getId());
      cardDiv.setAttribute('card-index', card.getIndex());
      cardDiv.appendChild(frontDiv);
      cardDiv.appendChild(backDiv);

      setCardState(cardDiv, card);
      return cardDiv;
    }
  }

  function setCardState(cardDiv, card) {
    const frontDiv = cardDiv.querySelector('.card__front');
    frontDiv.classList.remove('card__front--show');
    frontDiv.classList.remove('card__front--hide');
    frontDiv.classList.remove('card__front--matched');
    frontDiv.classList.remove('card__front--incorrectMatch');

    const backDiv = cardDiv.querySelector('.card__back');
    backDiv.classList.remove('card__back--show');
    backDiv.classList.remove('card__back--hide');

    if(card.getState() === cards.STATE_CLOSED) {
      frontDiv.classList.add('card__front--hide');
      backDiv.classList.add('card__back--show');

    } else if(card.getState() === cards.STATE_WAITING) {
      frontDiv.classList.add('card__front--show');
      backDiv.classList.add('card__back--hide');

    } else if (card.getState() === cards.STATE_CORRECT_MATCH){
      frontDiv.classList.add('card__front--show');
      frontDiv.classList.add('card__front--matched');
      backDiv.classList.add('card__back--hide');

    } else if (card.getState() === cards.STATE_INCORRECT_MATCH){
      frontDiv.classList.add('card__front--show');
      frontDiv.classList.add('card__front--incorrectMatch');
      backDiv.classList.add('card__back--hide');
    }
  }
}
function initControls() {
  const resetButton = document.querySelector('.controls__reset');
  const playAgain = document.querySelector('.summary__playAgain');
  const directionsButton = document.querySelector('.controls__directions');
  const attributionsButton = document.querySelector('.controls__attributions');
  const modal = document.querySelector('.modal');
  const modalClose = document.querySelector('.modal__close');
  const directionsContent = document.querySelector('.directions');
  const attributionsContent = document.querySelector('.attributions');

  resetButton.addEventListener('click', function() {
    controller.reset();
  });

  playAgain.addEventListener('click', function() {
    controller.reset();
  });

  directionsButton.addEventListener('click', function() {
    revealDirections();
  });

  attributionsButton.addEventListener('click', function() {
    modal.classList.add('modal--show');
    attributionsContent.classList.add('attributions--show');
  });

  modalClose.addEventListener('click', function() {
    modal.classList.remove('modal--show');
    directionsContent.classList.remove('directions--show');
    attributionsContent.classList.remove('attributions--show');
  });

  function revealDirections() {
    modal.classList.add('modal--show');
    directionsContent.classList.add('directions--show');
  }

  //Reveal directions on app startup
  let welcome = document.cookie.replace(/(?:(?:^|.*;\s*)welcome\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  if(!welcome || welcome === 'yes') {
    revealDirections();
  }
}

function initMagnetButton() {
  const magnetButton = document.querySelector('.magnet');
  const header = document.querySelector('.header');

  magnetButton.addEventListener('click', function() {
    header.classList.toggle('header--showTitle');
    header.classList.toggle('header--showControls');

    magnetButton.classList.toggle('magnet--toRight');
    magnetButton.classList.toggle('magnet--toLeft');
  });
}

function initWelcomeForm() {
  const welcomeCheckbox = document.getElementById('welcome');
  let welcome = document.cookie.replace(/(?:(?:^|.*;\s*)welcome\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  if(!welcome || welcome === 'yes') {
    welcomeCheckbox.checked = false;
  } else {
    welcomeCheckbox.checked = true;
  }

  welcomeCheckbox.addEventListener('click', function() {
    if(welcomeCheckbox.checked) {
      document.cookie = "welcome=no";
    } else {
      document.cookie = "welcome=yes";
    }
  });
}
function initDashboardView() {
  const dashboard = document.querySelector('.dashboard');
  const gState = gameState.getInstance();

  gState.addEventListener('win',function(event) {
    dashboard.classList.add('dashboard--hide');
  });

  gState.addEventListener('reset',function(event) {
    dashboard.classList.remove('dashboard--hide');
  })
}
function initMovesView() {
  const movesVal = document.querySelector('.moves__val');
  const summaryMovesVal = document.querySelector('.summary__movesVal');
  const gState = gameState.getInstance();

  gState.addEventListener('moves',function(event) {
    movesVal.textContent = gState.getMoves();
  });

  gState.addEventListener('reset',function() {
    movesVal.textContent = gState.getMoves();
  });

  gState.addEventListener('win',function() {
    summaryMovesVal.textContent = gState.getMoves();
  });
}
function initStarsView() {
  const dashboardStarsContainer = document.querySelector('.dashboard .stars');
  const summaryStarsContainer = document.querySelector('.summary .stars');
  const TOTAL_STARS = 5;
  const STAR_COLOR = 'rgb(219, 219, 49)';
  const gState = gameState.getInstance();

  drawStars(gState.getStars(), dashboardStarsContainer);

  gState.addEventListener('stars', function() {
    drawStars(gState.getStars(), dashboardStarsContainer);
  });

  gState.addEventListener('reset', function() {
    drawStars(gState.getStars(), dashboardStarsContainer);
  });

  gState.addEventListener('win', function() {
    drawStars(gState.getStars(), summaryStarsContainer, true);
  });

  function drawStars(stars, starsContainer, animate) {
    util.removeAllChildren(starsContainer);
    let starsPercentage = util.toDecimal(stars, 2);
    
    starsAppended = 0;
    while (starsPercentage >= util.toDecimal((1 / TOTAL_STARS), 2)) { //One star can be completely filled
      starsContainer.appendChild(createStarDiv(STAR_COLOR, animate));
      starsPercentage = util.toDecimal(starsPercentage - 0.20, 2); //Deduct one star's worth percentage
      starsAppended++;
    }
    if (starsAppended != TOTAL_STARS) {
      let overall = Math.floor(starsPercentage * 100) //percentage
      let singleStar = Math.floor(overall / 20 * 100);
      
      starsContainer.appendChild(
        createStarDiv(
          `linear-gradient(to right, ${STAR_COLOR} 0% ,${STAR_COLOR} ${singleStar}% ,grey ${singleStar}% ,grey 100%)`
        )
      );
      starsAppended++;
    }
    while (starsAppended < TOTAL_STARS) {
      starsContainer.appendChild(createStarDiv('grey'));
      starsAppended++;
    }
  }

  function createStarDiv(background, animate) {
    const starDiv = document.createElement('div');
    starDiv.classList.add('stars__star');
    if(animate) {
      starDiv.classList.add('stars__star--rotate');
    }
    starDiv.style.background = background;
    return starDiv;
  }
}
function initSummaryView() {
  const summary = document.querySelector('.summary');
  const gState = gameState.getInstance();

  gState.addEventListener('win',function(event) {
    summary.classList.remove('summary--hide');
  });

  gState.addEventListener('reset',function(event) {
    summary.classList.add('summary--hide');
  });
}
function initTimerView() {
  const gState = gameState.getInstance();
  const timerView = document.querySelector('.timer__val');
  const summaryTimerView = document.querySelector('.summary__timerVal');

  drawTime(gState.getTimerSeconds(), timerView);

  gState.addEventListener('timer', function() {
    drawTime(gState.getTimerSeconds(), timerView);
  });

  gState.addEventListener('reset', function() {
    drawTime(gState.getTimerSeconds(), timerView);
  });

  gState.addEventListener('win', function() {
    drawTime(gState.getTimerSeconds(), summaryTimerView);
  });

  function drawTime(seconds, view) {
    let minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    seconds = Math.floor(seconds - (minutes * 60)).toString().padStart(2, '0');
    view.textContent = `${minutes}:${seconds}`;
  }
}
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
  },

  removeAllChildren: function (parent) {
    while(parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  },

  toDecimal: function(number, decimalPoints) {
    return parseFloat(number.toFixed(decimalPoints));
  }
}