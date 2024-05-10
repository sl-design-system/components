import { LitElement, CSSResultGroup, type TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
// import { verticalTabsStyles } from './vertical-tabs-style';
import { componentStatusStyles } from './component-status-style';

export type StatusType = 'planned' | 'draft' | 'preview' | 'new' | 'stable' | 'deprecated';

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

@customElement('ds-component-status')
export class ComponentStatus extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = componentStatusStyles;

  @property() componentName = '';

  @property() status: StatusType = 'planned';

  @property() version = '';

  /** Used to render vertical links content - tagElement is a source of links text, H2 is the default */
  @property() tagElement = 'H2';



  get badgeVariant(): string { // TODO: badgeVariant
    switch (this.status) {
      case 'planned':
        return 'primary';
      case 'draft':
        return 'neutral';
      case 'preview':
        return 'info';
      case 'stable':
        return 'success';
      case 'deprecated':
        return 'danger';
      default:
        return 'primary';
    }
  }

  nextUniqueId = 0;

  // observer = new IntersectionObserver(
  //   entries => {
  //     let updated = false;
  //     const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []),
  //       links = Array.from(this.renderRoot.querySelectorAll('.ds-tab--vertical')) as HTMLElement[];
  //
  //     if (links.length === entries.filter(entry => entry.intersectionRatio === 1).length || (!window.location.hash && entries.length === links.length)) {
  //       return;
  //     }
  //
  //     entries.forEach(entry => {
  //       if (updated) {
  //         return;
  //       }
  //       let section: Element | null | undefined;
  //       if (entry.isIntersecting && entry.intersectionRatio > 0) {
  //         section = entry.target;
  //         let index = sections.findIndex(b => {
  //           return (b as HTMLElement).id.toLowerCase() == (section as HTMLElement).getAttribute('id')?.toLowerCase();
  //         });
  //
  //         if (links[index]) {
  //           this.#setActiveTab(links[index]);
  //           this.#alignVerticalTabIndicator(links[index]);
  //         }
  //       }
  //
  //        updated = true;
  //     });
  //   },
  //   { root: null, rootMargin: '-86px 0px 0px 0px' }
  // );

  override connectedCallback(): void {
    super.connectedCallback();

    // if (isMobileOrTablet()) {
    //   return;
    // }
    //
    //
    // requestAnimationFrame(() => {
    // /** Source to observe - `sections` with `id` elements and `link-in-navigation` with `id` elements */
    // const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []),
    //    verticalTabs = this.renderRoot.querySelectorAll('.ds-tab--vertical');
    //
    //   if (verticalTabs.length && !window.location.hash) {
    //     this.#setActiveTab(verticalTabs[0] as HTMLElement);
    //    window.scrollTo(0, 0);
    //   } else if (window.location.hash) {
    //     setTimeout(() => {
    //       const targetElement = document.querySelector(window.location.hash),
    //             links = Array.from(this.renderRoot.querySelectorAll('.ds-tab--vertical')) as HTMLElement[];
    //       let index = links.findIndex(link => {
    //         return (link as HTMLAnchorElement).hash == window.location.hash;
    //       });
    //       if (targetElement) {
    //         links[index].click();
    //         targetElement.scrollIntoView();
    //       }
    //     }, 100);
    //   }
    //
    // if (sections.length) {
    //  sections.forEach(section => this.observer.observe(section));
    // }
    // });
    //
    // window.addEventListener('hashchange',  () => {
    //   const links = Array.from(this.renderRoot.querySelectorAll('.ds-tab--vertical')) as HTMLElement[];
    //   let index = links.findIndex(link => {
    //     return (link as HTMLAnchorElement).hash == window.location.hash;
    //   });
    //     links[index].click();
    // }, false);
  }

  override disconnectedCallback(): void {
    // this.observer?.disconnect();

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    // /** generates nav links from parentElement content */
    // const links = Array.from(this.parentElement?.querySelectorAll('.header-anchor, [link-in-navigation]') || [])
    //   .map(element => {
    //     if (element.parentElement?.tagName === this.tagElement) {
    //       if (element.parentElement.parentNode) {
    //         (element.parentElement.parentNode as Element).id = element.parentElement.id;
    //       }
    //       return element.parentElement as Element;
    //     } else if (element.hasAttribute('link-in-navigation')) {
    //       return element as Element;
    //     }
    //     return null;
    //   })
    //   .filter(element => element !== null);

    // status: ${this.status}
    //   version: ${this.version}
    //     ${this.componentName}

      console.log('status etc.', 'status:', this.status, 'version:', this.version, this.componentName);

    return html`
      <div class="wrapper">
            <div class="component-info">
              <div class="ds-heading-4 info">
                Status
                <sl-badge size="3xl" variant=${this.badgeVariant}>${this.status}</sl-badge>
              </div>
              <div class="ds-heading-4 info">
                Version
                <span class="link">
                  <a href="https://github.com/sl-design-system/components/releases/tag/%40sl-design-system%2F${this.componentName}%40${this.version}" target="_blank">
                      v${this.version}
                  </a>
                  <sl-icon name="far-arrow-up-right-from-square"></sl-icon>
                </span>
              </div>
              <slot></slot>
            </div>
            <div class="links">
              <sl-button-bar>
                <a class="ds-button" href="https://github.com/sl-design-system/components/blob/main/packages/components/${this.componentName}/CHANGELOG.md" target="_blank">
                  <sl-icon name="github"></sl-icon>
                  View changelog
                </a>
                <a class="ds-button" href="https://github.com/sl-design-system/components/tree/main/packages/components/${this.componentName}" target="_blank">
                  <sl-icon name="github"></sl-icon>
                  View code
                </a>
                <a class="ds-button" href="https://storybook.sanomalearning.design/?path=/story/components-${this.componentName}" target="_blank">
                  <sl-icon name="storybook"></sl-icon>
                  View Storybook
                </a>
              </sl-button-bar>
            </div>
      </div>
    `;
  } // TODO: badge  variant depending on status type
  // TODO: aria-hidden or label to sl-icon?


// <sl-button fill="outline" size="lg"><sl-icon name="github"></sl-icon>View changelog</sl-button>
// <sl-button fill="outline" size="lg"><sl-icon name="github"></sl-icon>View code</sl-button>
// <sl-button fill="outline" size="lg"><sl-icon name="storybook"></sl-icon>View Storybook</sl-button>
// <a href="https://github.com/sl-design-system/components/blob/main/packages/components/${this.componentName}/CHANGELOG.md" target="_blank">
//     view changelog
//   </a>
// <a href="https://github.com/sl-design-system/components/tree/main/packages/components/${this.componentName}" target="_blank">
//     view code
//   </a>
// <a href="https://storybook.sanomalearning.design/?path=/story/components-${this.componentName}" target="_blank">
//     view storybook
//   </a>


  // #onClick(event: Event) {
  //   this.observer?.disconnect();
  //
  //   const link = event.target as HTMLElement;
  //
  //   this.#setActiveTab(link);
  //   this.#alignVerticalTabIndicator(link);
  //
  //   const indicator = this.renderRoot.querySelector('.ds-tabs__vertical-indicator');
  //   indicator?.addEventListener(
  //     'transitionend',
  //     () => {
  //       setTimeout(() => {
  //         /** Source to observe - `sections` with `id` elements and `link-in-navigation` with `id` elements */
  //       const sections = Array.from(this.parentElement?.querySelectorAll('section[id], [link-in-navigation][id]') || []);
  //       if (sections.length) {
  //        sections.forEach(section => this.observer.observe(section));
  //       }
  //       }, 500);
  //     })
  // }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-component-status': ComponentStatus;
  }
}
