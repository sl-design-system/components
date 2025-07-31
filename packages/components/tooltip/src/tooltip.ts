import { AnchorController, EventsController, type PopoverPosition, isPopoverOpen } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tooltip.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tooltip': Tooltip;
  }

  interface ShadowRoot {
    // Workaround for missing type in @open-wc/scoped-elements
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K];
  }
}

export interface TooltipOptions {
  /**
   * This determines the context that is used to create the `<sl-tooltip>` element. If
   * not provided, the tooltip will be created on the target element if it has a `shadowRoot`,
   * or the root node of the target element.
   */
  context?: Document | ShadowRoot;

  /**
   * This is the node where the tooltip will be added to. This can be useful when
   * you don't want the tooltip to be added next to the anchor element. If not provided,
   * it will be added next to the anchor element.
   */
  parentNode?: Node;
}

let nextUniqueId = 0;

/**
 * Tooltip component.
 *
 * @slot default - The slot for the tooltip content.
 */
export class Tooltip extends LitElement {
  /** @internal The default padding of the arrow. */
  static arrowPadding = 16;

  /** @internal The default offset of the tooltip to its anchor. */
  static offset = 12;

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The default margin between the tooltip and the viewport. */
  static viewportMargin = 8;

  /** To attach the `sl-tooltip` to the DOM tree and anchor element */
  static lazy(target: Element, callback: (target: Tooltip) => void, options: TooltipOptions = {}): () => void {
    const createTooltip = (): void => {
      const context = options.context || target.shadowRoot || (target.getRootNode() as Document),
        tooltip = context.createElement('sl-tooltip');

      if (options.parentNode) {
        options.parentNode.appendChild(tooltip);
      } else {
        target.parentNode!.insertBefore(tooltip, target.nextSibling);
      }

      // If the tooltip has no popover property, then the sl-tooltip custom element
      // is not defined in either the `options.context` or the document.
      if (tooltip.popover === null) {
        console.warn(
          `The sl-tooltip custom element is not defined in the ${context !== document ? `${(context as ShadowRoot).host.tagName} element` : 'document'}. Please make sure to register the sl-tooltip custom element in your application.`
        );

        tooltip.remove();
        cleanup();

        return;
      }

      tooltip.id = `sl-tooltip-${nextUniqueId++}`;
      target.setAttribute('aria-describedby', tooltip.id);

      callback(tooltip);

      tooltip.anchorElement = target as HTMLElement;
      tooltip.showPopover();

      // We only need to create the tooltip once, so ignore all future events.
      cleanup();
    };

    const cleanup = () => {
      ['focusin', 'pointerover'].forEach(eventName => target.removeEventListener(eventName, createTooltip));
    };

    ['focusin', 'pointerover'].forEach(eventName => target.addEventListener(eventName, createTooltip));

    return cleanup;
  }

