import type { PropertyValues, TemplateResult } from 'lit';
// import type { EventEmitter } from '../common/index.js';
import type { TabButton } from './tab-button.js';
import type { EventEmitter } from '@sanomalearning/slds-core/utils/decorators';
import { event } from '@sanomalearning/slds-core/utils/decorators';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { getActiveElement } from '../../utils/active-element.js';
// import { getActiveElement, listen } from '../common/index.js';

/**
 * Tab bar component for the tab buttons. Can be used as part of `<dna-tabs> or standalone.
 *
 * @fires tabBarSelected - Emits when the user selected a different tab
 * @slot default - The tab buttons
 */
export class TabBar extends ScopedElementsMixin(LitElement) {
  /** @private */
  // static get scopedElements(): ScopedElementsMap {
  //   return {
  //     'dna-icon': Icon,
  //     'dna-icon-definition': IconDefinition
  //   };
  // }

  /** @private */
  // static styles: CSSResultGroup = styles;

  static override styles = css`
    :host {
      --background: white; //var(--dna-background-hsl);
      --border: var(--border-width) solid var(--dna-control-foreground);
      --border-width: 1px;
      --indicator-color: var(--dna-primary);
      --indicator-size: 4px;
      --indicator-transition: var(--dna-transition-normal, 0.2s ease-in-out);
      --margin: 4px;
      --spacing: 2px;
    }

    :host {
      display: block;
      position: relative;
      background-color: grey;
    }

    :host {
      border-bottom: var(--border);
      overflow: hidden;

      .wrapper {
        margin: 0 calc(-1 * var(--margin)) calc(-1 * var(--border-width)) calc(-1 * var(--margin));
        overflow-x: scroll;
        padding: var(--margin) 0 calc(var(--spacing) + var(--indicator-size));
        scrollbar-width: none;
      }

      .inner {
        align-items: center;
        padding: 0 var(--margin);
        width: max-content;
        flex-direction: row;
      }

      .indicator {
        height: var(--indicator-size);
        inset: auto auto 0 0;
        transform-origin: center left;
        width: 1px;
      }
    }

    :host([orientation='vertical']) {
      display: flex;
      flex-direction: column;

      .fade {
        display: none;
      }

      .wrapper {
        display: flex;
        flex-direction: column;
        margin-left: var(--indicator-size);
      }

      // .inner {
      //   align-items: stretch;
      //   flex-direction: column;
      // }

      .indicator {
        height: 1px;
        inset: 0 auto auto 0;
        transform-origin: center top;
        width: var(--indicator-size);
      }

      ::slotted(dna-tab-button) {
        justify-content: start;
      }
    }

    :host([scroll-left]) .fade-left,
    :host([scroll-right]) .fade-right {
      visibility: visible;
    }

    .fade {
      align-items: center;
      display: flex;
      padding: 0.625rem 0.5rem;
      pointer-events: none;
      position: absolute;
      top: var(--margin);
      visibility: hidden;
      width: 100px;
      z-index: 1;
    }

    .fade-left {
      background: linear-gradient(270deg, hsla(var(--background), 0), hsla(var(--background), 1));
      justify-content: flex-start;
      left: calc(-1 * var(--margin) + var(--padding, 0px));
    }

    .fade-right {
      background: linear-gradient(90deg, hsla(var(--background), 0), hsla(var(--background), 1));
      justify-content: flex-end;
      right: calc(-1 * var(--margin) + var(--padding, 0px));
    }

    .wrapper {
      display: block;
      position: relative;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .inner {
      display: flex;
    }

    .indicator {
      background: red; //var(--indicator-color);
      position: absolute;
      transition: transform var(--indicator-transition);
      z-index: 1;
    }
  `;

  /** Observer to get notified when the tab-bar is visible. */
  #observer?: IntersectionObserver;

  /** Whether the selection indicator should animate on the next run. */
  #shouldAnimate = false;

  /** Slotted tab buttons. */
  #tabButtons: TabButton[] = [];

