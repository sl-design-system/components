import { getActiveElement } from '../utils/active-element';

const tabsContainer = document.querySelector('.ds-tabs');
const tabsHeaderContainer = document.querySelector('.ds-tabs__container') as Element;
const tabsWrapper = document.querySelector('.ds-tabs-wrapper');
const tabs: NodeListOf<HTMLElement> = document.querySelectorAll('.ds-tab');
const slider = tabsContainer?.querySelector('.slider') as HTMLElement;
const indicator = slider?.querySelector('.indicator') as HTMLElement;
const tabsContents = tabsContainer?.querySelectorAll('.ds-tabs__tab-content');
// const container = document.querySelector('.ds-container');
// const menu = document.querySelector('.ds-sidebar') as HTMLElement;

let current = tabsWrapper?.querySelector('.active');
let currentContent: Element;
let nextUniqueId = 0;

window.onload = () => {
  if (!tabsWrapper || !current) {
    return;
  }
  tabs.forEach(tab => {
    tab.setAttribute('id', `ds-tab-${nextUniqueId++}`);
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
  });
  // tabs.forEach(tab => tab.setAttribute('id', `ds-tab-${nextUniqueId++}`));
  // tabs.forEach(tab => tab.setAttribute('role', 'tab'));
  // tabs.forEach(tab => tab.setAttribute('aria-selected', 'false'));
  tabsContents?.forEach((tabContent, id) => {
    tabContent.setAttribute('id', `ds-tab-content-${nextUniqueId++}`);
    tabContent.setAttribute('role', 'tabpanel');
    tabContent.setAttribute('aria-labelledby', tabs[id].getAttribute('id') as string);
    tabContent.classList.add('ds-tabs__tab-content--hidden');
  });

  setScrollable();

  // tabsContents?.forEach(tabContent => tabContent.setAttribute('id', `ds-tab-content-${nextUniqueId++}`));
  // tabsContents?.forEach(tab => tab.setAttribute('role', 'tabpanel'));
  // tabsContents?.forEach((tab, id) => tab.setAttribute('aria-labelledby', tabs[id].getAttribute('id') as string));
  // tabsContents?.forEach(tabContent => tabContent.classList.add('ds-tabs__tab-content--hidden'));
  selectTab(current);

  console.log('tabsHeaderContainer', tabsHeaderContainer);

  (tabsWrapper as HTMLElement).onscroll = event => {
    console.log('scroll 222');
    onScroll(event);
  };

  observer.observe(/*tabsHeaderContainer*/ tabsContainer as Element); // TODO: change, not working? why?

  // observer.observe(tabsHeaderContainer);
};

window.onresize = () => {
  if (!tabsWrapper || !current) {
    return;
  }
  // const //tabsHeaderContainer, //wrapper = tabsHeaderContainer?.querySelector('.wrapper') as HTMLElement,
  //   { clientWidth, scrollLeft, scrollWidth } = tabsHeaderContainer,
  //   scrollable = scrollWidth <= clientWidth;
  //
  // console.log(
  //   'tabsHeaderContainer, clientWidth, scrollLeft, scrollWidth, scrollable',
  //   tabsHeaderContainer,
  //   clientWidth,
  //   scrollLeft,
  //   scrollWidth,
  //   scrollable
  // );
  //
  // tabsWrapper.classList.toggle('ds-tabs-wrapper--scrollable', scrollable);

  setScrollable();

  // const current = tabsWrapper.querySelectorAll('.active');
  selectTab(current);
};

window.onkeydown = (event: KeyboardEvent) => {
  onKeydown(event);
};

// tabsWrapper
//   ? (tabsWrapper.scroll = event => {
//       console.log('scroll');
//       onScroll(event);
//     })
//   : null;
//
// document.onscroll = event => {
//   console.log('onscroll', event);
//   onScroll(event);
// };

// (tabsWrapper as HTMLElement).onscroll = event => {
//   console.log('scroll 222');
//   onScroll(event);
// };

tabs?.forEach(tab => {
  tab.onclick = (event: MouseEvent) => {
    selectTab(event.target as Element);
  };
});

document.addEventListener('sticky-change', e => {
  console.log('event on sticky change', e);
});

// function observeStickyHeaderChanges(container) {
//   observeHeaders(container);
// }
//
// observeStickyHeaderChanges(document.querySelector('#scroll-container'));
//
// function observeHeaders(container) {
//   const observer = new IntersectionObserver(
//     (records, observer) => {
//       for (const record of records) {
//         const targetInfo = record.boundingClientRect;
//         const stickyTarget = record.target.parentElement.querySelector('.sticky');
//         const rootBoundsInfo = record.rootBounds;
//
//         // Started sticking.
//         if (targetInfo.bottom < rootBoundsInfo.top) {
//           fireEvent(true, stickyTarget);
//         }
//
//         // Stopped sticking.
//         if (targetInfo.bottom >= rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
//           fireEvent(false, stickyTarget);
//         }
//       }
//     },
//     { threshold: [0], root: container }
//   );
//
//   // Add the top sentinels to each section and attach an observer.
//   const sentinels = addSentinels(container, 'sticky_sentinel--top');
//   sentinels.forEach(el => observer.observe(el));
// }

