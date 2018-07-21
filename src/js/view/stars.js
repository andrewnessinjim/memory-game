function initStarsView() {
  let starsVal = document.querySelector('.stars__val');
  starsVal.textContent = gameState.getInstance().getStars();

  gameState.getInstance().addEventListener('stars', function(event) {
    starsVal.textContent = event.detail.stars;
  })
}