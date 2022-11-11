import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
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
      tooltip.showPopover();

      // We only need to create the tooltip once, so ignore all future events.
      ENTER_EVENTS.forEach(eventName => target.removeEventListener(eventName, createTooltip));
    };

    ENTER_EVENTS.forEach(eventName => target.addEventListener(eventName, createTooltip));
  }

  #events = new EventsController(this);

  /** Tooltip placement. */
  @property() placement = 'bottom';

  @state() open = false;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('popover', 'manual');

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

  override showPopover(): void {
    console.log('show popover');

    if (super.showPopover && !this.matches(':open')) {
      super.showPopover();
      this.open = true;
    } else {
      console.log('do it ourselves!');
    }
  }

  override hidePopover(): void {
    if (super.hidePopover && this.matches(':open')) {
      super.hidePopover();
      this.open = false;
    } else {
      console.log('do it ourselves');
    }
  }

  #onHide(event: Event): void {
    console.log('hide', event);
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      console.log('keydown');
    }
  }

  #onShow(): void {
    console.log('onShow', this);

    this.showPopover();
  }
}