/*const observer2 = new IntersectionObserver(([e]) => {
  console.log(e, e.intersectionRatio);
  // e.target.classList.toggle('is-pinned', e.intersectionRatio < 1),
  //   {
  //     threshold: [1]
  //   };
  if (e.intersectionRatio > 1) {
    e.target.classList.add('active');
  } else {
    e.target.classList.remove('active');
  }
});*/

const config = {
  root: null, //null, // Sets the framing element to the viewport
  rootMargin: '104px', //'112px', // TODO change for the desktop version on resize as well
  threshold: 1
};

const observer = new IntersectionObserver(
  entries =>
    entries.forEach(({ boundingClientRect, rootBounds, target, intersectionRatio }) => {
      const tabsContainer = target.querySelector('.ds-tabs__container');
      console.log(
        'intersectionRatio',
        intersectionRatio,
        target,
        tabsContainer,
        entries,
        entries[0]?.boundingClientRect.bottom < entries[0].rootBounds?.bottom,
        entries[0]?.intersectionRect.bottom < entries[0].rootBounds?.bottom,
        entries[0]?.boundingClientRect.height < entries[0].rootBounds?.bottom,
        entries[0]?.boundingClientRect.bottom > entries[0].rootBounds?.bottom,
        boundingClientRect.bottom > rootBounds.bottom - 112 //142
      );
      if (!tabsContainer) {
        return;
      }
      if (rootBounds && intersectionRatio >= 1 && boundingClientRect.bottom > rootBounds.bottom + rootBounds.top) {
        tabsContainer.classList.add('ds-tabs__container--sticky');
      } else {
        tabsContainer.classList.remove('ds-tabs__container--sticky');
      }
    }),
  config
);

// observer.observe(/*tabsHeaderContainer*/ tabsContainer as Element);

function setScrollable(): void {
  if (!tabsWrapper) {
    return;
  }

  const //tabsHeaderContainer, //wrapper = tabsHeaderContainer?.querySelector('.wrapper') as HTMLElement,
    { clientWidth, scrollLeft, scrollWidth } = tabsWrapper,
    scrollable = scrollWidth > clientWidth;

  console.log(
    'tabsHeaderContainer, clientWidth, scrollLeft, scrollWidth, scrollable',
    tabsHeaderContainer,
    clientWidth,
    scrollLeft,
    scrollWidth,
    scrollable,
    tabsHeaderContainer.getBoundingClientRect().width,
    tabsContainer?.clientWidth,
    tabsContainer?.getBoundingClientRect().width,
    tabsContainer?.clientWidth,
    tabsContainer?.scrollWidth,
    window.innerWidth,
    window.outerWidth,
    tabsContainer ? tabsContainer?.clientWidth < window.innerWidth : null,
    tabsWrapper.clientWidth,
    tabsWrapper.getBoundingClientRect().width,
    tabsWrapper.scrollWidth,
    tabsWrapper.getBoundingClientRect().width < tabsWrapper.scrollWidth
  );

  tabsWrapper.classList.toggle('ds-tabs-wrapper--scrollable', scrollable);
}

