// import { getActiveElement } from '../utils/active-element.js';
//
// const mediaQueryList: MediaQueryList = window.matchMedia('(min-width: 900px)'),
//   navLogo = document.querySelector('.ds-top-navigation__logo') as Element,
//   componentName = document.querySelector('.ds-component__heading-wrapper h1')?.textContent,
//   headerAnchorsParentsAll: Array<HTMLElement | undefined> = [],
//   verticalTabsWrapperAll: Element[] = [],
//   verticalTabsAll: HTMLElement[] = [];
//
// const slTabs = document.querySelectorAll('sl-tab') as NodeListOf<HTMLElement>;
//
// let tabsContainer = document.querySelector('.ds-tabs'),
//   slider = tabsContainer?.querySelector('.ds-tabs__slider') as HTMLElement,
//   indicator = slider?.querySelector('.ds-tabs__indicator') as HTMLElement,
//   headingElement: HTMLHeadingElement | undefined,
//   horizontalTabsContainer: Element | null,
//   tabsWrapper: Element,
//   tabsContentWrapper: Element,
//   tabs: NodeListOf<HTMLElement>,
//   tabsContents: NodeListOf<Element>,
//   current: Element,
//   currentContent: Element,
//   nextUniqueId = 0,
//   headerAnchors: NodeListOf<Element>,
//   currentVerticalTabLink: Element,
//   currentVerticalTabsContainer: Element;
//
// // window.onload = () => {
// //   generateTabsElements();
// //
// //   // setScrollable();
// //
// //   selectTab(current);
// //
// //   // if (tabsWrapper) {
// //   //   (tabsWrapper as HTMLElement).onscroll = event => {
// //   //     onScroll(event);
// //   //   };
// //   // }
// //
// //   // const verticalTabContent = document.querySelector('sl-tab-panel[aria-hidden="false"]') as HTMLElement;
// //   // verticalTabContent.onscroll = event => {
// //   //   onScroll(event);
// //   // };
// //   //
// //   // tabs?.forEach(tab => {
// //   //   tab.onclick = (event: MouseEvent) => {
// //   //     selectTab(event.target as Element);
// //   //   };
// //   // });
// //   //
// //   // console.log('slTabs onload', slTabs, tabsWrapper);
// //   //
// //   // slTabs.forEach(tab => {
// //   //   tab.onclick = event => {
// //   //     // selectTab(event.target as Element);
// //   //     const verticalTabs = currentContent?.querySelectorAll('.ds-tab--vertical');
// //   //     console.log('event on sl-tab-change slTabs', event, verticalTabs);
// //   //     // requestAnimationFrame(() => {
// //   //     //   selectVerticalTab(verticalTabs[0]);
// //   //     // });
// //   //     // selectVerticalTab(verticalTabs[0]);
// //   //   };
// //   // });
// // };
//
// // window.onresize = () => {
// //   if (!tabsWrapper || !current) {
// //     return;
// //   }
// //
// //   // setScrollable();
// //
// //   selectTab(current);
// // };
//
// window.onkeydown = (event: KeyboardEvent) => {
//   onKeydown(event);
// };
//
// // window.onscroll = () => {
// //   // if (!tabSections || !verticalTabs || !tabContent) {
// //   //   return;
// //   // }
// //   const verticalTabs = currentContent?.querySelectorAll('.ds-tab--vertical');
// //   slTabs.forEach((section, i) => {
// //     console.log('sectiond and i in window onscroll', section, i);
// //     const rect = section.getBoundingClientRect().y;
// //     if (rect < window.innerHeight) {
// //       // TODO: I'm not sure if this is ok?
// //       // selectVerticalTab(verticalTabs[i]); // causes last vertical tab selected at the beginning ... verticalTabs[0]
// //       selectVerticalTab(verticalTabs[0]);
// //     }
// //   });
// // };
//
// function generateTabsElements(): void {
//   horizontalTabsContainer = document.querySelector('.ds-tabs[horizontal]');
//
//   if (!horizontalTabsContainer) {
//     return;
//   }
//
//   tabsWrapper = horizontalTabsContainer.querySelector('.ds-tabs-wrapper') as Element;
//   tabsContentWrapper = horizontalTabsContainer.querySelector('.ds-tabs__tab-content-wrapper') as Element;
//   tabs = horizontalTabsContainer.querySelectorAll('.ds-tab');
//   tabs[0].classList.add('active');
//
//   tabsContainer = document.createElement('div');
//   tabsContainer.classList.add('ds-tabs__container');
//   horizontalTabsContainer.insertBefore(tabsContainer, tabsContentWrapper);
//
//   tabsWrapper = document.createElement('div');
//   tabsWrapper.classList.add('ds-tabs-wrapper');
//   tabsContainer.appendChild(tabsWrapper);
//
//   slider = document.createElement('div');
//   slider.classList.add('ds-tabs__slider');
//   tabsContainer.appendChild(slider);
//
//   indicator = document.createElement('div');
//   indicator.classList.add('ds-tabs__indicator');
//   slider.appendChild(indicator);
//
//   tabs.forEach(tab => tabsWrapper.appendChild(tab));
//
//   current = tabsWrapper.querySelector('.active') as Element;
//
//   tabsContents = horizontalTabsContainer.querySelectorAll('.ds-tabs__tab-content');
//   tabsContents[0].classList.add('ds-tabs__tab-content--active');
//
//   if (!tabsWrapper || !current) {
//     return;
//   }
//
//   tabs.forEach(tab => {
//     tab.setAttribute('id', `ds-tab-${nextUniqueId++}`);
//     tab.setAttribute('role', 'tab');
//     tab.setAttribute('aria-selected', 'false');
//     tab.setAttribute('tabindex', '-1');
//   });
//
//   tabsContents.forEach((tabContent, id) => {
//     tabContent.setAttribute('id', `ds-tab-content-${nextUniqueId++}`);
//     tabContent.setAttribute('role', 'tabpanel');
//     tabContent.setAttribute('aria-labelledby', tabs[id].getAttribute('id') as string);
//     tabContent.classList.add('ds-tabs__tab-content--hidden');
//     const tabContentChildren = Array.from(tabContent.childNodes);
//     const tabContainer = document.createElement('div');
//     tabContainer.classList.add('ds-tabs__tab-container');
//     tabContentChildren.forEach(content => {
//       tabContainer.appendChild(content);
//     });
//     tabContent.appendChild(tabContainer);
//     generateVerticalTabs(tabContent); // this needs to be done for more elements than just tabs
//   });
// }
//
// export function generateVerticalTabs(verticalTabContent: Element): void {
//   if (!verticalTabContent) {
//     return;
//   }
//
//   /*  console.log(
//     'verticalTabContent in tabs script - generateVerticalTabs',
//     verticalTabContent,
//     verticalTabContent.parentElement
//   );
//
//   const verticalTabsContainers = document.createElement('div');
//   verticalTabsContainers.setAttribute('vertical', '');
//   verticalTabsContainers.classList.add('ds-tabs');
//
//   const verticalTabsContainer = document.createElement('div');
//   verticalTabsContainer.classList.add('ds-tabs__container');
//   verticalTabsContainers.appendChild(verticalTabsContainer);
//
//   verticalTabContent.appendChild(verticalTabsContainers);
//
//   const verticalTabsWrapper = document.createElement('div');
//   verticalTabsWrapper.classList.add('ds-tabs-wrapper');
//   verticalTabsWrapper.setAttribute('role', 'tablist');
//   verticalTabsWrapper.setAttribute('aria-orientation', 'vertical');
//   verticalTabsContainer.appendChild(verticalTabsWrapper);
//   verticalTabsWrapperAll.push(verticalTabsWrapper);
//
//   const verticalSlider = document.createElement('div');
//   verticalSlider.classList.add('ds-tabs__vertical-slider');
//   verticalTabsContainer.appendChild(verticalSlider);
//
//   const verticalIndicator = document.createElement('div');
//   verticalIndicator.classList.add('ds-tabs__vertical-indicator');
//   verticalSlider.appendChild(verticalIndicator);
//
//   headerAnchors = verticalTabContent.querySelectorAll('.header-anchor, [link-in-navigation]');
//
//   // console.log('headerAnchors in vertical', headerAnchors);
//
//   const headerAnchorsParents = Array.from(headerAnchors)
//     .map(element => {
//       if (element.parentElement?.tagName === 'H2') {
//         console.log('element h2?', element);
//         if (element.parentElement.parentNode) {
//           (element.parentElement.parentNode as Element).id = element.parentElement.id;
//         }
//         return element.parentElement;
//       } else if (element.hasAttribute('link-in-navigation')) {
//         return element as HTMLElement;
//       }
//       return;
//     })
//     .filter(element => element !== undefined);
//   headerAnchorsParentsAll.push(...headerAnchorsParents);
//
//   console.log('headerAnchors in vertical - parents', headerAnchorsParentsAll);
//
//   const verticalTabs: HTMLElement[] = [];
//
//   headerAnchorsParents.forEach(headerAnchorParent => {
//     if (headerAnchorParent) {
//       const verticalTab = document.createElement('a');
//       if (headerAnchorParent.tagName === 'H2') {
//         verticalTab.textContent = headerAnchorParent.textContent;
//         headerAnchorParent?.parentElement?.setAttribute('aria-labelledby', verticalTab.id);
//       } else if (headerAnchorParent.getAttribute('link-in-navigation-text')) {
//         verticalTab.textContent = headerAnchorParent.getAttribute('link-in-navigation-text');
//         headerAnchorParent.setAttribute('aria-labelledby', verticalTab.id);
//       }
//
//       if (headerAnchorParent.tagName === 'H2' || headerAnchorParent.getAttribute('link-in-navigation-text')) {
//         verticalTab.setAttribute('href', `#${headerAnchorParent.id}`);
//         verticalTab.classList.add('ds-tab--vertical');
//         verticalTab.setAttribute('role', 'tab');
//         verticalTab.setAttribute('tabindex', '-1');
//         verticalTab.setAttribute('id', `ds-vertical-tab-${nextUniqueId++}`);
//         verticalTab.setAttribute('aria-selected', 'false');
//         verticalTab.setAttribute('aria-controls', headerAnchorParent.id);
//         verticalTabs.push(verticalTab);
//       }
//       verticalTabs[0].classList.add('active');
//     }
//   });
//
//   verticalTabs.forEach(tab => verticalTabsWrapper.appendChild(tab));
//
//   verticalTabsAll.push(...verticalTabs);
//
//   console.log('verticalTabsAll', verticalTabsAll);
//
//   // currentContent = verticalTabContent.parentElement.getAttribute('aria-hidden') == 'false' ? verticalTabContent : null;
//
//   if (verticalTabContent.parentElement && verticalTabContent.parentElement.getAttribute('aria-hidden') == 'false') {
//     currentContent = verticalTabContent;
//   }
//
//   // selectVerticalTab(verticalTabs[0]);
//   //
//   // verticalTabsAll.forEach(verticalTab => {
//   //   verticalTab.onclick = (event: MouseEvent) => {
//   //     setTimeout(() => {
//   //       selectVerticalTab(event.target as Element);
//   //     }, 100);
//   //   };
//   // });
//
//   const tabSections = verticalTabContent?.querySelectorAll('section[id], [link-in-navigation][id]');*/
//
//   // window.onscroll = () => {
//   //   if (!tabSections || !verticalTabs || !verticalTabContent) {
//   //     return;
//   //   }
//   //   console.log(
//   //     'tabSections-tabSections-tabSections',
//   //     tabSections,
//   //     verticalTabContent,
//   //     verticalTabContent.parentElement,
//   //     verticalTabContent.parentElement?.getAttribute('aria-hidden') == 'false' // TODO: sth wrong here
//   //   );
//   //   tabSections.forEach((section, i) => {
//   //     const rect = section.getBoundingClientRect().y;
//   //     if (rect < window.innerHeight) {
//   //       selectVerticalTab(verticalTabs[i]);
//   //     }
//   //   });
//   // };
// }
//
// function showComponentName(
//   matches: boolean,
//   target: Element,
//   componentNameHeading: HTMLHeadingElement,
//   onchange = false
// ): void {
//   if (matches && onchange) {
//     headingElement?.replaceWith(navLogo);
//     headingElement = undefined;
//     target.insertAdjacentElement('afterbegin', componentNameHeading);
//   } else if (matches) {
//     target.insertAdjacentElement('afterbegin', componentNameHeading);
//   } else {
//     navLogo?.replaceWith(componentNameHeading);
//     const oldComponentName = target.querySelector('.ds-top-navigation__component-name');
//     componentNameHeading !== oldComponentName && onchange ? oldComponentName?.remove() : null;
//     headingElement = componentNameHeading;
//   }
// }
//
// function hideComponentName(matches: boolean): void {
//   if (!headingElement) {
//     return;
//   }
//   if (matches) {
//     const componentNameInsideTopNav = document?.querySelectorAll('.ds-top-navigation__component-name');
//     componentNameInsideTopNav.forEach(componentName => componentName.remove());
//     headingElement = undefined;
//   } else {
//     const topNavigation = document.querySelector('.ds-top-navigation');
//     const componentNameInsideTopNav = topNavigation?.querySelector('.ds-top-navigation__component-name');
//     componentNameInsideTopNav?.replaceWith(navLogo);
//     topNavigation?.appendChild(navLogo);
//     headingElement = undefined;
//   }
// }
//
// const config = {
//   root: null,
//   threshold: 1
// };
//
// const observer = new IntersectionObserver(
//   entries =>
//     entries.forEach(({ target, intersectionRatio }) => {
//       console.log('entries in tabs.ts', entries);
//       const topNavigation = document.querySelector('.ds-top-navigation');
//       const tabsContainer = target.previousSibling as Element;
//       if (!tabsContainer) {
//         return;
//       }
//
//       const componentNameHeading = document.createElement('h1');
//       componentNameHeading.textContent = componentName as string;
//       componentNameHeading.classList.add('ds-top-navigation__component-name');
//
//       if (intersectionRatio < 1) {
//         target.classList.add('ds-tabs__container--sticky');
//         topNavigation?.classList.add('ds-top-navigation--not-sticky');
//
//         mediaQueryList.onchange = event => {
//           showComponentName(event.matches, target, componentNameHeading, true);
//           headingElement = componentNameHeading;
//         };
//
//         if (!headingElement) {
//           showComponentName(mediaQueryList.matches, target, componentNameHeading);
//         }
//         headingElement = componentNameHeading;
//       } else {
//         target.classList.remove('ds-tabs__container--sticky');
//         topNavigation?.classList.remove('ds-top-navigation--not-sticky');
//
//         mediaQueryList.onchange = event => {
//           hideComponentName(event.matches);
//         };
//
//         if (headingElement) {
//           hideComponentName(mediaQueryList.matches);
//         }
//       }
//     }),
//   config
// );
//
// function setScrollable(): void {
//   if (!tabsWrapper) {
//     return;
//   }
//
//   const { clientWidth, scrollWidth } = tabsWrapper,
//     scrollable = scrollWidth > clientWidth;
//
//   tabsWrapper.classList.toggle('ds-tabs-wrapper--scrollable', scrollable);
// }
//
// // function selectTab(tab: Element): void {
// //   if (!tabs || !tabsContents) {
// //     return;
// //   }
// //
// //   const start = (tab as HTMLElement).offsetLeft - (tabsContainer as HTMLElement)?.offsetLeft - 24;
// //
// //   setTimeout(() => {
// //     tabsWrapper.scrollTo({ left: start, behavior: 'smooth' });
// //   }, 100);
// //
// //   current?.setAttribute('aria-selected', 'false');
// //   tab.setAttribute('aria-selected', 'true');
// //   current?.setAttribute('tabindex', '-1');
// //   tab.setAttribute('tabindex', '0');
// //   const tabContent = Array.from(tabsContents).find(tabContent => {
// //     return tabContent.getAttribute('aria-labelledby') === tab.getAttribute('id');
// //   });
// //   currentContent?.classList.replace('ds-tabs__tab-content--active', 'ds-tabs__tab-content--hidden');
// //   tabContent?.classList.replace('ds-tabs__tab-content--hidden', 'ds-tabs__tab-content--active');
// //
// //   for (let i = 0; i < tabs?.length; i++) {
// //     if (!tabsWrapper || !current) {
// //       return;
// //     }
// //     current.className = current?.className.replace(' active', '');
// //     tab.className += ' active';
// //
// //     alignTabIndicator(current);
// //     current = tab;
// //     currentContent = tabContent as Element;
// //
// //     observer?.disconnect();
// //     observer.observe(tabsContainer as Element);
// //   }
// //
// //   const tabSections = tabContent?.querySelectorAll('section[id], [link-in-navigation][id]');
// //   tabSections?.forEach(section => {
// //     section.setAttribute('role', 'tabpanel');
// //   });
// //
// //   const verticalTabs = tabContent?.querySelectorAll('.ds-tab--vertical');
// //
// //   verticalTabs?.forEach(
// //     verticalTab =>
// //       ((verticalTab as HTMLElement).onkeydown = (event: KeyboardEvent) => {
// //         onKeydown(event, true, verticalTabs);
// //       })
// //   );
// //
// //   // if (verticalTabs) {
// //   //   selectVerticalTab(verticalTabs[0]);
// //   // }
// //   //
// //   // window.onscroll = () => {
// //   //   if (!tabSections || !verticalTabs || !tabContent) {
// //   //     return;
// //   //   }
// //   //   console.log('tabSections-tabSections-tabSections', tabSections);
// //   //   tabSections.forEach((section, i) => {
// //   //     const rect = section.getBoundingClientRect().y;
// //   //     if (rect < window.innerHeight) {
// //   //       selectVerticalTab(verticalTabs[i]);
// //   //     }
// //   //   });
// //   // };
// // }
//
// // function alignTabIndicator(tab: Element): void {
// //   if (!tabsWrapper) {
// //     return;
// //   }
// //
// //   slider.style.left = `${tab.getBoundingClientRect().left - tabsWrapper.getBoundingClientRect().left}px`;
// //   indicator.style.width = `${tab.getBoundingClientRect().width}px`;
// // }
//
// // slTabs.forEach(tab =>
// //   tab.addEventListener('click', event => {
// //     const verticalTabs = currentContent?.querySelectorAll('.ds-tab--vertical');
// //     console.log('event on sl-tab-change slTabs', event, verticalTabs);
// //     selectVerticalTab(verticalTabs[0]);
// //   })
// // );
//
// // slTabs.forEach(tab => {
// //   tab.onclick = event => {
// //     // selectTab(event.target as Element);
// //     const verticalTabs = currentContent?.querySelectorAll('.ds-tab--vertical');
// //     console.log('event on sl-tab-change slTabs', event, verticalTabs);
// //     // requestAnimationFrame(() => {
// //     //   selectVerticalTab(verticalTabs[0]);
// //     // });
// //     // selectVerticalTab(verticalTabs[0]);
// //   };
// // });
//
// // function selectVerticalTab(verticalTab: Element): void {
// //   console.log('slTabs', slTabs);
// //   // TODO: tabs container parameter
// //   const verticalTabContent = document.querySelector('sl-tab-panel[aria-hidden="false"]') as Element;
// //   console.log('verticalTabContent_verticalTabContent', verticalTabContent);
// //   // if (verticalTabContent.parentElement && verticalTabContent.parentElement.getAttribute('aria-hidden') == 'false') {
// //   currentContent = verticalTabContent;
// //   // }
// //   console.log(
// //     'verticalTab in selectVerticalTab',
// //     verticalTab,
// //     currentVerticalTabsContainer,
// //     currentContent,
// //     verticalTabContent
// //   );
// //   currentVerticalTabsContainer = currentContent.querySelector('.ds-tabs[vertical]')?.firstChild as Element;
// //   console.log('currentVerticalTabsContainer', currentContent, currentVerticalTabsContainer, currentVerticalTabLink);
// //   if (!verticalTab) {
// //     verticalTab = currentVerticalTabsContainer.querySelector('a.ds-tab--vertical') as Element;
// //     console.log('verticalTab in selectVerticalTab in if', !verticalTab, verticalTab, currentVerticalTabsContainer);
// //   }
// //   console.log('currentVerticalTabsContainer in select', currentVerticalTabsContainer);
// //   currentVerticalTabLink?.setAttribute('aria-selected', 'false');
// //   verticalTab.setAttribute('aria-selected', 'true');
// //   currentVerticalTabLink?.setAttribute('tabindex', '-1');
// //   verticalTab.setAttribute('tabindex', '0');
// //
// //   const verticalTabs = currentContent.querySelectorAll('.ds-tab--vertical');
// //   verticalTabs.forEach(v => v.classList.remove('active'));
// //   alignVerticalTabIndicator(verticalTab, currentVerticalTabsContainer);
// //   verticalTab.classList.add('active');
// //   currentVerticalTabLink = verticalTab;
// // }
//
// // function alignVerticalTabIndicator(tab: Element, currentVerticalTabsContainer: Element): void {
// //   console.log('currentVerticalTabsContainer in alignVerticalTabIndicator', currentVerticalTabsContainer);
// //   const currentVerticalSliderElement = currentVerticalTabsContainer.querySelector(
// //     '.ds-tabs__vertical-slider'
// //   ) as HTMLElement;
// //   const currentVerticalIndicatorElement = currentVerticalTabsContainer.querySelector(
// //     '.ds-tabs__vertical-indicator'
// //   ) as HTMLElement;
// //
// //   console.log('currentVerticalIndicatorElement', currentVerticalIndicatorElement);
// //
// //   if (!verticalTabsWrapperAll || !currentVerticalSliderElement || !currentVerticalIndicatorElement) {
// //     return;
// //   }
// //   currentVerticalIndicatorElement.style.top = `${
// //     tab.getBoundingClientRect().top - currentVerticalTabsContainer.getBoundingClientRect().top
// //   }px`;
// //   currentVerticalIndicatorElement.style.height = `${tab.getBoundingClientRect().height}px`;
// // }
//
// function onKeydown(event: KeyboardEvent, vertical = false, verticalTabs?: NodeListOf<Element>): void {
//   console.log(event, vertical, verticalTabs);
//   // if (event.code === 'Space' && vertical) {
//   //   selectVerticalTab(event.target as Element);
//   //   window.scrollTo({ top: (event.target as Element).scrollTop });
//   // }
//   //
//   // const keys = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
//   //
//   // if (!keys.includes(event.key)) {
//   //   return;
//   // }
//   //
//   // if (keys && vertical) {
//   //   event.preventDefault();
//   // }
//   //
//   // const focusedTab = getActiveElement(event.target as Node) as HTMLElement;
//   //
//   // const navTabs = verticalTabs ? (verticalTabs as NodeListOf<HTMLElement>) : tabs;
//   // let index: number = Array.from(navTabs).indexOf(focusedTab);
//   // index += event.key === keys[0] ? -1 : 1;
//   // index = index % navTabs.length;
//   //
//   // const nextTab = navTabs[index];
//   // if (nextTab) {
//   //   nextTab.focus();
//   // }
// }
//
// function onScroll(event: Event): void {
//   console.log('onScroll function event', event);
//   slider.scrollTo({ left: (event.target as HTMLElement).scrollLeft });
//   if (!current || !tabsWrapper) {
//     return;
//   }
//   slider.style.left = `${current.getBoundingClientRect().left - tabsWrapper.getBoundingClientRect().left}px`;
// }
//
// // module.exports = generateVerticalTabs;
