const sidenav = document.querySelector('.ds-sidebar');

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

window.onresize = reportWindowSize;

// window.addEventListener('resize', reportWindowSize);

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

  console.log('window.history', window.history, document.location);

  // hamburger.addEventListener('click', function (event) {
  // event.stopPropagation();
  console.log('menu.style.display', menu.style.display, menu);
  if (
    /*menu.style.display === 'none'*/ /*menu.style.transform === 'translateX(-300px)'*/ menu.classList.contains(
      'ds-sidebar--closed'
    )
  ) {
    // menu.style.display = 'flex';
    // menu.style.transition = 'transform 300ms';
    menu.classList.remove('ds-sidebar--closed');
    menu.classList.add('ds-sidebar--opened');
    // menu.style.transform = 'translateX(0)';
    // menu.style.left = '0';
    topNavigation.style.opacity = '0';
    closeButton.focus();
  } else {
    // menu.style.display = 'none';
    // menu.style.transition = 'transform 300ms';
    menu.classList.remove('ds-sidebar--opened');
    menu.classList.add('ds-sidebar--closed');
    // menu.style.transform = 'translateX(-300px)';
    // menu.style.left = '-300px';
    topNavigation.style.opacity = '1';
    menuButoon.focus();
  }
  // });
}

function hideMenu() {
  const topNavigation = document.querySelector('.ds-top-navigation');
  // const hamburger = document.querySelector('.ds-top-navigation__hamburger');
  const menu = document.querySelector('.ds-sidebar');
  const menuButoon = document.querySelector('.ds-top-navigation__hamburger');

  // hamburger.addEventListener('click', function (event) {
  // event.stopPropagation();
  console.log('menu.style.display cloooose', menu.style.display, event);
  // if (/*menu.style.display === 'none'*/ menu.style.transform === 'translateX(-300px)') {
  //   // menu.style.display = 'flex';
  //   // menu.style.transition = 'transform 300ms';
  //   menu.classList.remove('ds-sidebar--closed');
  //   menu.classList.add('ds-sidebar--opened');
  //   menu.style.transform = 'translateX(0)';
  //   menu.style.left = '0';
  //   topNavigation.style.opacity = '0';
  // } else {
  // menu.style.display = 'none';
  // menu.style.transition = 'transform 300ms';
  menu.classList.remove('ds-sidebar--opened');
  menu.classList.add('ds-sidebar--closed');
  // menu.style.transform = 'translateX(-300px)';
  // menu.style.left = '-300px';
  topNavigation.style.opacity = '1';
  menuButoon.focus();
  // }
  // });
}
