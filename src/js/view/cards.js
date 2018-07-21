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
    controller.idle = true;
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