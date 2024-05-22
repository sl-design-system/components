import { localized } from '@lit/localize';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './accordion-item.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-accordion-item': AccordionItem;
  }
}

/**
 * An accordion item component.
 *
 * @csspart summary - Header element of the accordion-item
 * @csspart panel - The body of the accordion-item
 *
 * @slot default - Body content for the accordion
 */
@localized()
export class AccordionItem extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Whether we should actually animate opening/closing the wrapper. */
  #shouldAnimate = true;

  /** Whether the element is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Whether the details element is opened. */
  @property({ type: Boolean, reflect: true }) open?: boolean;

  /** A text shown in the header - as a title of the accordion item. */
  @property() summary?: string;

  /** @internal Emits when the accordion item has been toggled. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    if (changes.has('open')) {
      // Do not animate the opening on the first render
      this.#shouldAnimate = false;
      this.#animateState(this.open ? 'opening' : 'closing');
      this.#shouldAnimate = true;
    }
  }

  override render(): TemplateResult {
    return html`
      <details @toggle=${this.#onToggle}>
        <summary
          @click=${this.#onClick}
          aria-controls="content"
          aria-expanded=${this.open ? 'true' : 'false'}
          id="summary"
          part="summary"
          tabindex=${this.disabled ? -1 : 0}
        >
          <svg viewBox="-12 -14 24 28" xmlns="http://www.w3.org/2000/svg">
            <g class="horizontal-line">
              <rect x="-1" y="-8" width="2" height="16" rx="0.824742" />
            </g>
            <g class="vertical-line">
              <rect x="-1" y="-8" width="2" height="16" rx="0.824742" />
            </g>
          </svg>
          ${this.summary}
        </summary>
        <div class="wrapper">
          <div class="body">
            <div aria-labelledby="summary" id="content" part="panel" role="region">
              <slot></slot>
            </div>
          </div>
        </div>
      </details>
    `;
  }

  /**
   * This is a workaround for `delegatesFocus` not allowing you to select
   * any text in the content of the accordion item.
   * See https://issues.chromium.org/issues/40622041
   */
  override focus(options?: FocusOptions): void {
    this.renderRoot.querySelector('summary')?.focus(options);
  }

  /**
   * Toggles the component state between open or closed. If the `force` parameter is
   * provided, the state will be set to the value of the parameter.
   *
   * @param force - The state to forcibly set the component to
   */
  toggle(force?: boolean): void {
    if (typeof force === 'boolean' && force === this.open) {
      return;
    }

    this.open = force ?? !this.open;
    this.#animateState(this.open ? 'opening' : 'closing');
  }

  #onClick(event: Event): void {
    // Prevent the click event from toggling the details element
    event.preventDefault();

    if (this.disabled) {
      event.stopPropagation();

      return;
    }

    this.#animateState(this.open ? 'closing' : 'opening');
  }

  #onToggle(event: ToggleEvent): void {
    this.open = event.newState === 'open';
    this.toggleEvent.emit(this.open);
  }

  /**
   * Animate the details opening or closing. This process is done in steps.
   *
   * Opening:
   * 1. Add the `open` attribute to the details element, so the wrapper is visible
   * 2. Add an `animationend` listener that will remove the `opening` class
   * 3. Add the `opening` class to the details in the next frame (for browser compatibility)
   *
   * Closing:
   * 1. Add an `animationend` listener that will remove the `closing` class and `open` attribute
   * 2. Add the `closing` class to the details in the next frame (for browser compatibility)
   *
   * The specific order of adding/removing the `open` attribute is necessary for the animation
   * to work. This will also trigger the `toggle` event, which in turn will trigger our own
   * `sl-toggle` event.
   *
   * @param state - The state which we should animate to
   */
  #animateState(state: 'opening' | 'closing'): void {
    const details = this.renderRoot.querySelector('details') as HTMLElement,
      wrapper = this.renderRoot.querySelector('.wrapper') as HTMLElement;

    Object.assign(wrapper.style, {
      animationDuration: this.#shouldAnimate ? '' : '0s',
      transitionDuration: this.#shouldAnimate ? '' : '0s'
    });

    if (state === 'opening') {
      details?.setAttribute('open', '');
    }

    details.addEventListener(
      'animationend',
      () => {
        details.classList.remove(state);

        if (state === 'closing') {
          details.removeAttribute('open');
        }
      },
      { once: true }
    );

    requestAnimationFrame(() => details.classList.add(state));
  }
}
