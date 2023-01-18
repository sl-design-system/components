import { getActiveElement } from '../utils/active-element.js';

const mediaQueryList: MediaQueryList = window.matchMedia('(min-width: 900px)'),
  navLogo = document.querySelector('.ds-top-navigation__logo') as Element,
  componentName = document.querySelector('.ds-component__heading-wrapper h1')?.textContent;

const headerAnchorsParentsAll: Array<HTMLElement | undefined> = [];
const verticalTabsWrapperAll: Element[] = [];

let tabsContainer = document.querySelector('.ds-tabs');
let slider = tabsContainer?.querySelector('.slider') as HTMLElement;
let indicator = slider?.querySelector('.indicator') as HTMLElement;
let headingElement: HTMLHeadingElement | undefined;
let horizontalTabsContainers: NodeListOf<Element>;
let tabsWrapper: Element;
let tabsContentWrapper: Element;
let tabs: NodeListOf<HTMLElement>;
let tabsContents: NodeListOf<Element>;
let current: Element;
let currentContent: Element;
let nextUniqueId = 0;
let headerAnchors: NodeListOf<Element>;
let currentVerticalTabLink: Element; // TODO: needed to align vertically !!!!!!!!!
let currentVerticalTabsContainer: Element;

const verticalTabsAll: HTMLElement[] = [];

window.onload = () => {
  generateTabsElements();
  /*  horizontalTabsContainers = document.querySelectorAll('.ds-tabs[horizontal]');
  tabsWrapper = horizontalTabsContainers[0].querySelector('.ds-tabs-wrapper') as Element;
  tabsContentWrapper = horizontalTabsContainers[0].querySelector('.ds-tabs__tab-content-wrapper') as Element;
  tabs = horizontalTabsContainers[0].querySelectorAll('.ds-tab');
  tabs[0].classList.add('active');

  tabsContainer = document.createElement('div');
  tabsContainer.classList.add('ds-tabs__container');
  horizontalTabsContainers[0].insertBefore(tabsContainer, tabsContentWrapper);

  tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('ds-tabs-wrapper');
  tabsContainer.appendChild(tabsWrapper);

  slider = document.createElement('div');
  slider.classList.add('slider');
  tabsContainer.appendChild(slider);

  indicator = document.createElement('div');
  indicator.classList.add('indicator');
  slider.appendChild(indicator);

  tabs.forEach(tab => tabsWrapper.appendChild(tab));

  current = tabsWrapper.querySelector('.active') as Element;

  tabsContents = horizontalTabsContainers[0]?.querySelectorAll('.ds-tabs__tab-content');

  tabsContents[0].classList.add('ds-tabs__tab-content--active');

  if (!tabsWrapper || !current) {
    return;
  }
  tabs.forEach(tab => {
    tab.setAttribute('id', `ds-tab-${nextUniqueId++}`);
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('tabindex', '-1');
  });

  tabsContents?.forEach((tabContent, id) => {
    tabContent.setAttribute('id', `ds-tab-content-${nextUniqueId++}`);
    tabContent.setAttribute('role', 'tabpanel');
    tabContent.setAttribute('aria-labelledby', tabs[id].getAttribute('id') as string);
    tabContent.classList.add('ds-tabs__tab-content--hidden');
    let tabContentChildren = [];
    tabContentChildren = Array.from(tabContent.childNodes);
    const tabContainer = document.createElement('div');
    tabContainer.classList.add('ds-tabs__tab-container');
    tabContentChildren.forEach(content => {
      tabContainer.appendChild(content);
    });
    tabContent.appendChild(tabContainer);
    generateVerticalTabs(tabContent);
  });*/

  setScrollable();

  selectTab(current);

  if (tabsWrapper) {
    (tabsWrapper as HTMLElement).onscroll = event => {
      onScroll(event);
    };
  }

  tabs?.forEach(tab => {
    tab.onclick = (event: MouseEvent) => {
      selectTab(event.target as Element);
    };
  });
};

window.onresize = () => {
  if (!tabsWrapper || !current) {
    return;
  }

  setScrollable();

  selectTab(current);
};

window.onkeydown = (event: KeyboardEvent) => {
  onKeydown(event);
};

