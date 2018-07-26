document.addEventListener('DOMContentLoaded', function() {
  initDashboardView();
  initSummaryView();
  initCardsView();
  initStarsView();
  initTimerView();
  initMovesView();
  initResetButton();
  initMagnetButton();

  document.querySelector('.app').classList.remove('app--hide');
});