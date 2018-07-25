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
    let div = document.querySelector(`.cards__card[card-index="${card.getIndex()}"]`)
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
      const div = document.createElement('div');
      div.classList.add('cards__card');
      div.setAttribute('card_id', card.getId());
      div.setAttribute('card-index', card.getIndex());
      setCardState(div, card);
      return div;
    }
  }

  function setCardState(div, card) {
    div.classList.remove('cards__card--closed');
    if(card.getState() === cards.STATE_CLOSED) {
      div.classList.add('cards__card--closed');
      div.style.backgroundImage = '';
    } else if (
      card.getState() === cards.STATE_OPEN
      || card.getState() === cards.STATE_WAITING
    ){
      div.style.backgroundImage = `url(${card.getURL()})`;
    }
  }
}