function generateTabsElements(): void {
  horizontalTabsContainers = document.querySelectorAll('.ds-tabs[horizontal]');
  tabsWrapper = horizontalTabsContainers[0].querySelector('.ds-tabs-wrapper') as Element;
  tabsContentWrapper = horizontalTabsContainers[0].querySelector('.ds-tabs__tab-content-wrapper') as Element;
  tabs = horizontalTabsContainers[0].querySelectorAll('.ds-tab');
  tabs[0].classList.add('active');

  tabsContainer = document.createElement('div');
  tabsContainer.classList.add('ds-tabs__container');
  horizontalTabsContainers[0].insertBefore(tabsContainer, tabsContentWrapper);

  tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('ds-tabs-wrapper');
  tabsContainer.appendChild(tabsWrapper);

  slider = document.createElement('div');
  slider.classList.add('slider');
  tabsContainer.appendChild(slider);

  indicator = document.createElement('div');
  indicator.classList.add('indicator');
  slider.appendChild(indicator);

  tabs.forEach(tab => tabsWrapper.appendChild(tab));

  current = tabsWrapper.querySelector('.active') as Element;

  tabsContents = horizontalTabsContainers[0]?.querySelectorAll('.ds-tabs__tab-content');

  tabsContents[0].classList.add('ds-tabs__tab-content--active');

  if (!tabsWrapper || !current) {
    return;
  }
  tabs.forEach(tab => {
    tab.setAttribute('id', `ds-tab-${nextUniqueId++}`);
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('tabindex', '-1');
  });

  tabsContents?.forEach((tabContent, id) => {
    tabContent.setAttribute('id', `ds-tab-content-${nextUniqueId++}`);
    tabContent.setAttribute('role', 'tabpanel');
    tabContent.setAttribute('aria-labelledby', tabs[id].getAttribute('id') as string);
    tabContent.classList.add('ds-tabs__tab-content--hidden');
    let tabContentChildren = [];
    tabContentChildren = Array.from(tabContent.childNodes);
    const tabContainer = document.createElement('div');
    tabContainer.classList.add('ds-tabs__tab-container');
    tabContentChildren.forEach(content => {
      tabContainer.appendChild(content);
    });
    tabContent.appendChild(tabContainer);
    generateVerticalTabs(tabContent);
  });
}

function generateVerticalTabs(verticalTabContent: Element): void {
  if (!verticalTabContent) {
    return;
  }

  const verticalTabsContainers = document.createElement('div');
  verticalTabsContainers.setAttribute('vertical', '');
  verticalTabsContainers.classList.add('ds-tabs');

  const verticalTabsContainer = document.createElement('div');
  verticalTabsContainer.classList.add('ds-tabs__container');
  verticalTabsContainers.appendChild(verticalTabsContainer);

  verticalTabContent.appendChild(verticalTabsContainers);

  const verticalTabsWrapper = document.createElement('div');
  verticalTabsWrapper.classList.add('ds-tabs-wrapper');
  verticalTabsWrapper.setAttribute('role', 'tablist');
  verticalTabsWrapper.setAttribute('aria-orientation', 'vertical');
  verticalTabsContainer.appendChild(verticalTabsWrapper);
  verticalTabsWrapperAll.push(verticalTabsWrapper);

  const verticalSlider = document.createElement('div');
  verticalSlider.classList.add('vertical-slider');
  verticalTabsContainer.appendChild(verticalSlider);

  const verticalIndicator = document.createElement('div');
  verticalIndicator.classList.add('vertical-indicator');
  verticalSlider.appendChild(verticalIndicator);

  headerAnchors = verticalTabContent.querySelectorAll('.header-anchor');
  const headerAnchorsParents = Array.from(headerAnchors)
    .map(element => {
      if (element.parentElement?.tagName === 'H2') {
        if (element.parentElement.parentNode) {
          (element.parentElement.parentNode as Element).id = element.parentElement.id;
        }
        return element.parentElement;
      }
      return;
    })
    .filter(element => element !== undefined);
  headerAnchorsParentsAll.push(...headerAnchorsParents);

  const verticalTabs: HTMLElement[] = [];

  headerAnchorsParents.forEach(headerAnchorParent => {
    if (headerAnchorParent) {
      const verticalTab = document.createElement('a');
      verticalTab.setAttribute('href', `#${headerAnchorParent.id}`);
      verticalTab.textContent = headerAnchorParent.textContent;
      if (headerAnchorParent.tagName === 'H2') {
        verticalTab.classList.add('ds-tab--vertical');
        verticalTab.setAttribute('role', 'tab');
        verticalTab.setAttribute('tabindex', '-1');
        verticalTab.setAttribute('id', `ds-vertical-tab-${nextUniqueId++}`);
        verticalTab.setAttribute('aria-selected', 'false');
        verticalTab.setAttribute('aria-controls', headerAnchorParent.id);
        verticalTabs.push(verticalTab);
        headerAnchorParent?.parentElement?.setAttribute('aria-labelledby', verticalTab.id);
      }
      verticalTabs[0].classList.add('active');
    }
  });

  verticalTabs.forEach(tab => verticalTabsWrapper.appendChild(tab));

  verticalTabsAll.push(...verticalTabs);

  verticalTabsAll.forEach(verticalTab => {
    verticalTab.onclick = (event: MouseEvent) => {
      setTimeout(() => {
        selectVerticalTab(event.target as Element);
      }, 500);
    };
  });
}

