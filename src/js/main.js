document.addEventListener('DOMContentLoaded', function() {
  initDashboardView();
  initSummaryView();
  initCardsView();
  initStarsView();
  initTimerView();
  initMovesView();
  initWelcomeForm();
  initControls();
  initMagnetButton();

  document.querySelector('.app').classList.remove('app--hide');
});