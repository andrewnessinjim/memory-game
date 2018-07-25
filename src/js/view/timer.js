function initTimerView() {
  const timerView = document.querySelector('.timer__val');
  const gState = gameState.getInstance();

  drawTime(gState.getTimerSeconds());

  gState.addEventListener('timer', function(event) {
    drawTime(event.detail.seconds);
  });

  gState.addEventListener('reset', function(event) {
    drawTime(event.detail.seconds);
  });

  function drawTime(seconds) {
    timerView.textContent = util.secsToMinSecs(seconds);
  }
}