function selectTab(tab: Element): void {
  console.log('event tab', tab);

  // observer.observe(/*tabsHeaderContainer*/ tabsContainer as Element);

  if (!tabs || !tabsContents) {
    return;
  }

  current?.setAttribute('aria-selected', 'false');
  tab.setAttribute('aria-selected', 'true');
  const tabContent = Array.from(tabsContents).find(tabContent => {
    if (tabContent.getAttribute('aria-labelledby') === tab.getAttribute('id')) {
      return tabContent;
    }
  });
  currentContent?.classList.replace('ds-tabs__tab-content--active', 'ds-tabs__tab-content--hidden');
  tabContent?.classList.replace('ds-tabs__tab-content--hidden', 'ds-tabs__tab-content--active');
  for (let i = 0; i < tabs?.length; i++) {
    console.log('tabs width', tabsContainer?.clientWidth);
    //tabs[i].addEventListener('click', function () {
    if (!tabsWrapper || !current) {
      return;
    }

    // tabs.forEach(tab => tab.setAttribute('id', '1')); // TODO: unique id

    // const current = tabsWrapper.querySelectorAll('.active');
    current.className = current?.className.replace(' active', '');
    tab.className += ' active';

    // slider.style.transform = `translateX(calc{100% * (${i} - 1)})`;
    // console.log(
    //   'current[0].getBoundingClientRect().width',
    //   current[0].getBoundingClientRect().width,
    //   current[0].getBoundingClientRect().left,
    //   tabsWrapper.getBoundingClientRect().left,
    //   tabsWrapper.clientWidth,
    //   (tabsWrapper as HTMLDivElement).offsetWidth,
    //   (tabsWrapper as HTMLDivElement).scrollWidth,
    //   current[0].getBoundingClientRect().left - tabsWrapper.getBoundingClientRect().left
    // );
    // slider.style.left = `${current[0].getBoundingClientRect().left - tabsWrapper.getBoundingClientRect().left}px`; //`calc(calc(100% / 4) * ${i})`;
    // indicator.style.width = `${current[0].getBoundingClientRect().width}px`;

    alignTabIndicator(current);
    current = tab;
    currentContent = tabContent as Element;

    console.log(
      '(tab as HTMLElement).offsetLeft - (tabsWrapper as HTMLElement).offsetLeft',
      (tab as HTMLElement).offsetLeft,
      (tab as HTMLElement).offsetLeft - (tabsWrapper as HTMLElement).offsetLeft,
      (tabsWrapper as HTMLElement).offsetLeft,
      (tab as HTMLElement).scrollLeft,
      (tabContent as HTMLElement).scrollLeft,
      (tabContent as HTMLElement).offsetLeft
    );
    // const tabOffset = (tab as HTMLElement).offsetLeft - (tabsWrapper as HTMLElement).offsetLeft;
    //tabsWrapper.scrollTo({ left: -(tab as HTMLElement).offsetLeft });
    // tabsWrapper.scrollTo({ left: (tabContent as HTMLElement).offsetLeft }); // TODO: show active tab
    //});
    observer.disconnect();
    observer.observe(/*tabsHeaderContainer*/ tabsContainer as Element);
  }
}

function alignTabIndicator(tab: Element): void {
  if (!tabsWrapper) {
    return;
  }

  slider.style.left = `${tab.getBoundingClientRect().left - tabsWrapper.getBoundingClientRect().left}px`; //`calc(calc(100% / 4) * ${i})`;
  indicator.style.width = `${tab.getBoundingClientRect().width}px`;
  //slider.scrollTo({ left: tab.getBoundingClientRect().left - tabsWrapper.getBoundingClientRect().left });
  // slider.scrollTo({ left: tab.scrollLeft });
  console.log('tabsWrapper.scrollLeft', tabsWrapper.scrollLeft, tab.scrollLeft, tab.scrollWidth);
  // tabsWrapper.scrollTo({ left: -tabsWrapper.scrollLeft });
}

// for (let i = 0; i < tabs?.length; i++) {
//   if (!tabs) {
//     return;
//   }
//
//   tabs[i]?.addEventListener('click', function () {
//     if (!tabsContainer || !slider) {
//       return;
//     }
//
//     tabs?.forEach(tab => tab.setAttribute('id', '1')); // TODO: unique id
//
//     const current = tabsContainer.querySelectorAll('.active');
//     current[0].className = current[0]?.className.replace(' active', '');
//     this.className += ' active';
//
//     // slider.style.transform = `translateX(calc{100% * (${i} - 1)})`;
//     slider.style.left = `calc(calc(100% / 4) * ${i})`;
//   });
// }

// for (let i = 0; i < tabsPane.length; i++) {
//   tabsPane[i].addEventListener('click', function () {
//     tabHeader.getElementsByClassName('active')[0].classList.remove('active');
//     tabsPane[i].classList.add('active');
//     tabBody.getElementsByClassName('active')[0].classList.remove('active');
//     tabBody.getElementsByTagName('div')[i].classList.add('active');
//
//     tabIndicator.style.left = `calc(calc(100% / 4) * ${i})`;
//   });
// }

function onKeydown(event: KeyboardEvent): void {
  const keys = ['ArrowLeft', 'ArrowRight'];

  if (!keys.includes(event.key)) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const focusedTab = getActiveElement(event.target as Node) as HTMLElement;

  let index: number = Array.from(tabs).indexOf(focusedTab);
  index += event.key === keys[0] ? -1 : 1;
  index = index % tabs.length;

  const nextTab = tabs[index];
  if (nextTab) {
    nextTab.focus();
  }
}

function onScroll(event: Event): void {
  console.log((event.target as HTMLElement).scrollLeft, slider.scrollLeft, current?.scrollLeft);
  // slider.style.left = `-${(event.target as HTMLElement).scrollLeft}px`;
  slider.scrollTo({ left: (event.target as HTMLElement).scrollLeft });
  // const sliderScrollLeft = (event.target as HTMLElement).scrollLeft;
  console.log((event.target as HTMLElement).scrollLeft, slider.scrollLeft);
  if (!current || !tabsWrapper) {
    return;
  }
  slider.style.left = `${current.getBoundingClientRect().left - tabsWrapper.getBoundingClientRect().left}px`; // - sliderScrollLeft
}
