import { localized } from '@lit/localize';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './accordion-item.scss.js';

let nextUniqueId = 0;

/**
 * An accordion item component.
 *
 * @slot default - Body content for the accordion
 * @part summary - Header element of the accordion-item
 */
@localized()
export class AccordionItem extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /**
   * Unique ID for each accordion item component.
   */
  #accordionItemId = `sl-accordion-item-${nextUniqueId++}`;

  /**
   * Unique ID for each accordion item component content.
   */
  #accordionItemContentId = `sl-accordion-item-content-${nextUniqueId++}`;

  /** A text shown in the header - as a title of the accordion item. */
  @property() summary!: string;

  /** Whether the element is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Emits when the accordion item has been toggled. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<string>;

  /** Whether the details element is opened. */
  @property({ reflect: true, type: Boolean }) open?: boolean;

  /** @private */
  @query('.wrapper') wrapper!: HTMLDivElement;

  override render(): TemplateResult {
    return html`
      <details @toggle=${this.#onToggle} ?open=${this.open}>
        <summary
          id=${this.#accordionItemId}
          aria-controls=${this.#accordionItemContentId}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          aria-expanded=${this.open ? 'true' : 'false'}
          tabindex=${this.disabled ? -1 : 0}
          part="summary"
          @click=${this.#onClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="28"
            viewBox="0 0 24 28"
            fill="none"
            class=${classMap({ opened: !!this.open })}
          >
            <rect class="horizontal-line" x="11.0103" y="6" width="1.97938" height="16" rx="0.824742" fill="#222222" />
            <rect class="vertical-line" x="11.0103" y="6" width="1.97938" height="16" rx="0.824742" fill="#222222" />
          </svg>
          ${this.summary}
        </summary>
        <div class="wrapper">
          <div id=${this.#accordionItemContentId} class="panel" role="region" aria-labelledby=${this.#accordionItemId}>
            <slot></slot>
          </div>
        </div>
      </details>
    `;
  }

  #onToggle(event: ToggleEvent): void {
    this.open = event.newState === 'open';

    this.toggleEvent.emit(event.newState);
  }

  #onClick(event: Event & { target: HTMLElement }): void {
    if (this.disabled || event.defaultPrevented) {
      // No toggling when `disabled` or the user prevents it.
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const details = this.renderRoot.querySelector('details') as HTMLDetailsElement;

    // In Chrome opening animation is not working by default when opening details on the second time
    requestAnimationFrame(() => this.wrapper.classList.add('opening'));
    this.wrapper.addEventListener(
      'animationend',
      () => {
        this.wrapper.classList.remove('opening');
      },
      { once: true }
    );

    if (details.hasAttribute('open')) {
      event.preventDefault();
      this.wrapper.classList.add('closing');
      this.wrapper.addEventListener(
        'animationend',
        () => {
          details.removeAttribute('open');
          this.wrapper.classList.remove('closing');
        },
        { once: true }
      );
    }
  }
}
