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

window.onresize = reportWindowSize; // TODO: set timeout?

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
  console.log('window location', window.location.pathname);
  // window.location.pathname and li id
  const topNavigation = document.querySelector('.ds-top-navigation');
  // const hamburger = document.querySelector('.ds-top-navigation__hamburger');
  const menu = document.querySelector('.ds-sidebar');
  const closeButton = document.querySelector('.ds-sidebar-nav__close-button');
  const menuButoon = document.querySelector('.ds-top-navigation__hamburger');
  // console.log('window.history', window.history, document.location);
  const links = document.querySelectorAll('.ds-link');
  const linksWithSubmenu = document.querySelectorAll('.ds-link__has-submenu'); // TODO change, submenu removed before on hiding?
  const activePath = window.location.pathname;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const activeLink = Array.from(links).find(
    link => {
      // console.log(
      //   'liiiiiiink',
      //   link.parentElement.id,
      //   activePath,
      //   link.parentElement.id === activePath,
      //   activePath.includes(link.parentElement.id)
      // );
      return activePath.includes(link.parentElement.id);
    } /*link.id === activePath*/
  );
  // Array.from(linksWithSubmenu).find(link => {
  //   console.log('222only link', link);
  //   console.log(
  //     '222liiiiiiink',
  //     link,
  //     link.parentElement.id,
  //     activePath,
  //     link.parentElement.id === activePath,
  //     activePath.includes(link.parentElement.id)
  //   );
  //   activePath.includes(link.parentElement.id) ? link.parentElement.parentElement : null;
  // });
  const activeMainLink = Array.from(/*links*/ linksWithSubmenu).find(
    (
      link //{
    ) =>
      // console.log('only link', link);
      // console.log(
      //   'liiiiiiink',
      //   link,
      //   'link id----' + link.parentElement.id,
      //   link.parentElement.id,
      //   activePath,
      //   link.parentElement.id === activePath,
      //   activePath.includes(link.parentElement.id)
      // );
      activePath.includes(link.parentElement.id)
    //} /*link.id === activePath*/
  );
  console.log(
    'activePath i activeLink main first',
    activeMainLink,
    activeLink,
    activeLink.children,
    activePath,
    activeLink.parentNode
  );
  const arrowElement = /*activeLink*/ activeMainLink?.children[0];

  if (menu.classList.contains('ds-sidebar--closed')) {
    menu.classList.remove('ds-sidebar--closed');
    menu.classList.add('ds-sidebar--opened');
    topNavigation.style.opacity = '0';
    closeButton.focus();
    // activeLink.onclick = showSubmenu();
    // activeLink.onclick = function (event) {
    //   showSubmenu.apply(event, arguments);
    // };
    // activeLink.click(this);
    // const arrowElement = activeLink.children[0];
    console.log('arrowElement 111', arrowElement, activeLink.children, activeLink.parentElement.nextElementSibling);
    const submenu = activeMainLink?.parentElement.nextElementSibling;
    activeMainLink?.classList.add('ds-link--active');
    arrowElement?.classList.add('ds-sidebar-nav__arrow--active');
    submenu?.classList.add('ds-sublist--active');
    submenu?.classList.add('ds-menu--expanded');
    // showSubmenu.apply(this, arguments);
    // activeLink.addEventListener('click', showSubmenu(event));
    // showSubmenu(activeLink.click);
    // TODO: set active link and active submenu
  } else {
    menu.classList.remove('ds-sidebar--opened');
    menu.classList.add('ds-sidebar--closed');
    topNavigation.style.opacity = '1';
    menuButoon.focus();
    // const arrowElement = activeLink.children[0];
    console.log('arrowElement 111', arrowElement, activeLink.children, activeLink.parentElement.nextElementSibling);
    const submenu = activeLink.parentElement.nextElementSibling;
    activeLink.classList.remove('ds-link--active');
    arrowElement.classList.remove('ds-sidebar-nav__arrow--active');
    submenu.classList.remove('ds-sublist--active');
    submenu.classList.remove('ds-menu--expanded');
  }
}

