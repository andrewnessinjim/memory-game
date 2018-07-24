function initStarsView() {
  const starsContainer = document.querySelector('.stars');
  const TOTAL_STARS = 5;
  drawStars(gameState.getInstance().getStars());
  gameState.getInstance().addEventListener('stars', function(event) {
    drawStars(event.detail.stars);
  });

  gameState.getInstance().addEventListener('reset', function(event) {
    drawStars(event.detail.stars);
  });

  function drawStars(stars) {
    util.removeAllChildren(starsContainer);
    let starsPercentage = util.toDecimal(stars, 2);
    
    starsAppended = 0;
    while (starsPercentage >= util.toDecimal((1 / TOTAL_STARS), 2)) { //One star can be completely filled
      createStarDiv('yellow');
      starsPercentage = util.toDecimal(starsPercentage - 0.20, 2); //Deduct one star's worth percentage
      starsAppended++;
    }
    if (starsAppended != TOTAL_STARS) {
      let overall = Math.floor(starsPercentage * 100) //percentage
      let singleStar = Math.floor(overall / 20 * 100);
      
      createStarDiv(`linear-gradient(to right, yellow 0% ,yellow ${singleStar}% ,grey ${singleStar}% ,grey 100%)`);
      starsAppended++;
    }
    while (starsAppended < TOTAL_STARS) {
      createStarDiv('grey');
      starsAppended++;
    }
  }

  function createStarDiv(background) {
    let starDiv = document.createElement('div');
    starDiv.classList.add('stars__star');
    starDiv.style.background = background;
    starsContainer.appendChild(starDiv);
  }
}