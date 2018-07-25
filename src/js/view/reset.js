function initResetButton() {
  let resetButton = document.querySelector('.controls__reset');
  let playAgain = document.querySelector('.summary__playAgain');

  resetButton.addEventListener('click', function() {
    controller.reset();
  });

  playAgain.addEventListener('click', function() {
    controller.reset();
  });
}