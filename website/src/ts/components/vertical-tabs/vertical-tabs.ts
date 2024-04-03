import { LitElement, CSSResultGroup, PropertyValues, type TemplateResult, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
// import { CSSResultGroup } from 'lit/development';
import { verticalTabsStyles } from './vertical-tabs-style';

@customElement('ds-vertical-tabs')
export class VerticalTabs extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = verticalTabsStyles;

  // @property() package?: string;

  // @property({ attribute: 'link-in-navigation', type: Boolean }) linkInNavigation = false;

  @property() verticalTabContent?: HTMLElement;

  headerAnchorsParentsAll: Array<HTMLElement> = [];

  nextUniqueId = 0;

  observer = new IntersectionObserver(entries => {
    console.log('entries in observer', entries);
    const cards = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
    let entry: IntersectionObserverEntry | undefined;
    if (entries.length > 0) {
      const maxRatio = Math.max(...entries.map(e => e.intersectionRatio));
      entry = entries.find(e => e.intersectionRatio === maxRatio);
    } else {
      entry = entries[0];
    }
    console.log('cards entry.target', cards, entry?.target);
    if ((entry?.intersectionRatio ?? 0) > 0) {
      const card = cards.find(card => entry?.target === card),
        buttons = Array.from(this.renderRoot.querySelectorAll('.ds-tab--vertical')),
        index = buttons.findIndex(b => (b as HTMLElement).dataset.id === card?.id); // TODO: improve this one
      console.log('card buttons index', card, buttons, index);
      const tabBar = this.renderRoot.querySelector('.ds-tabs');
      if (tabBar) {
        // tabBar.selected = index;
        this.#alignVerticalTabIndicator(buttons[index]);
      }
    }
  });

  //   setTimeout(() => {
  //   document.querySelectorAll('dna-card').forEach(card => observer.observe(card));
  // })

  onTabActivate = (
    event: Event & {
      target: HTMLElement;
    }
  ): void => {
    const card = document.getElementById(event.target.dataset.id ?? '') as HTMLElement,
      top = card.offsetTop - 16;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  };

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.parentElement?.querySelectorAll('section').forEach(section => this.observer.observe(section));

    /** generates nav links from parentElement content */
    console.log('verticalTabContent in firstUpdated', this.verticalTabContent, this.parentElement);

    // headerAnchorsParentsAll: Array<HTMLElement | undefined> = [];
    if (this.parentElement) {
      // const headerAnchors = this.verticalTabContent.querySelectorAll('.header-anchor') as NodeListOf<Element>; // , [link-in-navigation]

      const headerAnchors = this.parentElement.querySelectorAll('.header-anchor') as NodeListOf<Element>;

      // console.log('headerAnchors in vertical', headerAnchors);

      const headerAnchorsParents = Array.from(headerAnchors)
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
        .filter(element => element !== undefined) as HTMLElement[];
      this.headerAnchorsParentsAll.push(...headerAnchorsParents);

      console.log('headerAnchors in vertical - parents component', this.headerAnchorsParentsAll);
    }

    const verticalTabs = this.renderRoot.querySelectorAll('.ds-tab--vertical');
    console.log('verticalTabs in firstUpdated', verticalTabs, verticalTabs.length);
    if (verticalTabs.length) {
      // TODO: should work with http://localhost:8000/categories/components/accordion/code/#sl-accordion and scroll to it
      this.#alignVerticalTabIndicator(verticalTabs[0]);
    }
  }

  // TODO: H2 as parameter

  override render(): TemplateResult {
    const headerAnchorsParents = Array.from(
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
      .filter(element => element !== undefined); // as HTMLElement[];
    // this.headerAnchorsParentsAll.push(...(headerAnchorsParents as HTMLElement[]));

    console.log(
      'verticalTabContent in render',
      this.verticalTabContent,
      this.headerAnchorsParentsAll,
      this.parentElement?.querySelectorAll('.header-anchor'),
      headerAnchorsParents
    );
    const test = Array.from(this.parentElement?.querySelectorAll('.header-anchor, [link-in-navigation]') || [])
      .map(element => {
        if (element.parentElement?.tagName === 'H2') {
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
    return html`
      <div vertical="" class="ds-tabs">
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

  /*  ${headerAnchorsParents.map(item => {
  html` <a
    href=${`#${item?.id}`}
                class="ds-tab--vertical active"
                role="tab"
                tabindex="0"
                id=${`ds-vertical-tab-${this.nextUniqueId++}`}
                aria-selected="true"
                aria-controls="when-to-use"
                >${item?.textContent}</a
              >`;
})}
${this.headerAnchorsParentsAll.map(item => {
  html` <a
    href=${`#${item.id}`}
                class="ds-tab--vertical"
                role="tab"
                tabindex="0"
                id=${`ds-vertical-tab-${this.nextUniqueId++}`}
                aria-selected="true"
                aria-controls="when-to-use"
                >${item.textContent}</a
              >`;
})}
            <div>${this.parentElement?.querySelector('.header-anchor')?.textContent}</div>
            ${Array.from(this.parentElement?.querySelectorAll('.header-anchor, [link-in-navigation]') || []).map(
              (variant: Element) => html`<div style="color: #2351db;">${(variant as HTMLElement)?.textContent}</div>`
            )}

                        <a
              href="#when-to-use"
              class="ds-tab--vertical active"
              role="tab"
              tabindex="0"
              id="ds-vertical-tab-4"
              aria-selected="true"
              aria-controls="when-to-use"
              >When to use</a
            ><a
              href="#when-not-to-use"
              class="ds-tab--vertical"
              role="tab"
              tabindex="-1"
              id="ds-vertical-tab-5"
              aria-selected="false"
              aria-controls="when-not-to-use"
              >When not to use</a
            ><a
              href="#anatomy"
              class="ds-tab--vertical"
              role="tab"
              tabindex="-1"
              id="ds-vertical-tab-6"
              aria-selected="false"
              aria-controls="anatomy"
              >Anatomy</a
            ><a
              href="#options"
              class="ds-tab--vertical"
              role="tab"
              tabindex="-1"
              id="ds-vertical-tab-7"
              aria-selected="false"
              aria-controls="options"
              >Options</a
            >

*/

  // TODO: rovingTabIndex

  // TODO: vertical tabs position fixed

  // href=${(variant as HTMLElement).(firstChild as HTMLAnchorElement)?.hash}

  // TODO: onclick select verticaltab

  // TODO: on scroll

  #onClick(event: Event & { target: HTMLElement }): void {
    const verticalTab = event.target;
    console.log('onclick on verticaltab in component', event, event.target);
    const currentVerticalTabLink = this.renderRoot.querySelector('[aria-selected="true"]');

    currentVerticalTabLink?.setAttribute('aria-selected', 'false');
    verticalTab.setAttribute('aria-selected', 'true');
    currentVerticalTabLink?.setAttribute('tabindex', '-1');
    verticalTab.setAttribute('tabindex', '0');

    const verticalTabs = this.renderRoot.querySelectorAll('.ds-tab--vertical');
    verticalTabs.forEach(v => v.classList.remove('active'));
    this.#alignVerticalTabIndicator(verticalTab);
    verticalTab.classList.add('active');
    // currentVerticalTabLink = verticalTab;
  }

  #alignVerticalTabIndicator(tab: Element): void {
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

  // ${this.headerAnchorsParentsAll?.map(variant => html`<div>${variant}</div>`)}

  //   ${[...this.parentElement?.querySelectorAll('.header-anchor')]?.map(
  //   (variant: Element) => html`<div style="color: #2351db;">${(variant as HTMLElement)?.textContent}</div>`
  // )}

  // <h2>
  //   ${this.linkInNavigation
  //     ? html`<a class="header-anchor" href="#installation">Installation</a>`
  //     : html`Installation`}
  // </h2>
  //
  // <p>With npm</p>
  // <ds-code-snippet language="bash"> npm install @sl-design-system/${this.package}</ds-code-snippet>
  //
  // <p>With yarn</p>
  // <ds-code-snippet language="bash"> yarn add @sl-design-system/${this.package}</ds-code-snippet>

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    // if (changes.has('linkInNavigation')) {
    //   if (this.linkInNavigation) {
    //     this.setAttribute('link-in-navigation-text', 'Installation');
    //     this.setAttribute('id', 'installation');
    //   }
    // }
  }

  // static override styles = css`
  //   :host {
  //     display: block;
  //     font: var(--typography-body);
  //   }
  //
  //   h2 {
  //     font: var(--typography-h2);
  //     margin-block: var(--typography-h2-margin-block);
  //   }
  //
  //   a.header-anchor {
  //     color: inherit;
  //     font-size: inherit;
  //     text-decoration: none;
  //   }
  //
  //   .ds-tabs-wrapper {
  //     column-gap: 0.4rem;
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: flex-start;
  //     overflow-x: scroll;
  //     padding-inline-start: 0;
  //     scrollbar-width: none;
  //   }
  //
  //   .ds-tab--vertical.active:not(:focus-visible) {
  //     color: var(--highlight-color);
  //   }
  // `;
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-vertical-tabs': VerticalTabs;
  }
}