function handleWidthChange(
  matches: boolean,
  target: Element,
  componentNameHeading: HTMLHeadingElement,
  onchange = false
): void {
  console.log('matches, matches - 1', matches, onchange, headingElement, target, componentNameHeading, headingElement); // TODO: check if it's sticky
  if (matches) {
    if (onchange) {
      headingElement?.replaceWith(navLogo);
      headingElement = undefined;
    }
    target.insertAdjacentElement('afterbegin', componentNameHeading);
  } else {
    console.log('11 to onchange i nie matches i jest sticky', onchange);
    if (onchange) {
      // if (headingElement) {
      // target.removeChild(/*headingElement*/ componentNameHeading);
      // } // TODO:  check if child exists
      console.log(
        'to onchange i nie matches i jest sticky',
        target,
        target.children[0],
        target.children[0] === componentNameHeading
      );
      navLogo?.replaceWith(componentNameHeading);
      const oldComponentName = target.querySelector('.ds-top-navigation__component-name');
      oldComponentName?.remove();
      // componentNameHeading.remove();
      //headingElement?.remove();
      // headingElement = undefined;
    } else {
      // setTimeout(() => {
      requestAnimationFrame(() => {
        navLogo?.replaceWith(componentNameHeading);
      });
      // }, 500);
      // headingElement = componentNameHeading;
    }
    headingElement = componentNameHeading;
  }
  // if (matches && menu.classList.contains('ds-sidebar--closed')) {
  //   topNavigation.style.display = 'none';
  // } else if (matches && menu.classList.contains('ds-sidebar--opened')) {
  //   topNavigation.style.display = 'none';
  //   toggleMenu();
  //   showMenu();
  // } else {
  //   toggleMenu();
  //   setActiveItem();
  // }
}

function handleWidthChange2(matches: boolean, target: Element, onchange = false): void {
  console.log('matches, matches - 2', matches, headingElement, navLogo, 'nie jest sticky');
  if (!headingElement) {
    return;
  }
  if (matches) {
    console.log('target', target, headingElement);
    // target.removeChild(headingElement); // TODO:  check if child exists
    // headingElement = undefined;
    const componentNameInsideTopNav = document?.querySelectorAll('.ds-top-navigation__component-name');
    componentNameInsideTopNav.forEach(componentName => componentName.remove());
    headingElement = undefined;
  } else {
    console.log('else in second function', target, onchange);
    // if (onchange) {
    //   // (navLogo as HTMLElement).style.animation = 'none';
    //   // headingElement.remove();
    //   const oldComponentName = target.querySelector('.ds-top-navigation__component-name');
    //   oldComponentName?.replaceWith(navLogo);
    // } else {
    // requestAnimationFrame(() => {

    const topNavigation = document.querySelector('.ds-top-navigation');
    const componentNameInsideTopNav = topNavigation?.querySelector('.ds-top-navigation__component-name');
    console.log('matches - 2 replace', target, headingElement, navLogo, componentNameInsideTopNav);
    // setTimeout(() => {
    //(componentNameInsideTopNav as HTMLElement).style.display = 'none';
    componentNameInsideTopNav?.replaceWith(navLogo);
    topNavigation?.appendChild(navLogo);
    // }, 1800);
    //setTimeout(() => {
    // componentNameInsideTopNav?.replaceWith(navLogo);
    headingElement = undefined;
    //}, 1800);
    //}
    // });
  }
}

const config = {
  root: null,
  threshold: 1
};

