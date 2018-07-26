function initResetButton() {
  const resetButton = document.querySelector('.controls__reset');
  const playAgain = document.querySelector('.summary__playAgain');

  resetButton.addEventListener('click', function() {
    controller.reset();
  });

  playAgain.addEventListener('click', function() {
    controller.reset();
  });
}

function initMagnetButton() {
  const magnetButton = document.querySelector('.magnet');
  const header = document.querySelector('.header');

  magnetButton.addEventListener('click', function() {
    header.classList.toggle('header--showTitle');
    header.classList.toggle('header--showControls');

    magnetButton.classList.toggle('magnet--toRight');
    magnetButton.classList.toggle('magnet--toLeft');
  });
}