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

    const backDiv = cardDiv.querySelector('.card__back');
    backDiv.classList.remove('card__back--show');
    backDiv.classList.remove('card__back--hide');

    if(card.getState() === cards.STATE_CLOSED) {
      frontDiv.classList.add('card__front--hide');
      backDiv.classList.add('card__back--show');

    } else if (card.getState() === cards.STATE_OPEN){
      frontDiv.classList.add('card__front--show');
      backDiv.classList.add('card__back--hide');

    } else if(card.getState() === cards.STATE_WAITING) {
      frontDiv.classList.add('card__front--show');
      backDiv.classList.add('card__back--hide');

    }
  }
}