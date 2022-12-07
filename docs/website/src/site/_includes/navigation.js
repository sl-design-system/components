const sidenav = document.querySelector('.ds-sidebar');
const container = document.querySelector('.ds-container');
const mediaQueryList = window.matchMedia('(min-width: 580px)');

function handleWidthChange(mediaQueryList) {
  if (mediaQueryList.matches && sidenav.classList.contains('ds-sidebar--opened')) {
    const menu = document.querySelector('.ds-sidebar');
    const topNavigation = document.querySelector('.ds-top-navigation');
    menu.classList.remove('ds-sidebar--opened');
    menu.classList.add('ds-sidebar--closed');
    topNavigation.style.opacity = '1';
    showMenu();
  } else {
    const menu = document.querySelector('.ds-sidebar');
    const topNavigation = document.querySelector('.ds-top-navigation');
    menu.classList.remove('ds-sidebar--opened');
    menu.classList.add('ds-sidebar--closed');
    topNavigation.style.opacity = '1';
    // TODO: show active link
    setActiveItem();
  }
}

handleWidthChange(mediaQueryList);

mediaQueryList.addEventListener('change', handleWidthChange);

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
  const menu = document.querySelector('.ds-sidebar');
  const closeButton = document.querySelector('.ds-sidebar-nav__close-button');
  const menuButoon = document.querySelector('.ds-top-navigation__hamburger');
  const links = document.querySelectorAll('.ds-link');
  const arrows = document.querySelectorAll('.ds-sidebar-nav__arrow');
  const sublists = document.querySelectorAll('.ds-sublist');
  const activePath = window.location.pathname;
  links.forEach(link => link.classList.remove('ds-link--active'));
  arrows.forEach(arrow => arrow.classList.remove('ds-sidebar-nav__arrow--active'));
  sublists.forEach(arrow => arrow.classList.remove('ds-sublist--active'));
  sublists.forEach(arrow => arrow.classList.remove('ds-menu--expanded'));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const activeLink = Array.from(links).find(link => {
    return activePath.includes(link.parentElement.id);
  });
  const arrowElement = activeLink?.children[0];

  if (menu.classList.contains('ds-sidebar--closed')) {
    menu.classList.remove('ds-sidebar--closed');
    menu.classList.add('ds-sidebar--opened');
    topNavigation.style.opacity = '0';
    closeButton.focus();
    const submenu = activeLink?.parentElement.nextElementSibling;
    activeLink?.classList.add('ds-link--active');
    arrowElement?.classList.add('ds-sidebar-nav__arrow--active');
    submenu?.classList.add('ds-sublist--active');
    submenu?.classList.add('ds-menu--expanded');
    // TODO: set active link and active submenu
  } else {
    menu.classList.remove('ds-sidebar--opened');
    menu.classList.add('ds-sidebar--closed');
    topNavigation.style.opacity = '1';
    menuButoon.focus();
    const submenu = activeLink.parentElement.nextElementSibling;
    activeLink.classList.remove('ds-link--active');
    arrowElement.classList.remove('ds-sidebar-nav__arrow--active');
    submenu.classList.remove('ds-sublist--active');
    submenu.classList.remove('ds-menu--expanded');
  }
}

function setActiveItem() {
  // TODO: check active links based on url and set after resetting

  const menu = document.querySelector('.ds-sidebar');
  const closeButton = document.querySelector('.ds-sidebar-nav__close-button');
  const menuButoon = document.querySelector('.ds-top-navigation__hamburger');
  // console.log('window.history', window.history, document.location);
  const links = document.querySelectorAll('.ds-link');
  const linksWithSubmenu = document.querySelectorAll('.ds-link__has-submenu'); // TODO change, submenu removed before on hiding?
  const arrows = document.querySelectorAll('.ds-sidebar-nav__arrow');
  const sublists = document.querySelectorAll('.ds-sublist');
  const activePath = window.location.pathname;
  console.log('linksWithSubmenu', linksWithSubmenu);
  links.forEach(link => link.classList.remove('ds-link--active'));
  arrows.forEach(arrow => arrow.classList.remove('ds-sidebar-nav__arrow--active'));
  sublists.forEach(arrow => arrow.classList.remove('ds-sublist--active'));
  sublists.forEach(arrow => arrow.classList.remove('ds-menu--expanded'));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const activeLink = Array.from(links).find(
    link => {
      return activePath.includes(link.parentElement.id);
    } /*link.id === activePath*/
  );
  const arrowElement = activeLink?.children[0];
  const submenu = activeLink?.parentElement.nextElementSibling;
  activeLink?.classList.add('ds-link--active');
  arrowElement?.classList.add('ds-sidebar-nav__arrow--active');
  submenu?.classList.add('ds-sublist--active');
  submenu?.classList.add('ds-menu--expanded');
}

function hideMenu() {
  console.log('hideMenu');
  const links = document.querySelectorAll('.ds-link');
  const activePath = window.location.pathname;
  const activeLink = Array.from(links).find(
    link => {
      return activePath.includes(link.parentElement.id);
    } /*link.id === activePath*/
  );
  const topNavigation = document.querySelector('.ds-top-navigation');
  const menu = document.querySelector('.ds-sidebar');
  const menuButoon = document.querySelector('.ds-top-navigation__hamburger');

  menu.classList.remove('ds-sidebar--opened');
  menu.classList.add('ds-sidebar--closed');
  topNavigation.style.opacity = '1';
  menuButoon.focus();
  activeLink.classList.remove('ds-link--active');
  closeSubmenus();
  // TODO: reset to visible submenu
}

let previouslyOpened;
let previouslyOpenedSubmenu;
// let currentlyOpened;
// let currentlyOpenedSubmenu;

function showSubmenu(event) {
  event.preventDefault();

  closeSubmenus();

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
  arrowElement?.classList.add('ds-sidebar-nav__arrow--active');
  submenu.classList.add('ds-sublist--active');
  submenu.classList.add('ds-menu--expanded');
  previouslyOpened = menuItem;
  previouslyOpenedSubmenu = submenu;
}

// TODO: adding ds-link--active to span, not anchor only

// function closeSubmenu(element) {
//   console.log('closeSubmenu', element);
//   element.classList.remove('ds-sublist--active');
//   element.classList.remove('ds-menu--expanded');
// }

function closeSubmenus() {
  const menu = document.querySelectorAll('.ds-link');
  const submenus = document.querySelectorAll('.ds-sublist');
  const arrows = document.querySelectorAll('.ds-sidebar-nav__arrow');

  menu.forEach(link => {
    if (link.classList.contains('ds-link__has-submenu') && link.classList.contains('ds-link--active')) {
      link.classList.remove('ds-link--active');
    } else if (link.classList.contains('ds-link--active')) {
      link.classList.remove('ds-link--active');
    }
  });

  arrows.forEach(arrow => {
    if (arrow.classList.contains('ds-sidebar-nav__arrow--active')) {
      arrow.classList.remove('ds-sidebar-nav__arrow--active');
    }
  });

  submenus.forEach(submenu => {
    if (submenu.classList.contains('ds-sublist--active') || submenu.classList.contains('ds-menu--expanded')) {
      submenu.classList.remove('ds-sublist--active');
      submenu.classList.remove('ds-menu--expanded');
    }
  });
}
