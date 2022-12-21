const tabsContainer = document.querySelector('.ds-tabs');
const tabsWrapper = document.querySelector('.ds-tabs-wrapper');
const tabs: NodeListOf<HTMLElement> = document.querySelectorAll('.ds-tab');
const slider = tabsContainer?.querySelector('.slider') as HTMLElement;
const indicator = slider?.querySelector('.indicator') as HTMLElement;
let current = tabsWrapper?.querySelector('.active');

window.onload = () => {
  if (!tabsWrapper || !current) {
    return;
  }
  // const current = tabsWrapper.querySelectorAll('.active');
  selectTab(current);
};

window.onresize = () => {
  if (!tabsWrapper || !current) {
    return;
  }
  // const current = tabsWrapper.querySelectorAll('.active');
  selectTab(current);
};

tabs?.forEach(tab => {
  tab.onclick = (event: MouseEvent) => {
    selectTab(event.target as Element);
  };
});

function selectTab(tab: Element): void {
  console.log('event tab', tab);
  if (!tabs) {
    return;
  }

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
    //});
  }
}

function alignTabIndicator(tab: Element): void {
  if (!tabsWrapper) {
    return;
  }

  slider.style.left = `${tab.getBoundingClientRect().left - tabsWrapper.getBoundingClientRect().left}px`; //`calc(calc(100% / 4) * ${i})`;
  indicator.style.width = `${tab.getBoundingClientRect().width}px`;
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
