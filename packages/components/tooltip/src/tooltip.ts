import type { CSSResultGroup, TemplateResult } from 'lit';
import type { PopoverPosition } from '@sl-design-system/shared';
import { EventsController } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tooltip.scss.js';

let nextUniqueId = 0;

/**
 * Tooltip component.
 */
export class Tooltip extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  static lazy(target: Element, callback: (target: Tooltip) => void): void {
    const createTooltip = (): void => {
      const tooltip = document.createElement('sl-tooltip');
      tooltip.id = `sl-tooltip-${nextUniqueId++}`;

      callback(tooltip);

      target.parentNode?.insertBefore(tooltip, target.nextSibling);
      target.setAttribute('aria-describedby', tooltip.id);

      // tooltip.anchorElement = target as HTMLElement;
      // tooltip.showPopover();

      // We only need to create the tooltip once, so ignore all future events.
      ['focusin', 'pointerover'].forEach(eventName => target.removeEventListener(eventName, createTooltip));
    };

    ['focusin', 'pointerover'].forEach(eventName => target.addEventListener(eventName, createTooltip));
  }

  #events = new EventsController(this);

  #matchesAnchor = (element: Element): boolean => {
    return !!this.id && element.nodeType === Node.ELEMENT_NODE && this.id === element.getAttribute('aria-describedby');
  };

  #onHide = ({ target }: Event): void => {
    if (this.#matchesAnchor(target as Element)) {
      // this.anchorElement = undefined;
      // this.hidePopover();
    }
  };

  #onShow = ({ target }: Event): void => {
    if (this.#matchesAnchor(target as HTMLElement)) {
      // this.anchorElement = target as HTMLElement;
      // this.showPopover();
    }
  };

  /** Tooltip position. */
  @property() position: PopoverPosition = 'bottom';

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('popover', 'manual');
    this.setAttribute('role', 'tooltip');

    const root = this.getRootNode();

    this.#events.listen(root, 'click', this.#onHide, { capture: true });
    this.#events.listen(root, 'focusin', this.#onShow);
    this.#events.listen(root, 'focusout', this.#onHide);
    this.#events.listen(root, 'pointerover', this.#onShow);
    this.#events.listen(root, 'pointerout', this.#onHide);
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
