import { LitElement, CSSResultGroup, type TemplateResult, html } from 'lit';
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

const isMobileOrTablet = (): boolean => matchMedia('(width < 1200px)').matches;

@customElement('ds-vertical-tabs')
export class VerticalTabs extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = verticalTabsStyles;

  /** Used to render vertical links content - tagElement is a source of links text, H2 is the default */
  @property() tagElement = 'H2';

  nextUniqueId = 0;

  observer = new IntersectionObserver(
    entries => {
      let updated = false;
      const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []),
        links = Array.from(this.renderRoot.querySelectorAll('.ds-tab--vertical')) as HTMLElement[];

      if (links.length === entries.filter(entry => entry.intersectionRatio === 1).length || (!window.location.hash && entries.length === links.length)) {
        return;
      }

      entries.forEach(entry => {
        if (updated) {
          return;
        }
        let section: Element | null | undefined;
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          section = entry.target;
          let index = sections.findIndex(b => {
            return (b as HTMLElement).id.toLowerCase() == (section as HTMLElement).getAttribute('id')?.toLowerCase();
          });

          if (links[index]) {
            this.#setActiveTab(links[index]);
            this.#alignVerticalTabIndicator(links[index]);
          }
        }

         updated = true;
      });
    },
    { root: null, rootMargin: '-86px 0px 0px 0px' }
  );

  override connectedCallback(): void {
    super.connectedCallback();

    if (isMobileOrTablet()) {
      return;
    }


    requestAnimationFrame(() => {
    /** Source to observe - `sections` with `id` elements and `link-in-navigation` with `id` elements */
    const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
      const verticalTabs = this.renderRoot.querySelectorAll('.ds-tab--vertical');
      console.log('verticalTabs', verticalTabs);
      if (verticalTabs.length && !window.location.hash) {
        this.#setActiveTab(verticalTabs[0] as HTMLElement);
       window.scrollTo(0, 0);
      } else if (window.location.hash) {
        setTimeout(() => {
          const targetElement = document.querySelector(window.location.hash),
                links = Array.from(this.renderRoot.querySelectorAll('.ds-tab--vertical')) as HTMLElement[];
          let index = links.findIndex(link => {
            return (link as HTMLAnchorElement).hash == window.location.hash;
          });
          if (targetElement) {
            links[index].click();
            targetElement.scrollIntoView();
          }
        }, 100);
      }

    if (sections.length) {
     sections.forEach(section => this.observer.observe(section));
    }
    });

    window.addEventListener('hashchange',  () => {
      console.log('onhashchange', window.location.hash);
      const links = Array.from(this.renderRoot.querySelectorAll('.ds-tab--vertical')) as HTMLElement[];
      let index = links.findIndex(link => {
        return (link as HTMLAnchorElement).hash == window.location.hash;
      });
        links[index].click();
    }, false);
  }

  override disconnectedCallback(): void {
    this.observer?.disconnect();

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    /** generates nav links from parentElement content */
    const links = Array.from(this.parentElement?.querySelectorAll('.header-anchor, [link-in-navigation]') || [])
      .map(element => {
        if (element.parentElement?.tagName === this.tagElement) {
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

    return html`
      <div vertical class="ds-tabs">
        <div class="ds-tabs__container">
          <div class="ds-tabs-wrapper" role="tablist" aria-orientation="vertical">
            ${links.map(
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
  }

  #onClick(event: Event) {
    console.log(event);
    this.observer?.disconnect();

    const link = event.target as HTMLElement;

    this.#setActiveTab(link);
    this.#alignVerticalTabIndicator(link);

    const indicator = this.renderRoot.querySelector('.ds-tabs__vertical-indicator');
    indicator?.addEventListener(
      'transitionend',
      () => {
        setTimeout(() => {
          /** Source to observe - `sections` with `id` elements and `link-in-navigation` with `id` elements */
        const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
        if (sections.length) {
         sections.forEach(section => this.observer.observe(section));
        }
        }, 500);
      })
  }

  #setActiveTab(verticalTab: HTMLElement): void {
    const currentVerticalTabLink = this.renderRoot.querySelector('[aria-selected="true"]'),
      verticalTabs = this.renderRoot.querySelectorAll('.ds-tab--vertical');

    currentVerticalTabLink?.setAttribute('aria-selected', 'false');
    verticalTab.setAttribute('aria-selected', 'true');

    verticalTabs.forEach(v => v.classList.remove('active'));
    verticalTab.classList.add('active');
  }

  #alignVerticalTabIndicator(tab: Element): void {
    const currentVerticalIndicatorElement = this.renderRoot.querySelector(
        '.ds-tabs__vertical-indicator'
      ) as HTMLElement,
      tabsWrapper = this.renderRoot.querySelector('.ds-tabs-wrapper');

    if (!currentVerticalIndicatorElement || !tabsWrapper) {
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
