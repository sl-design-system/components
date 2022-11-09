import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { EventsController } from '../utils/controllers/events.js';
import styles from './tooltip.scss.js';

const ENTER_EVENTS = ['pointerenter', 'focus'];
// LEAVE_EVENTS = ['pointerleave', 'blur', 'keydown', 'click'];

export class Tooltip extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  static lazy(target: Element, callback: (target: Tooltip) => void): void {
    const createTooltip = (): void => {
      const tooltip = document.createElement('sl-tooltip');
      callback(tooltip);
      target.parentNode?.insertBefore(tooltip, target.nextSibling);
      tooltip.show();

      // We only need to create the tooltip once, so ignore all future events.
      ENTER_EVENTS.forEach(eventName => target.removeEventListener(eventName, createTooltip));
    };

    ENTER_EVENTS.forEach(eventName => target.addEventListener(eventName, createTooltip));
  }

  #events = new EventsController(this);

  override connectedCallback(): void {
    super.connectedCallback();

    const root = this.getRootNode();

    this.#events.listen(root, 'focusin', this.#onShow);
    this.#events.listen(root, 'focusout', this.#onHide);
    this.#events.listen(root, 'keydown', this.#onKeydown);
    this.#events.listen(root, 'mouseover', this.#onShow);
    this.#events.listen(root, 'mouseout', this.#onHide);
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  show(): void {
    console.log('show');
  }

  #onHide(event: Event): void {
    console.log('hide', event);
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      console.log('keydown');
    }
  }

  #onShow(event: Event): void {
    console.log('show', event);
  }
}
