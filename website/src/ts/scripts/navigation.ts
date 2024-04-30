const menu = document.querySelector('.ds-sidebar') as HTMLElement,
  container = document.querySelector('.ds-container') as Element,
  mediaQueryList: MediaQueryList = window.matchMedia('(min-width: 900px)'),
  topNavigation = document.querySelector('.ds-top-navigation') as HTMLElement,
  closeButton = document.querySelector('.ds-sidebar-nav__close-button') as HTMLButtonElement,
  menuButton = document.querySelector('.ds-top-navigation__hamburger') as HTMLButtonElement,
  submenus = document.querySelectorAll('.ds-sublist'),
  links = document.querySelectorAll('.ds-sidebar-nav__link'),
  arrows = document.querySelectorAll('.ds-sidebar-nav__arrow'),
  linksWithSubmenu: NodeListOf<HTMLElement> = document.querySelectorAll('.ds-sidebar-nav__link--has-submenu'),
  heading = document.querySelector('header:not(.ds-top-navigation)'),
  title = heading?.querySelector('h1') as HTMLElement;

let previouslyOpened: Element, previouslyOpenedSubmenu: Element;

menuButton.onclick = () => {
  showMenu();
};

closeButton.onclick = () => {
  hideMenu();
};

linksWithSubmenu?.forEach(link => {
  link.onclick = (event: MouseEvent) => {
    showSubmenu(event);
  };
});

document.onclick = (event: MouseEvent) => {
  if (event.target === container && menu?.classList.contains('ds-sidebar--opened')) {
    hideMenu();
  }
};

menu.onkeyup = (event: KeyboardEvent) => {
  if (event.code === 'Escape') {
    if (menu.classList.contains('ds-sidebar--opened')) {
      hideMenu();
    }
  }
};

document.onscroll = () => {
  if (window.scrollY > 0) {
    topNavigation.classList.add('ds-top-navigation--sticky');
  } else {
    topNavigation.classList.remove('ds-top-navigation--sticky');
  }
};

mediaQueryList.onchange = event => {
  handleWidthChange(event.matches);
};

function showMenu(): void {
  setActiveItem();

  if (menu.classList.contains('ds-sidebar--closed')) {
    toggleMenu(true);
  } else {
    toggleMenu();
  }
}

function handleWidthChange(matches: boolean): void {
  if (matches && menu.classList.contains('ds-sidebar--opened')) {
    toggleMenu();
    showMenu();
  } else {
    toggleMenu();
    setActiveItem();
  }
}

function toggleMenu(open = false): void {
  if (open) {
    menuButton.setAttribute('aria-expanded', 'true');
    menu.classList.remove('ds-sidebar--closed');
    menu.classList.add('ds-sidebar--opened');
    topNavigation.classList.add('ds-menu--opened');
    closeButton.setAttribute('tabindex', '1');
    closeButton.focus();
  } else {
    menuButton.setAttribute('aria-expanded', 'false');
    topNavigation.classList.remove('ds-menu--opened');
    menu.classList.remove('ds-sidebar--opened');
    menu.classList.add('ds-sidebar--closed');
    menuButton.focus();
  }
}

function setActiveItem(): void {
  clearAllActiveElements();
  const activePath = window.location.pathname,
    activeLink = Array.from(links).find(link => {
      if (!link.parentElement) {
        return;
      }
      return activePath.includes(link.parentElement.id);
    }),
    arrowElement = activeLink?.children[0],
    submenu = activeLink?.parentElement?.nextElementSibling;

  activeLink?.classList.add('ds-sidebar-nav__link--active');
  arrowElement?.classList.add('ds-sidebar-nav__arrow--active');

  if (activeLink?.classList.contains('ds-sidebar-nav__link--has-submenu') && submenu) {
    activeLink.setAttribute('aria-expanded', 'true');
    openSubmenu(submenu);
  }
}

function hideMenu(): void {
  setActiveItem();
  toggleMenu();
  closeSubmenus();
}

function showSubmenu(event: Event): void {
  event.preventDefault();
  closeSubmenus();

  const menuItem = event.target as Element,
    arrowElement = (event.target as Element)?.children[0],
    submenu = (event.target as Element)?.parentElement?.nextElementSibling;

  if (!submenu || !menuItem || !arrowElement) {
    return;
  }

  if (menuItem !== previouslyOpened && submenu !== previouslyOpenedSubmenu) {
    previouslyOpened?.classList.remove('ds-sidebar-nav__link--active');
    closeSubmenu(previouslyOpenedSubmenu);
  }
  menuItem.classList.add('ds-sidebar-nav__link--active');
  arrowElement.classList.add('ds-sidebar-nav__arrow--active');
  menuItem.setAttribute('aria-expanded', 'true');
  openSubmenu(submenu);
  previouslyOpened = menuItem;
  previouslyOpenedSubmenu = submenu;
}

function clearAllActiveElements(): void {
  links.forEach(link => link.classList.remove('ds-sidebar-nav__link--active'));
  arrows.forEach(arrow => arrow.classList.remove('ds-sidebar-nav__arrow--active'));
  submenus.forEach(submenu => closeSubmenu(submenu));
}

function openSubmenu(element: Element): void {
  if (!element) {
    return;
  }
  element.classList.add('ds-sublist--active');
  element.classList.add('ds-menu--expanded');
}

function closeSubmenu(element: Element): void {
  if (!element) {
    return;
  }
  element.classList.remove('ds-sublist--active');
  element.classList.remove('ds-menu--expanded');
}

function closeSubmenus(): void {
  links.forEach(link => {
    if (
      link.classList.contains('ds-sidebar-nav__link--has-submenu') &&
      link.classList.contains('ds-sidebar-nav__link--active')
    ) {
      link.setAttribute('aria-expanded', 'false');
      link.classList.remove('ds-sidebar-nav__link--active');
    } else if (link.classList.contains('ds-sidebar-nav__link--active')) {
      link.classList.remove('ds-sidebar-nav__link--active');
    }
  });

  arrows.forEach(arrow => {
    if (arrow.classList.contains('ds-sidebar-nav__arrow--active')) {
      arrow.classList.remove('ds-sidebar-nav__arrow--active');
    }
  });

  submenus.forEach(submenu => {
    if (submenu.classList.contains('ds-sublist--active') || submenu.classList.contains('ds-menu--expanded')) {
      closeSubmenu(submenu);
    }
  });
}

const handler = (entries: IntersectionObserverEntry[]) => {
  const componentNameHeading = document.createElement('h1');
  componentNameHeading.textContent = title?.innerText;
  componentNameHeading.classList.add('ds-top-navigation__component-name');
  const slTabsGroup = document.querySelector('sl-tab-group');

  if (!entries[0].isIntersecting) {
    topNavigation.classList.add('sticky');
    topNavigation.insertAdjacentElement('beforeend', componentNameHeading);
    if (slTabsGroup) {
      slTabsGroup.classList.add('sticky-tabs');
      topNavigation.classList.add('has-tabs');
    }
  } else {
    topNavigation.classList.remove('sticky');
    if (slTabsGroup) {
      slTabsGroup.classList.remove('sticky-tabs');
      topNavigation.classList.remove('has-tabs');
    }
    const oldComponentName = topNavigation.querySelector('.ds-top-navigation__component-name');
    oldComponentName?.remove();
  }
};

const headingObserver = new IntersectionObserver(handler, {
  rootMargin: mediaQueryList.matches ? '-32px' : '-68px'
});

if (heading) {
  headingObserver.observe(heading);
} else {
  headingObserver?.disconnect;
}
