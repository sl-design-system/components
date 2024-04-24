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

 // updated = false;

  observer = new IntersectionObserver(
    entries => {
      let updated = false;
      const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []),
        links = Array.from(this.renderRoot.querySelectorAll('.ds-tab--vertical')) as HTMLElement[];

      console.log('sections', sections, window.location.hash, window.location);
      // entries.length
      // entries.filter(entry => entry.isIntersecting).length
      console.log('length', entries, entries.length, entries.filter(entry => entry.intersectionRatio === 1).length);

      if (links.length === entries.filter(entry => entry.intersectionRatio === 1).length || (!window.location.hash && entries.length === links.length)) {
        console.log('observer return');
        // const verticalTabs = this.renderRoot.querySelectorAll('.ds-tab--vertical');
        // if (verticalTabs.length) {
        //   this.#setActiveTab(verticalTabs[0] as HTMLElement);
        // }
        return;
      }

/*      let entry: IntersectionObserverEntry | undefined;
      console.log('entries', entries);
      if (entries.length > 0) {
        const maxRatio = Math.max(...entries.map(e => e.intersectionRatio));
        entry = entries.find(e => e.intersectionRatio === maxRatio);
      } else {
        entry = entries[0];
      }

      if ((entry?.intersectionRatio ?? 0) > 0) {
        if (!entry) {
          return;
        }
        let section: Element | null | undefined;
        if (!entry.isIntersecting) {
          // if (this.#isInViewport(entry.target.nextElementSibling)) {
          //   section = entry.target.nextElementSibling;
          // } else if (this.#isInViewport(entry.target.previousElementSibling)) {
          //   section = entry.target.previousElementSibling;
          //   while (this.#isInViewport(section?.previousElementSibling)) {
          //     section = section?.previousElementSibling;
          //   }
          // }
        } else if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          section = entry.target;
          let index = sections.findIndex(b => {
            return (b as HTMLElement).id.toLowerCase() == (section as HTMLElement).getAttribute('id')?.toLowerCase();
          });

          if (links[index]) {
            console.log('links[index]', links[index]);
            links[index].click();
            // this.#setActiveTab(links[index]);
            // this.#alignVerticalTabIndicator(links[index]);
          } /!*else if (!section.hasAttribute('id')) {
              this.#setActiveTab(links[0]);
              this.#alignVerticalTabIndicator(links[0]);
            }*!/
          // if (!this.#isInViewport(entry.target.nextElementSibling)) {
          //   return;
          // } else if (!this.#isInViewport(entry.target.previousElementSibling)) {
          //   section = entry.target;
          // }
        }

        // if (!section) {
        //   return;
        // }
        //
        // let index = sections.findIndex(b => {
        //   return (b as HTMLElement).id.toLowerCase() == (section as HTMLElement).getAttribute('id')?.toLowerCase();
        // });
        //
        // if (links[index]) {
        //   this.#setActiveTab(links[index]);
        //   this.#alignVerticalTabIndicator(links[index]);
        // } else if (!section.hasAttribute('id')) {
        //   this.#setActiveTab(links[0]);
        //   this.#alignVerticalTabIndicator(links[0]);
        // }

       // updated = true;
      }*/

      entries.forEach(entry => {
        console.log('entry', entry, updated, entry.isIntersecting, entry.rootBounds);
        console.log('updated', updated, window.location.hash, entry.target.id, window.location.hash.includes(entry.target.id));
        if (updated /*|| !window.location.hash.includes(entry.target.id)*/) {
          return;
        }
        let section: Element | null | undefined;
        if (!entry.isIntersecting) {
          // if (this.#isInViewport(entry.target.nextElementSibling)) {
          //   section = entry.target.nextElementSibling;
          // } else if (this.#isInViewport(entry.target.previousElementSibling)) {
          //   section = entry.target.previousElementSibling;
          //   while (this.#isInViewport(section?.previousElementSibling)) {
          //     section = section?.previousElementSibling;
          //   }
          // }
        } else if (entry.isIntersecting && entry.intersectionRatio > 0) { // entry.intersectionRatio > 0.1
          section = entry.target;
          let index = sections.findIndex(b => {
            return (b as HTMLElement).id.toLowerCase() == (section as HTMLElement).getAttribute('id')?.toLowerCase();
          });

          if (index === 0) {
            // first item
          }

          if (links[index]) {
            console.log('links[index]', links[index]);
            links[index].click();
            // updated = true;
            // this.#setActiveTab(links[index]);
            // this.#alignVerticalTabIndicator(links[index]);
          } /*else if (!section.hasAttribute('id')) {
              this.#setActiveTab(links[0]);
              this.#alignVerticalTabIndicator(links[0]);
            }*/
          // if (!this.#isInViewport(entry.target.nextElementSibling)) {
          //   return;
          // } else if (!this.#isInViewport(entry.target.previousElementSibling)) {
          //   section = entry.target;
          // }
        }

        // if (!section) {
        //   return;
        // }
        //
        // let index = sections.findIndex(b => {
        //   return (b as HTMLElement).id.toLowerCase() == (section as HTMLElement).getAttribute('id')?.toLowerCase();
        // });
        //
        // if (links[index]) {
        //   this.#setActiveTab(links[index]);
        //   this.#alignVerticalTabIndicator(links[index]);
        // } else if (!section.hasAttribute('id')) {
        //   this.#setActiveTab(links[0]);
        //   this.#alignVerticalTabIndicator(links[0]);
        // }

        updated = true;
      });
    },
    { root: null, rootMargin: '-86px 0px 0px 0px' }
  ); // , threshold: 0.1

  #isInViewport(section: Element | null | undefined) {
    const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
    console.log('sections.find(el => el == section)', section, sections.find(el => el == section));

   const isObserved = sections.find(el => el == section);

   console.log('isObserved', isObserved);

    if (!section /*|| !isObserved*/) {
      return false;
    }
    const sectionRect = section.getBoundingClientRect();
    console.log('sectionRect', sectionRect, sectionRect.bottom, sectionRect.top, window.innerHeight, document.documentElement.clientHeight );
    // return sectionRect.bottom >= 0 && sectionRect.top <= (window.innerHeight || document.documentElement.clientHeight);
    return true;
  }

  override connectedCallback(): void {
    super.connectedCallback();


    requestAnimationFrame(() => {
    /** Source to observe - `sections` with `id` elements and `link-in-navigation` with `id` elements */
    const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
    console.log('sections to observe', sections);
      const verticalTabs = this.renderRoot.querySelectorAll('.ds-tab--vertical');
      if (verticalTabs.length /*&& !window.location.hash*/) {
        this.#setActiveTab(verticalTabs[0] as HTMLElement);
        window.scrollTo(0, 0);
      }

    if (sections.length) {
      sections.forEach(section => this.observer.observe(section));
    }
    });

    // const verticalTabs = this.renderRoot.querySelectorAll('.ds-tab--vertical');
    // if (verticalTabs.length) {
    //   this.#setActiveTab(verticalTabs[0] as HTMLElement);
    // }

    let timeout: NodeJS.Timeout;

    window.addEventListener('hashchange',  (e) => {
      const links = Array.from(this.renderRoot.querySelectorAll('.ds-tab--vertical')) as HTMLElement[];
      let index = links.findIndex(link => {
        return (link as HTMLAnchorElement).hash == window.location.hash;
      });
      const articleToShow =
        document.querySelector(window.location.hash) ||
        document.querySelector('article');
      console.log('articleToShow', articleToShow, e, links, window.location.hash, index);
      clearTimeout(timeout);
      timeout =
      setTimeout(() => {
        links[index].click();
       // articleToShow?.scrollIntoView();

        const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
        if (sections.length) {
          sections.forEach(section => this.observer.observe(section));
        }
      }, 600);
      // e.preventDefault();
    }, false);
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    console.log('first updated?', 'needs to work when scroll starts or onclick');

    // // requestAnimationFrame(() => {
    //   /** Source to observe - `sections` with `id` elements and `link-in-navigation` with `id` elements */
    //   const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
    //   console.log('sections to observe', sections);
    //   if (sections.length) {
    //     sections.forEach(section => this.observer.observe(section));
    //   }
    // // });
    //
    // const verticalTabs = this.renderRoot.querySelectorAll('.ds-tab--vertical');
    // if (verticalTabs.length) {
    //   this.#setActiveTab(verticalTabs[0] as HTMLElement);
    // }
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
            <div class="ds-tabs__vertical-indicator" @transitionend=${this.#onAnimationend}></div>
          </div>
        </div>
      </div>
    `;
  }

  #onClick(event: Event) {
    console.log('event onclick', event, event.target);
  //  event.preventDefault();

    this.observer?.disconnect();
    // this.observer.unobserve()

    const links = Array.from(this.renderRoot.querySelectorAll('.ds-tab--vertical')) as HTMLElement[];
    // let index = sections.findIndex(b => {
    //   return (b as HTMLElement).id.toLowerCase() == (section as HTMLElement).getAttribute('id')?.toLowerCase();
    // });
    const link = event.target as HTMLElement;
    console.log('links link', links.indexOf(link));
    this.#setActiveTab(link);
    this.#alignVerticalTabIndicator(link);
    // if (links.indexOf(link) === 0) {
     // window.scrollTo(0, 0);
    // }

    // requestAnimationFrame(() => {
      /** Source to observe - `sections` with `id` elements and `link-in-navigation` with `id` elements */
      const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
      console.log('sections to observe', sections);
      // if (sections.length) {
      //   sections.forEach(section => this.observer.observe(section));
      // }
    // });

    console.log('indicator', this.renderRoot.querySelector('.ds-tabs__vertical-indicator'));

    const indicator = this.renderRoot.querySelector('.ds-tabs__vertical-indicator');

    indicator?.addEventListener(
      'transitionend',
      () => {
        console.log('indicator onclick animationend');
        // setTimeout(() => {
        // const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
        // if (sections.length) {
        //   sections.forEach(section => this.observer.observe(section));
        // }
        // }, 500);
      })

    this.addEventListener(
      'transitionend',
      () => {
        console.log('onclick animationend');
      })
  }

  #onAnimationend(event: TransitionEvent) {
    console.log('event on animationend', event, event.target);
    // setTimeout(() => {
    //   const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
    //   if (sections.length) {
    //     // sections.forEach(section => this.observer.observe(section));
    //   }
    // }, 500);
  }

  #setActiveTab(verticalTab: HTMLElement): void {
    console.log('verticalTab in setActiveTab', verticalTab);
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