function hideMenu() {
  const links = document.querySelectorAll('.ds-link');
  const activePath = window.location.pathname;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const activeLink = Array.from(links).find(
    link => {
      // console.log(
      //   'liiiiiiink',
      //   link.parentElement.id,
      //   activePath,
      //   link.parentElement.id === activePath,
      //   activePath.includes(link.parentElement.id)
      // );
      return activePath.includes(link.parentElement.id);
    } /*link.id === activePath*/
  );
  // console.log('activePath i activeLink', activeLink, activePath, activeLink.parentNode);
  const arrowElement = activeLink.children[0];
  const topNavigation = document.querySelector('.ds-top-navigation');
  const menu = document.querySelector('.ds-sidebar');
  const menuButoon = document.querySelector('.ds-top-navigation__hamburger');

  // console.log('menu.style.display cloooose', menu.style.display);
  menu.classList.remove('ds-sidebar--opened');
  menu.classList.add('ds-sidebar--closed');
  topNavigation.style.opacity = '1';
  menuButoon.focus();
  const submenu = activeLink.parentElement.nextElementSibling;
  activeLink.classList.remove('ds-link--active');
  // arrowElement.classList.remove('ds-sidebar-nav__arrow--active');
  // submenu.classList.remove('ds-sublist--active');
  // submenu.classList.remove('ds-menu--expanded');
  // closeSubmenu(submenu);
  closeSubmenus();
  // TODO: reset to visible submenu
}

let previouslyOpened;
let previouslyOpenedSubmenu;
// let currentlyOpened;
// let currentlyOpenedSubmenu;

function showSubmenu(event) {
  event.preventDefault();

  console.log('event', event);

  const menu = document.querySelectorAll('.ds-link');
  const submenus = document.querySelectorAll('.ds-sublist');
  const arrows = document.querySelectorAll('.ds-sidebar-nav__arrow');

  closeSubmenus();

  /*
  menu.forEach((link, idx) => {
    console.log('link', menu, link[idx]);
    console.log(
      'ink.classList?.value',
      link,
      link.classList.contains('ds-link--active'),
      link.classList.contains('ds-link__has-submenu'),
      link.classList.contains('ds-link__has-submenu') && link.classList.contains('ds-link--active')
    );
    // link.classList?.remove('ds-link__has-submenu');
    // link.classList?.remove('ds-link--active');
    if (link.classList.contains('ds-link__has-submenu') && link.classList.contains('ds-link--active')) {
      console.log('this is link in if', link);
      link.classList.remove('ds-link__has-submenu');
      link.classList.remove('ds-link--active');
    } else if (link.classList.contains('ds-link--active')) {
      link.classList.remove('ds-link--active');
    }
  });

  arrows.forEach(arrow => {
    // link.classList?.remove('ds-link__has-submenu');
    // link.classList?.remove('ds-link--active');
    if (arrow.classList.contains('ds-sidebar-nav__arrow--active')) {
      arrow.classList.remove('ds-sidebar-nav__arrow--active');
    }
  });

  submenus.forEach((submenu, idx) => {
    console.log('submenu', submenus, submenu[idx]);
    // console.log(
    //   'ink.classList?.value',
    //   link,
    //   link.classList.contains('ds-link--active'),
    //   link.classList.contains('ds-link__has-submenu'),
    //   link.classList.contains('ds-link__has-submenu') && link.classList.contains('ds-link--active')
    // );
    // link.classList?.remove('ds-link__has-submenu');
    // link.classList?.remove('ds-link--active');
    if (submenu.classList.contains('ds-sublist--active') || submenu.classList.contains('ds-menu--expanded')) {
      console.log('this is link in if', submenu);
      submenu.classList.remove('ds-sublist--active');
      submenu.classList.remove('ds-menu--expanded');
    }
  });
*/

  const hasSubmenu = document.querySelectorAll('.ds-link__has-submenu');
  console.log('hasSubmenu', hasSubmenu, event.target, previouslyOpened, previouslyOpenedSubmenu);
  console.log('elements', event.target.parentElement, event.target.parentElement.nextElementSibling);
  const menuItem = event.target;
  const arrowElement = event.target.children[0];
  console.log('arrowElement', arrowElement);
  const submenu = event.target.parentElement.nextElementSibling;
  console.log(
    'menuItem !== previouslyOpened && submenu !== previouslyOpenedSubmenu',
    menuItem !== previouslyOpened && submenu !== previouslyOpenedSubmenu
  );
  if (menuItem !== previouslyOpened && submenu !== previouslyOpenedSubmenu) {
    previouslyOpened?.classList.remove('ds-link--active');
    previouslyOpenedSubmenu?.classList.remove('ds-sublist--active');
    previouslyOpenedSubmenu?.classList.remove('ds-menu--expanded');
    console.log('in if', previouslyOpened, previouslyOpenedSubmenu);
  }

  menuItem.classList.add('ds-link--active');
  arrowElement.classList.add('ds-sidebar-nav__arrow--active');
  submenu.classList.add('ds-sublist--active');
  submenu.classList.add('ds-menu--expanded');
  previouslyOpened = menuItem;
  previouslyOpenedSubmenu = submenu;
}

