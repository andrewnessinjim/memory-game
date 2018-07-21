function initResetButton() {
  let resetButton = document.querySelector('.controls__reset');
  resetButton.addEventListener('click', function() {
    controller.reset();
  });
}