  #tabChangePromise = Promise.resolve();
  #tabChangeResolver: () => void = function () {
    return;
  };

  /** Emits when the selected tab changes. */
  @event() private tabBarSelected!: EventEmitter<number>;

  /** The label of the tablist. */
  @property() label?: string;

  /** The selected tab index. */
  @property({ type: Number }) selected = -1;

  get focusElement(): TabButton {
    const focusElement = this.#tabButtons.find(tab => tab.selected);

    return focusElement ?? this.#tabButtons[0];
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('keydown', this.onKeydown);
    this.addEventListener('resize', this.onScroll);
    // this.addEventListener('tabActivate', this.onTabActivate);

    /**
     * We use an IntersectionObserver to get notified when the tab-bar becomes visible.
     * When the tab-bar is initially invisible, the tab indicator size cannot be calculated
     * because the tab buttons have 0 width & height. So when the tab-bar becomes visible,
     * recalculate the tab indicator position & size.
     */
    this.#observer = new IntersectionObserver(() => this.#updateSelectionIndicator());
    this.#observer.observe(this);
  }

  override disconnectedCallback(): void {
    if (this.#observer) {
      this.#observer.disconnect();
      this.#observer = undefined;
    }

    this.removeEventListener('keydown', this.onKeydown);
    this.removeEventListener('resize', this.onScroll);

    super.disconnectedCallback();
  }

  override async getUpdateComplete(): Promise<boolean> {
    await super.getUpdateComplete();
    await this.#tabChangePromise;

    return true;
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    // Only set the slot if the parent element is `<dna-tabs>`, otherwise
    // we may break any other parent with slots (`<dna-sticky>`)
    if (this.parentElement?.tagName === 'DNA-TABS') {
      this.slot = 'tab-bar';
    }

    this.setAttribute('role', 'tablist');

    setTimeout(() => this.onScroll());
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('label')) {
      if (this.label) {
        this.setAttribute('aria-label', this.label);
      } else {
        this.removeAttribute('aria-label');
      }
    }

    // if (changes.has('orientation')) {
    //   this.#shouldAnimate = false;
    //   this.#updateSelectionIndicator();
    //   this.#shouldAnimate = true;
    // }

    if (changes.has('selected')) {
      this.#shouldUpdateSelectedState();
    }
  }

  override render(): TemplateResult {
    return html`
      <!--<div class="fade fade-left">
        <dna-icon name="far-angle-left"></dna-icon>
      </div>-->
      <div @scroll=${this.onScroll} class="wrapper">
        <span class="indicator" role="presentation"></span>
        <div class="inner">
          <slot @slotchange=${this.onSlotchange} @click=${() => console.log('click2')}></slot>
        </div>
      </div>
      <!--<div class="fade fade-right">
        <dna-icon name="far-angle-right"></dna-icon>
      </div>-->
    `;
  }

  onKeydown(event: KeyboardEvent): void {
    const keys = /*this.orientation === 'horizontal' ?*/ ['ArrowLeft', 'ArrowRight']; /*: ['ArrowUp', 'ArrowDown']*/

    if (!keys.includes(event.key)) {
      return;
    }

    const currentFocusedTab = getActiveElement(this) as TabButton,
      buttons = this.#tabButtons; //.filter(button => !button.disabled);

    let index = buttons.indexOf(currentFocusedTab);
    index += event.key === keys[0] ? -1 : 1;
    index = index % this.#tabButtons.length;

    const nextTab = buttons[index];
    if (nextTab) {
      nextTab.focus();
    }
  }

  // @listen('resize', {}, window)
  onScroll(): void {
    setTimeout(() => {
      const wrapper = this.shadowRoot?.querySelector('.wrapper') as HTMLElement,
        { clientWidth, scrollLeft, scrollWidth } = wrapper,
        scrollable = scrollWidth > clientWidth;

      if (scrollable && scrollLeft > 0) {
        this.setAttribute('scroll-left', '');
      } else {
        this.removeAttribute('scroll-left');
      }

      if (scrollable && scrollLeft + clientWidth < scrollWidth) {
        this.setAttribute('scroll-right', '');
      } else {
        this.removeAttribute('scroll-right');
      }
    });
  }

  onSlotchange(): void {
    this.#shouldAnimate = false;
    this.#tabButtons = Array.from(this.querySelectorAll('dna-tab-button'));

    this.selected = this.#tabButtons.findIndex(button => button.selected);
    if (this.selected === -1) {
      this.selected = 0;
    }

    this.#shouldUpdateSelectedState();
  }

  //@listen('tabActivate')
  onTabActivate(event: Event & { target: TabButton }): void {
    this.selected = this.#tabButtons.findIndex(button => button === event.target);
    this.tabBarSelected.emit(this.selected);
  }

  #shouldUpdateSelectedState(): void {
    this.#tabChangeResolver();
    this.#tabChangePromise = new Promise(res => (this.#tabChangeResolver = res));
    setTimeout(() => this.#updateSelectedTab());
  }

  #updateSelectedTab(): void {
    if (!this.#tabButtons.length) {
      this.#tabButtons = Array.from(this.querySelectorAll('[role=tab]'));
    }

    this.#tabButtons.forEach(element => element.removeAttribute('selected'));

    if (this.selected !== -1) {
      const currentSelected = this.#tabButtons.find((_, idx) => idx === this.selected);

      if (currentSelected) {
        currentSelected.selected = true;
      } else {
        this.selected = 0;
      }
    }

    this.#updateSelectionIndicator();
    this.#tabChangeResolver();
  }

  #updateSelectionIndicator(): void {
    if (this.selected === -1 || this.selected >= this.#tabButtons.length) {
      return;
    }

    const axis = 'X',
      indicator = this.shadowRoot?.querySelector('.indicator') as HTMLElement,
      wrapper = this.shadowRoot?.querySelector('.wrapper') as HTMLElement,
      button = this.#tabButtons[this.selected];

    //const axis = 'X', //this.orientation === 'vertical' ? 'Y' : 'X',

    console.log('button', button);

    let start = 0;
    if (axis === 'X') {
      start = button.offsetLeft - wrapper.offsetLeft;
    } else {
      start = button.offsetTop - wrapper.offsetTop;
    }

    // Somehow on Chromium, the offsetParent is different than on FF and Safari
    // If on Chromium, take the `wrapper.offsetLeft` into account as well
    if (button.offsetParent === wrapper) {
      start += axis === 'X' ? wrapper.offsetLeft : wrapper.offsetTop;
    }

    indicator.style.transform = `translate${axis}(${start}px) scale${axis}(${
      axis === 'X' ? button.offsetWidth : button.offsetHeight
    })`;
    indicator.style.transitionDuration = this.#shouldAnimate ? '' : '0s';

    if (axis === 'X') {
      const scrollLeft = Math.max(button.offsetLeft + button.offsetWidth / 2 - wrapper.clientWidth / 2, 0);

      if (scrollLeft !== wrapper.scrollLeft) {
        wrapper.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }

    this.#shouldAnimate = true;
  }
}
