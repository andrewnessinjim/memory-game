function initTimerView() {
  const timerView = document.querySelector('.timer__seconds');
  const gState = gameState.getInstance();

  drawTime(gState.getTimerSeconds());

  let timerInterval = setInterval(function() {
    controller.incTimer()
  }, 1000);

  gState.addEventListener('timer', function(event) {
    drawTime(event.detail.seconds);
  });

  gState.addEventListener('reset', function(event) {
    drawTime(event.detail.seconds);
    clearInterval(timerInterval);
    timerInterval = setInterval(function() {
      controller.incTimer()
    }, 1000);
  });

  gState.addEventListener('win', function(){
    clearInterval(timerInterval);
  })

  function drawTime(seconds) {
    let minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    seconds = Math.floor(seconds - (minutes * 60)).toString().padStart(2, '0');
    timerView.textContent = `${minutes}:${seconds}`;
  }
}