function initTimerView() {
  const gState = gameState.getInstance();
  const timerView = document.querySelector('.timer__val');
  const summaryTimerView = document.querySelector('.summary__timerVal');

  drawTime(gState.getTimerSeconds(), timerView);

  gState.addEventListener('timer', function() {
    drawTime(gState.getTimerSeconds(), timerView);
  });

  gState.addEventListener('reset', function() {
    drawTime(gState.getTimerSeconds(), timerView);
  });

  gState.addEventListener('win', function() {
    drawTime(gState.getTimerSeconds(), summaryTimerView);
  });

  function drawTime(seconds, view) {
    let minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    seconds = Math.floor(seconds - (minutes * 60)).toString().padStart(2, '0');
    view.textContent = `${minutes}:${seconds}`;
  }
}