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