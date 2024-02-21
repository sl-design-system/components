import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { PopoverPosition } from '@sl-design-system/shared';
import { AnchorController, EventsController, popoverPolyfillStyles } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tooltip.scss.js';

let nextUniqueId = 0;

/**
 * Tooltip component.
 *
 * @slot default - The slot for the tooltip content.
 */
export class Tooltip extends LitElement {
  /** The default offset of the tooltip to its anchor. */
  static offset = 12;

  /** @private */
  static override styles: CSSResultGroup = [popoverPolyfillStyles, styles];

  /** The default margin between the tooltip and the viewport. */
  static viewportMargin = 8;

  /** To attach the `sl-tooltip` to the DOM tree and anchor element */
  static lazy(target: Element, callback: (target: Tooltip) => void): void {
    const createTooltip = (): void => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const tooltip = document.createElement('sl-tooltip') as Tooltip;
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
  #anchor = new AnchorController(this, { offset: Tooltip.offset, viewportMargin: Tooltip.viewportMargin });

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

  /** The maximum width of the tooltip. */
  @property({ type: Number, attribute: 'max-width' }) maxWidth?: number;

  /**
   * Position of the tooltip relative to its anchor.
   * @type {'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end'}
   */
  @property() position: PopoverPosition = 'top';

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('popover', 'manual');
    this.setAttribute('role', 'tooltip');

    const root = this.getRootNode() as HTMLElement;

    this.#events.listen(root, 'click', this.#onHide, { capture: true });
    this.#events.listen(root, 'focusin', this.#onShow);
    this.#events.listen(root, 'focusout', this.#onHide);
    this.#events.listen(root, 'pointerover', this.#onShow);
    this.#events.listen(root, 'pointerout', this.#onHide);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    if (changes.has('maxWidth')) {
      this.#anchor.maxWidth = this.maxWidth;
    }

    if (changes.has('position')) {
      this.#anchor.position = this.position;
    }
  }

  override render(): TemplateResult {
    return html` <slot></slot>
      <div class="arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="6">
          <path
            d="M14.48 5.411c.384.374.938.588 1.52.589H0c.582-.001 1.136-.215 1.52-.589L6.475.59c.807-.785 2.241-.785 3.048 0L14.48 5.41Z"
          />
        </svg>
      </div>`;
  }
}
