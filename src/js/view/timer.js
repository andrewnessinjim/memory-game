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
    let minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    seconds = Math.floor(seconds - (minutes * 60)).toString().padStart(2, '0');
    timerView.textContent = `${minutes}:${seconds}`;
  }
}