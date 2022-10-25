const tabsContainer = document.querySelector('.tabs-wrapper');
const tabs = tabsContainer?.querySelectorAll('.tablink');

for (let i = 0; i < tabs?.length; i++) {
  tabs[i]?.addEventListener('click', function () {
    if (!tabsContainer) {
      return;
    }

    const current = tabsContainer?.querySelectorAll('.active');
    current[0].className = current[0].className.replace(' active', '');
    this.className += ' active';
  });
}
