function showMenu() {
  const topNavigation = document.querySelector('.ds-top-navigation');
  // const hamburger = document.querySelector('.ds-top-navigation__hamburger');
  const menu = document.querySelector('.ds-sidebar');

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
  } else {
    // menu.style.display = 'none';
    // menu.style.transition = 'transform 300ms';
    menu.classList.remove('ds-sidebar--opened');
    menu.classList.add('ds-sidebar--closed');
    // menu.style.transform = 'translateX(-300px)';
    // menu.style.left = '-300px';
    topNavigation.style.opacity = '1';
  }
  // });
}

function hideMenu() {
  const topNavigation = document.querySelector('.ds-top-navigation');
  // const hamburger = document.querySelector('.ds-top-navigation__hamburger');
  const menu = document.querySelector('.ds-sidebar');

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
  // }
  // });
}
