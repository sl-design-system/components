import type { PropertyValues, TemplateResult } from 'lit';
// import type { EventEmitter } from '../common/index.js';
import type { EventEmitter } from '@sanomalearning/slds-core/utils/decorators';
import { event } from '@sanomalearning/slds-core/utils/decorators';
import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
// import { event } from '../common/index.js';

/** We will generate unique id's for the tabs. */
let nextUniqueId = 0;

export class TabButton extends LitElement {
  /** @private */
  // static styles: CSSResultGroup = styles;

  static override styles = css`
    :host {
      --hue: var(--dna-primary-hue);
      --sat: var(--dna-primary-sat);
      --lum: var(--dna-primary-lum);
      --active: hsla(var(--hue), var(--sat), var(--lum), 0.1);
      --background: transparent;
      --border: 1px solid var(--border-color);
      --border-color: transparent;
      --border-radius: 6px;
      --box-shadow-spread: 3px;
      --box-shadow-color: hsla(var(--hue), var(--sat), calc(var(--lum) - var(--dna-lum-step)), 0.25);
      --color: var(--dna-text-color);
      --padding: 0.375rem 1rem;
      --spacing: 0.5rem;
      --transition: 200ms ease-in-out;
    }

    :host {
      background: lightgrey;
      border: 1px solid grey;
      border-radius: 6px;
      color: black;
      cursor: pointer;
      display: inline-grid;
      flex-shrink: 0;
      grid-auto-flow: column;
      grid-gap: var(--spacing);
      padding: var(--padding);
      transition: var(--transition);
      transition-property: background, box-shadow, color, filter;
      white-space: nowrap;
    }

    :host(:hover) {
      --background: var(--active);
    }

    :host(:focus) {
      outline: none;
    }

    :host(:focus-visible) {
      --border-color: hsl(var(--hue), var(--sat), var(--lum));
      box-shadow: 0 0 0 var(--box-shadow-spread) var(--box-shadow-color);
      outline: none;
      // Add border-color here since having it in \`:host\` will trigger an ugly animation on load
      transition-property: background, border-color, box-shadow, color, filter;
    }

    :host([selected]) {
      --background: transparent;
      --color: hsl(var(--hue), var(--sat), var(--lum));
      cursor: default;
    }

    :host([href]) {
      padding: 0;
    }

    a {
      color: inherit;
      padding: var(--padding);
      text-decoration: none;

      &:focus {
        outline: none;
      }
    }
  `;

  /** Emits when a specific tab is activated. */
  @event() tabActivate!: EventEmitter<void>;

  /** Whether this tab is active. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Optional href when using a router. */
  @property() href?: string;

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.setAttribute('role', 'tab');

    if (!this.hasAttribute('id')) {
      this.id = `dna-tab-button-${nextUniqueId++}`;
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('click', this.onClick);
    this.addEventListener('keydown', this.onKeydown);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.onClick);
    this.removeEventListener('keydown', this.onKeydown);

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('selected')) {
      if (this.selected) {
        this.setAttribute('aria-selected', 'true');
      } else {
        this.removeAttribute('aria-selected');
      }

      this.setAttribute('tabindex', this.selected ? '0' : '-1');
    }
  }

  override render(): TemplateResult {
    return html`
      ${this.href
        ? html`
            <a href=${this.href}>
              <slot></slot>
            </a>
          `
        : html`<slot></slot>`}
    `;
  }

  // @listen('click')
  onClick(): void {
    console.log('click');
    this.#emitActiveTab();
  }

  // @listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    if ([' ', 'Enter'].includes(event.key)) {
      event.preventDefault();

      if (this.href) {
        this.renderRoot.querySelector('a')?.click();
      } else {
        this.click();
      }
    }
  }

  #emitActiveTab(): void {
    // if (!this.disabled) {
    this.tabActivate.emit();
    // }
  }
}
