function initializeCards() {
  const cardsContainer = document.querySelector('.cards-container');

  for(let card of gameState.getInstance().getCards()) {
    cardsContainer.appendChild(createCardDiv(card));
  }

  function createCardDiv(card){
    const div = document.createElement('div');
    div.classList.add('card');
    div.setAttribute("id", card.getId());
    div.style.backgroundImage = `url(${card.getURL()})`;

    return div;
  }

  cardsContainer.addEventListener("click", function(event) {
    console.log(event.target);
  })
}