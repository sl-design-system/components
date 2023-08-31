import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { PopoverPosition } from '@sl-design-system/shared';
import { AnchorController, EventsController, popoverPolyfillStyles } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tooltip.scss.js';

let nextUniqueId = 0;

/**
 * Tooltip component.
 */
export class Tooltip extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = [popoverPolyfillStyles, styles];

  static lazy(target: Element, callback: (target: Tooltip) => void): void {
    const createTooltip = (): void => {
      const tooltip = document.createElement('sl-tooltip');
      tooltip.id = `sl-tooltip-${nextUniqueId++}`;

      callback(tooltip);

      target.parentNode?.insertBefore(tooltip, target.nextSibling);
      target.setAttribute('aria-describedby', tooltip.id);

      tooltip.anchorElement = target as HTMLElement;
      tooltip.showPopover();

      // We only need to create the tooltip once, so ignore all future events.
      ['focusin', 'pointerover'].forEach(eventName => target.removeEventListener(eventName, createTooltip));
    };

    ['focusin', 'pointerover'].forEach(eventName => target.addEventListener(eventName, createTooltip));
  }

  /** Controller for managing anchoring. */
  #anchor = new AnchorController(this, { /*arrow: '.arrow',*/ maxWidth: 140 });

  /** Events controller. */
  #events = new EventsController(this);

  #matchesAnchor = (element: Element): boolean => {
    return !!this.id && element.nodeType === Node.ELEMENT_NODE && this.id === element.getAttribute('aria-describedby');
  };

  #onHide = ({ target }: Event): void => {
    if (this.#matchesAnchor(target as Element)) {
      this.anchorElement = undefined;
      this.hidePopover();
    }
  };

  #onShow = ({ target }: Event): void => {
    if (this.#matchesAnchor(target as HTMLElement)) {
      this.anchorElement = target as HTMLElement;
      this.showPopover();
    }
  };

  /** Tooltip position. */
  @property() position: PopoverPosition = 'bottom';

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('popover', 'manual');
    this.setAttribute('role', 'tooltip');

    const root = this.getRootNode();

    // this.#events.listen(root, 'click', this.#onHide, { capture: true });
    this.#events.listen(root, 'click', this.#onShow);
    this.#events.listen(root, 'focusin', this.#onShow);
    // this.#events.listen(root, 'focusout', this.#onHide);
    this.#events.listen(root, 'pointerover', this.#onShow);
    // this.#events.listen(root, 'pointerout', this.#onHide);

    // this.showPopover();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    if (changes.has('position')) {
      this.#anchor.position = this.position;
      //this.showPopover();
    }
  }

  override render(): TemplateResult {
    return html` <slot></slot>
      <div class="arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="6" viewBox="0 0 16 6">
          <path
            d="M14.4806 5.41145C14.8641 5.78457 15.4178 5.99897 16 6H0C0.582238 5.99897 1.13586 5.78457 1.51935 5.41146L6.47646 0.588546C7.28302 -0.196183 8.717 -0.196182 9.52356 0.588549L14.4806 5.41145Z"
          />
        </svg>
      </div>`;
  }
}

/*
<svg xmlns="http://www.w3.org/svg/2000" width="24" height="12" viewBox="0 0 24 12">
<defs>
  <clipPath id="modal-arrow-cut-stroke-top"><path d="m 24 0 l -10 10 q -2 2 -4 0 l -10 -10"></path></clipPath>
</defs>
<path clip-path="url(#modal-arrow-cut-stroke-top)" d="m 24 0 l -10 10 q -2 2 -4 0 l -10 -10"></path>
  </svg>*/