  /** Controller for managing anchoring. */
  #anchor = new AnchorController(this, {
    arrowElement: '.arrow',
    arrowPadding: Tooltip.arrowPadding,
    offset: Tooltip.offset,
    viewportMargin: Tooltip.viewportMargin
  });

  /** Events controller. */
  #events = new EventsController(this);

  #matchesAnchor = (element: Element): boolean => {
    return (
      !!this.id &&
      element.nodeType === Node.ELEMENT_NODE &&
      (this.id === element.getAttribute('aria-describedby') || this.id === element.getAttribute('aria-labelledby'))
    );
  };

  #getParentsUntil = (element: Element, selector: string) => {
    const parents: Element[] = [];
    let parent = element?.parentNode as HTMLElement | null;
    while (parent && typeof parent.matches === 'function') {
      parents.unshift(parent);
      if (parent.matches(selector)) return parents;
      else parent = parent.parentNode as HTMLElement | null;
    }
    return [];
  };

  #onHide = (event: Event): void => {
    let toTooltip = false;
    let fromTooltip = false;
    let toChild = false;
    if (event instanceof PointerEvent) {
      toTooltip = (event.relatedTarget as Element)?.nodeName === 'SL-TOOLTIP';
      fromTooltip =
        (event.target as Element)?.nodeName === 'SL-TOOLTIP' && !this.#matchesAnchor(event.relatedTarget as Element);
      toChild =
        this.#getParentsUntil(
          event.relatedTarget as Element,
          "[aria-describedby='" + this.id + "'],[aria-labelledby='" + this.id + "']"
        ).length > 0;
    }
    if (toChild) {
      return;
    }
    if ((this.#matchesAnchor(event.target as Element) && !toTooltip) || fromTooltip) {
      this.hidePopover();
    }
  };

  #showTooltip = (element: HTMLElement): void => {
    this.anchorElement = element;

    const anchorSlot = this.anchorElement?.getAttribute('slot');
    if (typeof anchorSlot === 'string') {
      this.setAttribute('slot', anchorSlot); // make sure the tooltip is slotted correctly, otherwise it might inherit styles from the wrong slot
    }

    this.showPopover();
    requestAnimationFrame(() => {
      this.#calculateSafeTriangle();
    });
  };

  #onShow = ({ target, type }: Event): void => {
    if (!this.#matchesAnchor(target as HTMLElement)) {
      return;
    }

    // For keyboard navigation (focus events)
    if (type === 'focusin') {
      requestAnimationFrame(() => {
        if ((target as Element).matches(':focus-visible')) {
          this.#showTooltip(target as HTMLElement);
        }
      });
      return;
    }

    // For hover events
    if (type === 'pointerover') {
      this.#showTooltip(target as HTMLElement);
    }
  };

  #onKeydown(event: KeyboardEvent): void {
    if (isPopoverOpen(this) && event.key === 'Escape') {
      this.hidePopover();
    }
  }

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
    this.setAttribute('aria-hidden', 'true'); // Prevent the tooltip from being read by screen readers multiple times

    const root = this.getRootNode() as HTMLElement;

    this.#events.listen(root, 'click', this.#onHide, { capture: true });
    this.#events.listen(root, 'focusin', this.#onShow);
    this.#events.listen(root, 'focusout', this.#onHide);
    this.#events.listen(root, 'keydown', this.#onKeydown);
    this.#events.listen(root, 'pointerover', this.#onShow);
    this.#events.listen(root, 'pointerout', this.#onHide);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('maxWidth')) {
      this.#anchor.maxWidth = this.maxWidth;
    }

    if (changes.has('position')) {
      this.#anchor.position = this.position;
    }
  }

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <div class="arrow"></div>
      <div class="safe-triangle"></div>
    `;
  }

  /**
   * Calculate a "safe triangle" for the submenu to a user can safely move his cursor
   * from the trigger to the submenu without the submenu closing.
   * See https://www.smashingmagazine.com/2023/08/better-context-menus-safe-triangles
   */
  #calculateSafeTriangle(): void {
    const actualPlacement = this.getAttribute('actual-placement');

    if (!actualPlacement || !this.anchorElement) {
      return;
    }

    const tooltipRect = this.getBoundingClientRect(),
      anchorRect = this.anchorElement.getBoundingClientRect();
    let insetBlockStart,
      blockSize,
      inlineSize,
      polygon,
      anchorInsetBlockStart = 0,
      insetInlineStart,
      anchorSideBlockStart = 0,
      tootltipSideBlockStart = 0;

    if (actualPlacement.startsWith('top') || actualPlacement.startsWith('bottom')) {
      anchorInsetBlockStart = Math.floor(anchorRect.left - tooltipRect.left);
      inlineSize = Math.ceil(Math.max(tooltipRect.width, anchorRect.width));
      insetInlineStart = Math.ceil(Math.min(tooltipRect.left, anchorRect.left));
    }

    if (actualPlacement.startsWith('top')) {
      blockSize = Math.ceil(anchorRect.top - tooltipRect.bottom) + 2;
      insetBlockStart = tooltipRect.bottom - 1;
      polygon = `0% 0%, 100% 0, ${anchorInsetBlockStart + anchorRect.width}px 100%, ${anchorInsetBlockStart}px 100%`;
    }

    if (actualPlacement.startsWith('bottom')) {
      blockSize = Math.ceil(tooltipRect.top - anchorRect.bottom) + 2;
      insetBlockStart = anchorRect.bottom - 1;
      polygon = `${anchorInsetBlockStart}px 0, ${anchorInsetBlockStart + anchorRect.width}px 0, 100% 100%, 0 100%`;
    }

    if (actualPlacement.startsWith('left') || actualPlacement.startsWith('right')) {
      blockSize = Math.ceil(Math.max(tooltipRect.height, anchorRect.height)) + 2;
      insetBlockStart = Math.min(anchorRect.top, tooltipRect.top) - 1;
      anchorInsetBlockStart = anchorRect.top;
      anchorSideBlockStart = Math.max(anchorRect.top - tooltipRect.top, 0);
      tootltipSideBlockStart = Math.max(tooltipRect.top - anchorRect.top, 0);
    }

    if (actualPlacement.startsWith('right')) {
      insetInlineStart = Math.ceil(Math.min(tooltipRect.left, anchorRect.right)) - 1;
      inlineSize = Math.ceil(tooltipRect.left - anchorRect.right) + 2;
      polygon = `0 ${anchorSideBlockStart}px , 100% ${tootltipSideBlockStart}px,
                 100% ${tootltipSideBlockStart + tooltipRect.height + 2}px, 0 ${anchorSideBlockStart + anchorRect.height + 2}px`;
    }

    if (actualPlacement.startsWith('left')) {
      insetInlineStart = Math.ceil(Math.min(tooltipRect.right, anchorRect.left)) - 1;
      inlineSize = Math.ceil(anchorRect.left - tooltipRect.right) + 2;
      polygon = `0 ${tootltipSideBlockStart}px , 100% ${anchorSideBlockStart}px,
                 100% ${anchorSideBlockStart + anchorRect.height + 2}px, 0 ${tootltipSideBlockStart + tooltipRect.height + 2}px`;
    }

    const inset = `${insetBlockStart}px auto auto ${insetInlineStart}px`;
    const safeTriangle = this.renderRoot.querySelector<HTMLElement>('.safe-triangle')!;
    safeTriangle.style.blockSize = `${blockSize}px`;
    safeTriangle.style.clipPath = `polygon(${polygon})`;
    safeTriangle.style.inlineSize = `${inlineSize}px`;
    safeTriangle.style.inset = inset;
  }
}
