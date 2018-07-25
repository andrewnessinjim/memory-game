function initDashboardView() {
  let dashboard = document.querySelector('.dashboard');
  const gState = gameState.getInstance();

  gState.addEventListener('win',function(event) {
    dashboard.classList.add('dashboard--hide');
  });

  gState.addEventListener('reset',function(event) {
    dashboard.classList.remove('dashboard--hide');
  })
}