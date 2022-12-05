const sidenav = document.querySelector('.ds-sidebar');
const container = document.querySelector('.ds-container');

function reportWindowSize() {
  const widthOutput = window.innerWidth;
  // console.log(widthOutput);

  if (widthOutput > 580 && sidenav.classList.contains('ds-sidebar--opened')) {
    hideMenu();
  }
}

// window.addEventListener('hashchange', function () {
//   console.log('onhashchange event occurred!');
// });

// TODO: add ResizeObserver!

window.onresize = reportWindowSize;

// window.addEventListener('resize', reportWindowSize);

document.onclick = function (event) {
  const container = document.querySelector('.ds-container');
  if (event.target === container && sidenav.classList.contains('ds-sidebar--opened')) {
    hideMenu();
  }
};

sidenav.addEventListener('keyup', e => {
  console.log('e', e, sidenav);
  if (e.code === 'Escape') {
    if (sidenav.classList.contains('ds-sidebar--opened')) {
      hideMenu();
    }
  }
});

function showMenu() {
  const topNavigation = document.querySelector('.ds-top-navigation');
  // const hamburger = document.querySelector('.ds-top-navigation__hamburger');
  const menu = document.querySelector('.ds-sidebar');
  const closeButton = document.querySelector('.ds-sidebar-nav__close-button');
  const menuButoon = document.querySelector('.ds-top-navigation__hamburger');
  // console.log('window.history', window.history, document.location);

  if (menu.classList.contains('ds-sidebar--closed')) {
    menu.classList.remove('ds-sidebar--closed');
    menu.classList.add('ds-sidebar--opened');
    topNavigation.style.opacity = '0';
    closeButton.focus();
  } else {
    menu.classList.remove('ds-sidebar--opened');
    menu.classList.add('ds-sidebar--closed');
    topNavigation.style.opacity = '1';
    menuButoon.focus();
  }
}

function hideMenu() {
  const topNavigation = document.querySelector('.ds-top-navigation');
  const menu = document.querySelector('.ds-sidebar');
  const menuButoon = document.querySelector('.ds-top-navigation__hamburger');

  // console.log('menu.style.display cloooose', menu.style.display);
  menu.classList.remove('ds-sidebar--opened');
  menu.classList.add('ds-sidebar--closed');
  topNavigation.style.opacity = '1';
  menuButoon.focus();
}
