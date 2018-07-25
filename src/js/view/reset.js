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