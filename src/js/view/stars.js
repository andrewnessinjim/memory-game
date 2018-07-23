function initStarsView() {
  const starsContainer = document.querySelector('.stars-container');
  const TOTAL_STARS = 5;
  gameState.getInstance().addEventListener('stars', function(event) {
    util.removeAllChildren(starsContainer);
    let starsPercentage = util.toDecimal(event.detail.stars, 2);
    console.log(starsPercentage);

    starsAppended = 0;

    while(starsPercentage >= util.toDecimal((1 / TOTAL_STARS), 2)) {
      createStarDiv('yellow');

      starsPercentage = util.toDecimal(starsPercentage - 0.20, 2);
      starsAppended++;
    }

    if(starsAppended != TOTAL_STARS) {
      remStars = Math.floor(Math.floor(starsPercentage * 100) / 20 * 100);
      console.log("remStars: " + remStars);
      createStarDiv(`linear-gradient(to right, yellow 0% ,yellow ${remStars}% ,grey ${remStars}% ,grey 100%)`);
      starsAppended++;
    }

    while(starsAppended < TOTAL_STARS) {
      createStarDiv('grey');
      starsAppended++;
    }
  });

  function createStarDiv(background) {
    let starDiv = document.createElement('div');
    starDiv.classList.add('star');
    starDiv.style.background = background;
    starsContainer.appendChild(starDiv);
  }
}