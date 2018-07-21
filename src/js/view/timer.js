function initTimerView() {
  const timerView = document.querySelector('.timer__seconds');
  const gState = gameState.getInstance();

  drawTime(gState.getTimerSeconds());

  const interval = setInterval(function() {
    gameState.getInstance().incTimerSeconds();
  }, 1000);

  gState.addEventListener('timer', function(event) {
    drawTime(event.detail.seconds);
  });

  gState.addEventListener('reset', function(event) {
    drawTime(event.detail.seconds);
  })

  function drawTime(seconds) {
    let minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    seconds = Math.floor(seconds - (minutes * 60)).toString().padStart(2, '0');
    timerView.textContent = `${minutes}:${seconds}`;
  }
}