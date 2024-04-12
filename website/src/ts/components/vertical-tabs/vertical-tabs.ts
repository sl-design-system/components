import { LitElement, CSSResultGroup, PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { verticalTabsStyles } from './vertical-tabs-style';

/**
 * Vertical tabs are getting parentElement as a source of tabs - `sections` with `h2` elements or `link-in-navigation` with `h2` elements.
 *
 * Example:
 *
 * <div>
 *   <section>
 *     <h2>First</h2>
 *     My first content
 *   </section>
 *   <section>
 *     <h2>Second</h2>
 *     My second content
 *   </section>
 *   <ds-vertical-tabs></ds-vertical-tabs>
 * </div>
 * */

@customElement('ds-vertical-tabs')
export class VerticalTabs extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = verticalTabsStyles;

  /** Used to render vertical links content - tagElement is a source of links text, H2 is the default */
  @property() tagElement = 'H2';

  nextUniqueId = 0;

  observer = new IntersectionObserver(entries => {
    console.log('entries in observer', entries);
    /** source to observe*/
    const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
    let entry: IntersectionObserverEntry | undefined;
    if (entries.length > 0) {
      const maxRatio = Math.max(...entries.map(e => e.intersectionRatio));
      entry = entries.find(e => e.intersectionRatio === maxRatio);
    } else {
      entry = entries[0];
    }
    console.log('cards entry.target', sections, entry?.target);
    if ((entry?.intersectionRatio ?? 0) > 0) {
      const card = sections.find(card => entry?.target === card),
        links = Array.from(this.renderRoot.querySelectorAll('.ds-tab--vertical')) as HTMLElement[],
        // index = cards.findIndex(b => {
        //   return (b as HTMLElement).id.toLowerCase() == (card as HTMLElement).getAttribute('id')?.toLowerCase();
        // }),
        index = sections.findIndex(b => {
          return (b as HTMLElement).id.toLowerCase() == (card as HTMLElement).getAttribute('id')?.toLowerCase();
        }),
        tab = links.find(b => (b as HTMLAnchorElement).hash === `#${card?.id.toLowerCase()}`) as HTMLElement; // TODO: improve this one

      console.log(
        'card buttons index links',
        sections.findIndex(b => {
          return (b as HTMLElement).id.toLowerCase() == (card as HTMLElement).getAttribute('id')?.toLowerCase();
        }),
        links.findIndex(el => el.id === (card as HTMLElement).getAttribute('id')),
        Array.from(this.renderRoot.querySelectorAll('.ds-tab--vertical') ?? []).indexOf(card as Element),
        (card as HTMLElement).getAttribute('id'),
        sections,
        card,
        links,
        index,
        (links[0] as HTMLElement).innerText,
        card?.id,
        entry?.target,
        links[index],
        tab,
        index,
        'links index:::',
        links[index]
      );

      // TODO: change cards and buttons and remove tab???

      if (links[index]) {
        console.log('buttons[index]', links[index]);
        this.#setActiveTab(links[index]);
      }
    }
  });
  // ,
  // { root: this.parentElement, rootMargin: '-44px' }

  // TODO: on scroll active tabs needs to be changed

  // , threshold: [0, 0.25, 0.5, 1]

  //   setTimeout(() => {
  //   document.querySelectorAll('dna-card').forEach(card => observer.observe(card));
  // })

  onTabActivate = (target: HTMLElement): void => {
    console.log('event.target on tabactivate-111111', target);
    const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
    const linked = target.getAttribute('aria-controls');
    const card = sections.find(card => card.id === linked),
      top = card === sections[0] ? 0 : (card as HTMLElement).offsetTop - 44; //(card as HTMLElement).getBoundingClientRect().top; //(card as HTMLElement).offsetTop - 44; // - 265;
    console.log(
      'event.target on tabactivate',
      target,
      card,
      (card as HTMLElement).offsetTop,
      (card as HTMLElement).getBoundingClientRect().top,
      (card as HTMLElement).getBoundingClientRect().y,
      card === sections[0]
    );
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  };

  // TODO: on tab activated not scroll to bottom?

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    console.log('changes in firstUpdated', changes, this.tagElement);

    // setTimeout(() => {
    //   this.parentElement?.querySelectorAll('section').forEach(section => this.observer.observe(section));
    // });

    /** generates nav links from parentElement content */
    //  console.log('verticalTabContent in firstUpdated', this.verticalTabContent, this.parentElement);

    // headerAnchorsParentsAll: Array<HTMLElement | undefined> = [];
    if (this.parentElement) {
      // const headerAnchors = this.verticalTabContent.querySelectorAll('.header-anchor') as NodeListOf<Element>; // , [link-in-navigation]
      //const headerAnchors = this.parentElement.querySelectorAll('.header-anchor') as NodeListOf<Element>;
      // console.log('headerAnchors in vertical', headerAnchors);
      // const headerAnchorsParents = Array.from(headerAnchors)
      //   .map(element => {
      //     if (element.parentElement?.tagName === 'H2') {
      //       console.log('element h2?', element);
      //       if (element.parentElement.parentNode) {
      //         (element.parentElement.parentNode as Element).id = `${element.parentElement.id}-section`;
      //       }
      //       return element.parentElement;
      //     } else if (element.hasAttribute('link-in-navigation')) {
      //       return element as HTMLElement;
      //     }
      //     return;
      //   })
      //   .filter(element => element !== undefined) as HTMLElement[];
      // this.headerAnchorsParentsAll.push(...headerAnchorsParents);
      //
      // console.log('headerAnchors in vertical - parents component', this.headerAnchorsParentsAll);
      // window.scrollTo({
      //   top: 0,
      //   behavior: 'smooth'
      // });
    }

    requestAnimationFrame(() => {
      // const currentContent = document.parentElement.getAttribute('aria-hidden') == 'false';
      const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
      console.log('sections in firstupdated', sections, this.parentElement);
      // if (sections.length) {
      sections.forEach(section => this.observer.observe(section));
      // }
    });

    const verticalTabs = this.renderRoot.querySelectorAll('.ds-tab--vertical');
    console.log('verticalTabs in firstUpdated', verticalTabs, verticalTabs.length);
    if (verticalTabs.length) {
      // TODO: should work with http://localhost:8000/categories/components/accordion/code/#sl-accordion and scroll to it
      // this.#alignVerticalTabIndicator(verticalTabs[0]);
      this.#setActiveTab(verticalTabs[0] as HTMLElement);
    }

    // window.scrollTo({
    //   top: 0,
    //   behavior: 'smooth'
    // });
  }

  override disconnectedCallback(): void {
    this.observer?.disconnect();

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    /*    const headerAnchorsParents = Array.from(
      this.parentElement?.querySelectorAll('.header-anchor, [link-in-navigation]') || []
    )
      .map(element => {
        if (element.parentElement?.tagName === 'H2') {
          console.log('element h2?', element);
          if (element.parentElement.parentNode) {
            (element.parentElement.parentNode as Element).id = element.parentElement.id;
          }
          return element.parentElement;
        } else if (element.hasAttribute('link-in-navigation')) {
          return element as HTMLElement;
        }
        return;
      })
      .filter(element => element !== undefined); // as HTMLElement[];*/
    // this.headerAnchorsParentsAll.push(...(headerAnchorsParents as HTMLElement[]));

    // console.log(
    //   'verticalTabContent in render',
    //   // this.verticalTabContent,
    //   this.headerAnchorsParentsAll,
    //   this.parentElement?.querySelectorAll('.header-anchor'),
    //   headerAnchorsParents
    // );
    const test = Array.from(this.parentElement?.querySelectorAll('.header-anchor, [link-in-navigation]') || [])
      .map(element => {
        if (element.parentElement?.tagName === this.tagElement) {
          console.log('element h2?', element);
          if (element.parentElement.parentNode) {
            (element.parentElement.parentNode as Element).id = element.parentElement.id;
          }
          return element.parentElement as Element;
        } else if (element.hasAttribute('link-in-navigation')) {
          return element as Element;
        }
        return null;
      })
      .filter(element => element !== null);
    console.log('test in render', test);

    // window.scrollTo({
    //   top: 0,
    //   behavior: 'smooth'
    // });

    return html`
      <div vertical class="ds-tabs">
        <div class="ds-tabs__container">
          <div class="ds-tabs-wrapper" role="tablist" aria-orientation="vertical">
            ${test.map(
              (variant: Element | null) =>
                html` <a
                  href=${`#${variant?.id}`}
                  class="ds-tab--vertical"
                  role="tab"
                  tabindex="0"
                  id=${`ds-vertical-tab-${this.nextUniqueId++}`}
                  aria-selected="false"
                  aria-controls=${(variant as HTMLElement)?.id}
                  @click=${this.#onClick}
                  >${(variant as HTMLElement)?.textContent || variant?.getAttribute('link-in-navigation-text')}</a
                >`
            )}
          </div>
          <div class="ds-tabs__vertical-slider">
            <div class="ds-tabs__vertical-indicator"></div>
          </div>
        </div>
      </div>
    `;
  } // style="top: 23px; height: 32px;"

  // TODO: vertical tabs position fixed

  // href=${(variant as HTMLElement).(firstChild as HTMLAnchorElement)?.hash}

  #onClick(event: Event & { target: HTMLElement }): void {
    const verticalTab = event.target;
    console.log('onclick on verticaltab in component', event, event.target);
    this.#setActiveTab(verticalTab);

    // setTimeout(() => {
    //  this.onTabActivate(verticalTab as HTMLElement);
    // });
    /*    const currentVerticalTabLink = this.renderRoot.querySelector('[aria-selected="true"]');

    currentVerticalTabLink?.setAttribute('aria-selected', 'false');
    verticalTab.setAttribute('aria-selected', 'true');
    currentVerticalTabLink?.setAttribute('tabindex', '-1');
    verticalTab.setAttribute('tabindex', '0');

    const verticalTabs = this.renderRoot.querySelectorAll('.ds-tab--vertical');
    verticalTabs.forEach(v => v.classList.remove('active'));
    this.#alignVerticalTabIndicator(verticalTab);
    verticalTab.classList.add('active');
    // currentVerticalTabLink = verticalTab;*/
  }

  #setActiveTab(verticalTab: HTMLElement): void {
    const currentVerticalTabLink = this.renderRoot.querySelector('[aria-selected="true"]');
    console.log('currentVerticalTabLink', currentVerticalTabLink);

    currentVerticalTabLink?.setAttribute('aria-selected', 'false');
    verticalTab.setAttribute('aria-selected', 'true');
    // currentVerticalTabLink?.setAttribute('tabindex', '-1');
    // verticalTab.setAttribute('tabindex', '0');

    const verticalTabs = this.renderRoot.querySelectorAll('.ds-tab--vertical');
    verticalTabs.forEach(v => v.classList.remove('active'));
    verticalTab.classList.add('active');
    //setTimeout(() => {
    this.#alignVerticalTabIndicator(verticalTab, !!currentVerticalTabLink);
    //}, 300);
    // currentVerticalTabLink = verticalTab;
  }

  #alignVerticalTabIndicator(tab: Element, scroll = true): void {
    console.log('scroll?', scroll);
    // console.log('currentVerticalTabsContainer in alignVerticalTabIndicator', currentVerticalTabsContainer);
    const currentVerticalSliderElement = this.renderRoot.querySelector('.ds-tabs__vertical-slider') as HTMLElement;
    const currentVerticalIndicatorElement = this.renderRoot.querySelector(
      '.ds-tabs__vertical-indicator'
    ) as HTMLElement;
    const tabsWrapper = this.renderRoot.querySelector('.ds-tabs-wrapper');

    console.log(
      'currentVerticalIndicatorElement',
      currentVerticalIndicatorElement,
      tab.getBoundingClientRect().top,
      this.renderRoot.querySelector('.ds-tabs-wrapper')?.getBoundingClientRect().top
    );

    if (!currentVerticalSliderElement || !currentVerticalIndicatorElement || !tabsWrapper) {
      return;
    }
    currentVerticalIndicatorElement.style.top = `${
      tab.getBoundingClientRect().top - tabsWrapper.getBoundingClientRect().top
    }px`;
    currentVerticalIndicatorElement.style.height = `${tab.getBoundingClientRect().height}px`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-vertical-tabs': VerticalTabs;
  }
}

// TODO: problem with intersection bserver entries running when click on vertical tab