function closeSubmenu(element) {
  console.log('closeSubmenu', element);
  element.classList.remove('ds-sublist--active');
  element.classList.remove('ds-menu--expanded');

  // if (submenu.classList.contains('ds-sublist--active') || submenu.classList.contains('ds-menu--expanded')) {
  //   console.log('this is link in if', submenu);
  //   submenu.classList.remove('ds-sublist--active');
  //   submenu.classList.remove('ds-menu--expanded');
  // }
}

function closeSubmenus() {
  const menu = document.querySelectorAll('.ds-link');
  const submenus = document.querySelectorAll('.ds-sublist');
  const arrows = document.querySelectorAll('.ds-sidebar-nav__arrow');

  menu.forEach((link, idx) => {
    console.log('link', menu, link[idx]);
    console.log(
      'ink.classList?.value',
      link,
      link.classList.contains('ds-link--active'),
      link.classList.contains('ds-link__has-submenu'),
      link.classList.contains('ds-link__has-submenu') && link.classList.contains('ds-link--active')
    );
    // link.classList?.remove('ds-link__has-submenu');
    // link.classList?.remove('ds-link--active');
    if (link.classList.contains('ds-link__has-submenu') && link.classList.contains('ds-link--active')) {
      console.log('this is link in if', link);
      link.classList.remove('ds-link__has-submenu');
      link.classList.remove('ds-link--active');
    } else if (link.classList.contains('ds-link--active')) {
      link.classList.remove('ds-link--active');
    }
  });

  arrows.forEach(arrow => {
    // link.classList?.remove('ds-link__has-submenu');
    // link.classList?.remove('ds-link--active');
    if (arrow.classList.contains('ds-sidebar-nav__arrow--active')) {
      arrow.classList.remove('ds-sidebar-nav__arrow--active');
    }
  });
  submenus.forEach((submenu, idx) => {
    console.log('submenu', submenus, submenu[idx]);
    // console.log(
    //   'ink.classList?.value',
    //   link,
    //   link.classList.contains('ds-link--active'),
    //   link.classList.contains('ds-link__has-submenu'),
    //   link.classList.contains('ds-link__has-submenu') && link.classList.contains('ds-link--active')
    // );
    // link.classList?.remove('ds-link__has-submenu');
    // link.classList?.remove('ds-link--active');
    if (submenu.classList.contains('ds-sublist--active') || submenu.classList.contains('ds-menu--expanded')) {
      console.log('this is link in if', submenu);
      submenu.classList.remove('ds-sublist--active');
      submenu.classList.remove('ds-menu--expanded');
    }
  });
}
