function initControls() {
  const resetButton = document.querySelector('.controls__reset');
  const playAgain = document.querySelector('.summary__playAgain');
  const directionsButton = document.querySelector('.controls__directions');
  const attributionsButton = document.querySelector('.controls__attributions');
  const modal = document.querySelector('.modal');
  const modalClose = document.querySelector('.modal__close');
  const directionsContent = document.querySelector('.directions');
  const attributionsContent = document.querySelector('.attributions');

  resetButton.addEventListener('click', function() {
    controller.reset();
  });

  playAgain.addEventListener('click', function() {
    controller.reset();
  });

  directionsButton.addEventListener('click', function() {
    revealDirections();
  });

  attributionsButton.addEventListener('click', function() {
    modal.classList.add('modal--show');
    attributionsContent.classList.add('attributions--show');
  });

  modalClose.addEventListener('click', function() {
    modal.classList.remove('modal--show');
    directionsContent.classList.remove('directions--show');
    attributionsContent.classList.remove('attributions--show');
  });

  function revealDirections() {
    modal.classList.add('modal--show');
    directionsContent.classList.add('directions--show');
  }

  //Reveal directions on app startup
  let welcome = document.cookie.replace(/(?:(?:^|.*;\s*)welcome\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  if(!welcome || welcome === 'yes') {
    revealDirections();
  }
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

function initWelcomeForm() {
  const welcomeCheckbox = document.getElementById('welcome');
  let welcome = document.cookie.replace(/(?:(?:^|.*;\s*)welcome\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  if(!welcome || welcome === 'yes') {
    welcomeCheckbox.checked = false;
  } else {
    welcomeCheckbox.checked = true;
  }

  welcomeCheckbox.addEventListener('click', function() {
    if(welcomeCheckbox.checked) {
      document.cookie = "welcome=no";
    } else {
      document.cookie = "welcome=yes";
    }
  });
}