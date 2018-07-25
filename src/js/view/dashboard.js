function initDashboardView() {
  let dashboard = document.querySelector('.dashboard');

  gameState.getInstance().addEventListener('win',function(event) {
    dashboard.classList.add('dashboard--hide');
  });

  gameState.getInstance().addEventListener('reset',function(event) {
    dashboard.classList.remove('dashboard--hide');
  })
}