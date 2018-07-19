function initializeCards() {
  const cardsContainer = document.querySelector('.cards-container');

  for(let card of gameState.getInstance().getCards()) {
    cardsContainer.appendChild(createCardDiv(card));
  }

  function createCardDiv(card){
    const div = document.createElement('div');
    div.classList.add('card');
    div.setAttribute('card_id', card.getId());
    if(card.getState() === cards.STATE_CLOSED) {
      div.classList.add('card-closed');
    } else {
      div.style.backgroundImage = `url(${card.getURL()})`;
    }

    return div;
  }

  cardsContainer.addEventListener("click", function(event) {
    controller.cardClicked(event.target.getAttribute("card_id"));
  });
}