const observer = new IntersectionObserver(
  entries =>
    entries.forEach(({ target, intersectionRatio }) => {
      const tabsContainer = target.previousSibling as Element;
      if (!tabsContainer) {
        return;
      }

      const componentNameHeading = document.createElement('h1');
      componentNameHeading.textContent = componentName as string;
      componentNameHeading.classList.add('ds-top-navigation__component-name');

      if (intersectionRatio < 1) {
        //tabsContainer.classList.add('ds-tabs__container--sticky');
        target.classList.add('ds-tabs__container--sticky');

        mediaQueryList.onchange = event => {
          console.log('onchange', event, componentNameHeading, headingElement);
          // headingElement = undefined;
          // if (/*matched && */ !headingElement) {
          // setTimeout(() => {
          handleWidthChange(event.matches, target, componentNameHeading, true);
          headingElement = componentNameHeading;
          // }, 500);
          // }
        };

        console.log('!mediaQueryList.onchange', !mediaQueryList.onchange.length);

        // if (!mediaQueryList.onchange) {
        const matched = mediaQueryList.matches;
        console.log('matched', matched, headingElement);
        if (/*matched && */ !headingElement) {
          handleWidthChange(matched, target, componentNameHeading);
        }
        headingElement = componentNameHeading;
        // }

        // handleWidthChange(event.matches);

        // function handleWidthChange(matches: boolean): void {
        //   console.log('matches, matches', matches);
        //   if (matches) {
        //     target.insertAdjacentElement('afterbegin', componentNameHeading);
        //   } else {
        //     navLogo?.replaceWith(componentNameHeading);
        //   }
        //   // if (matches && menu.classList.contains('ds-sidebar--closed')) {
        //   //   topNavigation.style.display = 'none';
        //   // } else if (matches && menu.classList.contains('ds-sidebar--opened')) {
        //   //   topNavigation.style.display = 'none';
        //   //   toggleMenu();
        //   //   showMenu();
        //   // } else {
        //   //   toggleMenu();
        //   //   setActiveItem();
        //   // }
        // }

        // navLogo?.replaceWith(componentNameHeading);
        //target.appendChild(componentNameHeading);
        // target.insertAdjacentElement('afterbegin', componentNameHeading);
        // requestAnimationFrame(() => {
        //   // navLogo.className = 'fade';
        //   componentNameHeading.classList.add('fade-in');
        // });
        // headingElement = componentNameHeading;
      } else {
        // tabsContainer.classList.remove('ds-tabs__container--sticky');
        target.classList.remove('ds-tabs__container--sticky');

        mediaQueryList.onchange = event => {
          console.log('meedia query change', event, target);
          // setTimeout(() => {
          handleWidthChange2(event.matches, target, true);
          // });
        };

        // handleWidthChange2(event.matches);

        const matched = mediaQueryList.matches;
        console.log('matched', matched);

        if (headingElement) {
          handleWidthChange2(matched, target);
        }

        // function handleWidthChange2(matches: booleanm, target: Element): void {
        //   console.log('matches, matches', matches);
        //   if (matches) {
        //     console.log('target', target);
        //     target.removeChild(headingElement); // TODO:  check if child exists
        //   } else {
        //     headingElement?.replaceWith(navLogo);
        //   }
        // }

        // target.removeChild(headingElement);
        // headingElement?.replaceWith(navLogo);
        // requestAnimationFrame(() => {
        //   headingElement.classList.add('fade');
        //   // navLogo.className = 'fade-in';
        // });
      }

      console.log('entry target tabsContainer', tabsContainer, tabsContainer.classList, target.classList);
      console.log('tabsContainer2', tabsContainer, tabsContainer.classList);
    }),
  config
);

function setScrollable(): void {
  if (!tabsWrapper) {
    return;
  }

  const { clientWidth, scrollWidth } = tabsWrapper,
    scrollable = scrollWidth > clientWidth;

  tabsWrapper.classList.toggle('ds-tabs-wrapper--scrollable', scrollable);
}

