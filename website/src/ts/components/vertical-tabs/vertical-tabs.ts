import { LitElement, CSSResultGroup, PropertyValues, type TemplateResult, html } from 'lit';
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

  observer = new IntersectionObserver(
    entries => {
      let updated = false;
      const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []),
        links = Array.from(this.renderRoot.querySelectorAll('.ds-tab--vertical')) as HTMLElement[];

      entries.forEach(entry => {
        if (updated) {
          return;
        }
        let section: Element | null | undefined;
        if (!entry.isIntersecting) {
          if (this.#isInViewport(entry.target.nextElementSibling)) {
            section = entry.target.nextElementSibling;
          } else if (this.#isInViewport(entry.target.previousElementSibling)) {
            section = entry.target.previousElementSibling;
            while (this.#isInViewport(section?.previousElementSibling)) {
              section = section?.previousElementSibling;
            }
          }
        } else {
          if (!this.#isInViewport(entry.target.nextElementSibling)) {
            return;
          } else if (!this.#isInViewport(entry.target.previousElementSibling)) {
            section = entry.target;
          }
        }

        if (!section) {
          return;
        }

        let index = sections.findIndex(b => {
          return (b as HTMLElement).id.toLowerCase() == (section as HTMLElement).getAttribute('id')?.toLowerCase();
        });

        if (links[index]) {
          this.#setActiveTab(links[index]);
          this.#alignVerticalTabIndicator(links[index]);
        } else if (!section.hasAttribute('id')) {
          this.#setActiveTab(links[0]);
          this.#alignVerticalTabIndicator(links[0]);
        }

        updated = true;
      });
    },
    { rootMargin: '-140px' }
  );

  #isInViewport(section: Element | null | undefined) {
    if (!section) {
      return false;
    }
    const sectionRect = section.getBoundingClientRect();
    return sectionRect.bottom >= 0 && sectionRect.top <= (window.innerHeight || document.documentElement.clientHeight);
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    requestAnimationFrame(() => {
      /** Source to observe - `sections` with `id` elements and `link-in-navigation` with `id` elements */
      const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
      if (sections.length) {
        sections.forEach(section => this.observer.observe(section));
      }
    });

    const verticalTabs = this.renderRoot.querySelectorAll('.ds-tab--vertical');
    if (verticalTabs.length) {
      this.#setActiveTab(verticalTabs[0] as HTMLElement);
    }
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