function selectTab(tab: Element): void {
  if (!tabs || !tabsContents) {
    return;
  }

  const start = (tab as HTMLElement).offsetLeft - (tabsContainer as HTMLElement)?.offsetLeft - 24;

  setTimeout(() => {
    tabsWrapper.scrollTo({ left: start, behavior: 'smooth' });
  }, 100);

  current?.setAttribute('aria-selected', 'false');
  tab.setAttribute('aria-selected', 'true');
  current?.setAttribute('tabindex', '-1');
  tab.setAttribute('tabindex', '0');
  const tabContent = Array.from(tabsContents).find(tabContent => {
    if (tabContent.getAttribute('aria-labelledby') === tab.getAttribute('id')) {
      return tabContent;
    }
  });
  currentContent?.classList.replace('ds-tabs__tab-content--active', 'ds-tabs__tab-content--hidden');
  tabContent?.classList.replace('ds-tabs__tab-content--hidden', 'ds-tabs__tab-content--active');

  for (let i = 0; i < tabs?.length; i++) {
    if (!tabsWrapper || !current) {
      return;
    }
    current.className = current?.className.replace(' active', '');
    tab.className += ' active';

    alignTabIndicator(current);
    current = tab;
    currentContent = tabContent as Element;

    observer?.disconnect();
    observer.observe(tabsContainer as Element);
  }

  const tabSections = tabContent?.querySelectorAll('section[id]');
  tabSections?.forEach(section => {
    section.setAttribute('role', 'tabpanel');
  });

  const verticalTabs = tabContent?.querySelectorAll('.ds-tab--vertical');

  verticalTabs?.forEach(
    verticalTab =>
      ((verticalTab as HTMLElement).onkeydown = (event: KeyboardEvent) => {
        onKeydown(event, true, verticalTabs);
      })
  );

  if (verticalTabs) {
    selectVerticalTab(verticalTabs[0]);
  }

  window.onscroll = () => {
    if (!tabSections || !verticalTabs || !tabContent) {
      return;
    }
    tabSections.forEach((section, i) => {
      const rect = section.getBoundingClientRect().y;
      if (rect < window.innerHeight /*- 100*/ /*200*/) {
        selectVerticalTab(verticalTabs[i]);
      }
    });
  };
}

function alignTabIndicator(tab: Element): void {
  if (!tabsWrapper) {
    return;
  }

  slider.style.left = `${tab.getBoundingClientRect().left - tabsWrapper.getBoundingClientRect().left}px`;
  indicator.style.width = `${tab.getBoundingClientRect().width}px`;
}

function selectVerticalTab(verticalTab: Element): void {
  currentVerticalTabsContainer = currentContent.querySelector('.ds-tabs[vertical]')?.firstChild as Element;
  currentVerticalTabLink?.setAttribute('aria-selected', 'false');
  verticalTab.setAttribute('aria-selected', 'true');
  currentVerticalTabLink?.setAttribute('tabindex', '-1');
  verticalTab.setAttribute('tabindex', '0');

  const verticalTabs = currentContent.querySelectorAll('.ds-tab--vertical');
  verticalTabs.forEach(v => v.classList.remove('active'));
  alignVerticalTabIndicator(verticalTab, currentVerticalTabsContainer);
  verticalTab.classList.add('active');
  currentVerticalTabLink = verticalTab;
}

function alignVerticalTabIndicator(tab: Element, currentVerticalTabsContainer: Element): void {
  const currentVerticalSliderElement = currentVerticalTabsContainer.querySelector('.vertical-slider') as HTMLElement;
  const currentVerticalIndicatorElement = currentVerticalTabsContainer.querySelector(
    '.vertical-indicator'
  ) as HTMLElement;

  if (!verticalTabsWrapperAll || !currentVerticalSliderElement || !currentVerticalIndicatorElement) {
    return;
  }
  currentVerticalIndicatorElement.style.top = `${
    tab.getBoundingClientRect().top - currentVerticalTabsContainer.getBoundingClientRect().top
  }px`;
  currentVerticalIndicatorElement.style.height = `${tab.getBoundingClientRect().height}px`;
}

function onKeydown(event: KeyboardEvent, vertical = false, verticalTabs?: NodeListOf<Element>): void {
  if (event.code === 'Space' && vertical) {
    selectVerticalTab(event.target as Element);
    window.scrollTo({ top: (event.target as Element).scrollTop });
  }

  const keys = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];

  if (!keys.includes(event.key)) {
    return;
  }

  if (keys && vertical) {
    event.preventDefault();
  }

  const focusedTab = getActiveElement(event.target as Node) as HTMLElement;

  const navTabs = verticalTabs ? (verticalTabs as NodeListOf<HTMLElement>) : tabs;
  let index: number = Array.from(navTabs).indexOf(focusedTab);
  index += event.key === keys[0] ? -1 : 1;
  index = index % navTabs.length;

  const nextTab = navTabs[index];
  if (nextTab) {
    nextTab.focus();
  }
}

function onScroll(event: Event): void {
  slider.scrollTo({ left: (event.target as HTMLElement).scrollLeft });
  if (!current || !tabsWrapper) {
    return;
  }
  slider.style.left = `${current.getBoundingClientRect().left - tabsWrapper.getBoundingClientRect().left}px`;
}
