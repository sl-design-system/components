import { AnchorController, EventsController, type PopoverPosition, isPopoverOpen } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tooltip.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-close': CustomEvent<void>;
  }

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

  /**
   * Which ARIA relationship attribute to add to the anchor (`aria-describedby` or `aria-labelledby`).
   * Defaults to 'description' ('aria-describedby').
   *
   * A good example of when to use `aria-labelledby`
   * is when the tooltip provides a label or title for the anchor element,
   * such as an icon only button (so button with only an icon) and no visible text.
   */
  ariaRelation?: 'description' | 'label';
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
    let created = false;

    const getLazyTargets = (): Array<Element | ShadowRoot> => {
      const targets: Array<Element | ShadowRoot> = [target],
        shadowRoot = (target as HTMLElement).shadowRoot,
        proxyTarget = (target as Element & { getProxyTarget?(): Element | null }).getProxyTarget?.();

      if (shadowRoot) {
        targets.push(shadowRoot);
      }

      if (proxyTarget instanceof Element && proxyTarget !== target) {
        targets.push(proxyTarget);
      }

      return Array.from(new Set(targets));
    };

    const removeListeners = () => {
      for (const eventTarget of getLazyTargets()) {
        ['focusin', 'pointerover'].forEach(eventName => eventTarget.removeEventListener(eventName, createTooltip));
      }
    };

    const createTooltip = (): void => {
      if (created) {
        return;
      }

      created = true;

      let context = options.context;
      if (!context && target.shadowRoot?.registry?.get('sl-tooltip')) {
        context = target.shadowRoot;
      } else if (!context) {
        context = target.getRootNode() as Document;
      }

      const tooltip = context.createElement('sl-tooltip');

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
        removeListeners();

        return;
      }

      tooltip.id = `sl-tooltip-${nextUniqueId++}`;

      const ariaRelation = options.ariaRelation ?? 'description',
        ariaAttribute = ariaRelation === 'label' ? 'labelledby' : 'describedby';

      target.setAttribute(`aria-${ariaAttribute}`, tooltip.id);

      callback(tooltip);

      tooltip.anchorElement = target as HTMLElement;

      // We only need to create the tooltip once, so ignore all future events.
      removeListeners();
    };

    const cleanup = () => {
      removeListeners();
    };

    for (const eventTarget of getLazyTargets()) {
      ['focusin', 'pointerover'].forEach(eventName => eventTarget.addEventListener(eventName, createTooltip));
    }

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

  /** Anchors observed for this tooltip, used to avoid full DOM scans on hide. */
  #knownAnchors = new Set<HTMLElement>();

  /** Anchors that stay valid even if browser ARIA reflection drops after reparenting. */
  #stableAnchors = new Set<HTMLElement>();

  /** Anchors that originally depended on explicit ARIA idrefs. */
  #explicitRelationAnchors = new Set<HTMLElement>();

  /** Whether the current open state was triggered by focus-based interaction. */
  #openedByFocus = false;

  /** The root where the tooltip was originally connected before any runtime reparenting. */
  #originalRoot?: Node;

  /** Roots where reflected-ARIA anchor discovery already performed a full-root scan. */
  #preparedKeyboardAnchorRoots = new WeakSet<ParentNode>();

  /** Timer for showing/hiding the tooltip. */
  #timer?: ReturnType<typeof setTimeout>;

  /**
   * The amount of time to wait before hiding the tooltip when the user moves the mouse/pointer out.
   * @default 0
   */
  @property({ type: Number, attribute: 'hide-delay' }) hideDelay = 0;

  /** The maximum width of the tooltip. */
  @property({ type: Number, attribute: 'max-width' }) maxWidth?: number;

  /**
   * The offset distance of the tooltip from its anchor.
   * @default Tooltip.offset (12px)
   */
  @property({ type: Number }) offset?: number;

  /**
   * Position of the tooltip relative to its anchor.
   * @type {'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end'}
   */
  @property() position: PopoverPosition = 'top';

  /**
   * The amount of time to wait before showing the tooltip when the user moves the mouse/pointer in.
   * @default 150
   */
  @property({ type: Number, attribute: 'show-delay' }) showDelay = 150;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#originalRoot ??= this.getRootNode();

    this.setAttribute('popover', 'manual');
    this.setAttribute('role', 'tooltip');
    this.setAttribute('aria-hidden', 'true'); // Prevent the tooltip from being read by screen readers multiple times

    const root = this.getRootNode(),
      documentRoot = this.ownerDocument ?? document;

    if (root instanceof ShadowRoot) {
      // EventsController does not expose a generic EventTarget overload, but ShadowRoot
      // is the correct runtime event target for delegated events inside the anchor root.
      const shadowEventRoot = root as unknown as HTMLElement;

      this.#events.listen(shadowEventRoot, 'focusin', this.#onShow);
      this.#events.listen(shadowEventRoot, 'focusout', this.#onHide);
      this.#events.listen(shadowEventRoot, 'keydown', this.#onKeydown);
      this.#events.listen(shadowEventRoot, 'pointerover', this.#onShow);
      this.#events.listen(shadowEventRoot, 'pointerout', this.#onHide);
    } else {
      this.#events.listen(documentRoot, 'focusin', this.#onShow);
      this.#events.listen(documentRoot, 'focusout', this.#onHide);
      this.#events.listen(documentRoot, 'keydown', this.#onKeydown);
      this.#events.listen(documentRoot, 'pointerover', this.#onShow);
      this.#events.listen(documentRoot, 'pointerout', this.#onHide);
    }

    this.#events.listen(documentRoot, 'click', this.#onHide, { capture: true });

    if (root instanceof ShadowRoot) {
      this.#events.listen(documentRoot, 'pointerover', this.#onShow);
      this.#events.listen(documentRoot, 'pointerout', this.#onHide);
    }

    this.#events.listen(documentRoot, 'sl-close', this.#onShow);
  }

  override disconnectedCallback(): void {
    clearTimeout(this.#timer);
    this.#timer = undefined;

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <div class="arrow"></div>
      <div class="safe-triangle"></div>
    `;
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('maxWidth')) {
      this.#anchor.maxWidth = this.maxWidth;
    }

    if (changes.has('offset')) {
      this.#anchor.offset = this.offset ?? Tooltip.offset;
    }

    if (changes.has('position')) {
      this.#anchor.position = this.position;
    }
  }

  #onHide = (event: Event): void => {
    // Only clear the timer for focusout when the tooltip was opened by focus; otherwise,
    // an unrelated focusout could cancel a pending hover showDelay timer.
    if (event.type !== 'focusout' || this.#openedByFocus) {
      clearTimeout(this.#timer);
      this.#timer = undefined;
    }

    if (event.type === 'click') {
      this.#hideTooltip();
      return;
    }

    if (event.type === 'pointerout' && !isPopoverOpen(this)) {
      return;
    }

    // Ignore unrelated focusout events when the tooltip was not opened by focus.
    // This avoids overriding a pending hover show timer with a no-op timeout.
    if (event.type === 'focusout' && !this.#openedByFocus) {
      return;
    }

    this.#timer = setTimeout(
      () => {
        const anchorHovered = !!this.anchorElement?.matches(':hover');
        const tooltipHovered = this.matches(':hover');
        const safeTriangleHovered = !!this.renderRoot.querySelector('.safe-triangle:hover');

        if (event.type === 'focusout') {
          if (!this.#openedByFocus) {
            return;
          }

          // Keep the tooltip visible when pointer hover is still active.
          // Without this guard, a focusout can close the tooltip even though the anchor
          // remains hovered, and no new pointerover will fire to reopen it.
          if (anchorHovered || tooltipHovered || safeTriangleHovered) {
            return;
          }

          const anchorForEvent = this.#findAnchorInEvent(event),
            relatedTargetAnchor =
              event instanceof FocusEvent
                ? this.#findAnchorFromElement(event.relatedTarget as Element | null)
                : undefined,
            focusedAnchor = relatedTargetAnchor ?? this.#findFocusedAnchor();

          const movedToAnotherSharedAnchor =
            !!focusedAnchor && focusedAnchor !== this.anchorElement && this.#matchesAnchor(focusedAnchor);
          if (movedToAnotherSharedAnchor) {
            this.#showTooltip(focusedAnchor, true);
            return;
          }

          const hasFocusWithinCurrentAnchor = !!this.anchorElement?.matches(':focus-within');

          // If focus is still logically within this anchor (including descendants), keep the tooltip open.
          if (hasFocusWithinCurrentAnchor) {
            return;
          }

          // Ignore unrelated focusouts. Hide only when the current anchor actually lost focus.
          const currentAnchorLostFocus = !!this.anchorElement && !hasFocusWithinCurrentAnchor;
          if (currentAnchorLostFocus && (!anchorForEvent || anchorForEvent === this.anchorElement)) {
            this.#hideTooltip();
          }
          return;
        }

        const isFocusVisible = !!this.anchorElement?.matches(':focus-visible');

        // Keep the tooltip open while the current anchor still has keyboard-visible focus.
        // This prevents hover-out from hiding a focus-triggered tooltip.
        if (anchorHovered || tooltipHovered || safeTriangleHovered || isFocusVisible) {
          return;
        }

        // When hover leaves a shared anchor, restore the tooltip to the focused anchor
        // if the tooltip was originally opened through keyboard focus.
        const focusedAnchor = this.#findFocusedAnchor();
        if (this.#openedByFocus && focusedAnchor && this.#matchesAnchor(focusedAnchor)) {
          this.#showTooltip(focusedAnchor, true);
          return;
        }

        // First check known anchors to avoid scanning the whole root on every hide attempt.
        const knownAnchors = this.#getKnownAnchors();
        const anyKnownAnchorHovered = knownAnchors.some(el => el.matches(':hover') || el.matches(':focus-visible'));

        if (anyKnownAnchorHovered) {
          return;
        }

        // Fallback for anchors not yet tracked in #knownAnchors.
        const potentialAnchors = Array.from(new Set([...knownAnchors, ...this.#getAriaAnchors()]));
        const anyAnchorHovered = potentialAnchors.some(el => el.matches(':hover') || el.matches(':focus-visible'));

        if (!anyAnchorHovered) {
          this.#hideTooltip();
        }
      },
      event.type === 'focusout' ? 0 : this.hideDelay
    );
  };

  #onKeydown(event: KeyboardEvent): void {
    if (isPopoverOpen(this) && event.key === 'Escape') {
      this.#hideTooltip();
      return;
    }

    // `focusin` from delegated focus inside shadow DOM is not always observed on the
    // same root as the tooltip. When keyboard focus moves with Tab between shared
    // anchors (for example sl-button elements inside sl-button-bar), re-read the
    // focused anchor on the next frame and sync the tooltip to that element.
    if (event.key === 'Tab' && isPopoverOpen(this) && this.#openedByFocus) {
      requestAnimationFrame(() => {
        let focusedAnchor = this.#findFocusedAnchor() ?? this.#findKnownFocusedAnchor();
        const currentAnchor = this.anchorElement;

        if (!focusedAnchor && currentAnchor instanceof HTMLElement) {
          this.#prepareKeyboardAnchors(currentAnchor);
          focusedAnchor = this.#findFocusedAnchor() ?? this.#findKnownFocusedAnchor();
        }

        if (focusedAnchor && focusedAnchor !== this.anchorElement && this.#matchesAnchor(focusedAnchor)) {
          this.#showTooltip(focusedAnchor, true);
          return;
        }

        if (
          focusedAnchor &&
          focusedAnchor !== this.anchorElement &&
          this.#knownAnchors.has(focusedAnchor) &&
          focusedAnchor.matches(':focus-within')
        ) {
          this.#showTooltip(focusedAnchor, true);
          return;
        }

        if (!focusedAnchor && !this.anchorElement?.matches(':focus-within')) {
          this.#hideTooltip();
        }
      });
    }
  }

  #onShow = (event: Event): void => {
    // If the event is sl-close, the event path might not contain the anchor (as it comes from the dialog)
    // So we use the activeElement (or shadowRoot.activeElement) as a candidate anchor.
    const anchorInEvent = this.#findAnchorInEvent(event),
      candidateAnchor = event.type === 'focusin' || event.type === 'sl-close' ? this.#findFocusedAnchor() : null;

    const anchorElement = anchorInEvent || candidateAnchor;
    const anchorRoot = anchorElement ? this.#findAssignedSlotRoot(anchorElement, event.composedPath()) : undefined;

    if (!anchorElement) {
      return;
    }

    const normalizedAnchorElement = this.#normalizeAnchorElement(anchorElement);

    // Ignore events from open popovers that are nested *inside* the anchor (for example a menu item inside
    // an open menu-button). Still allow anchors that themselves live inside an open popover, such as a grid
    // bulk action button inside a floating action bar.
    if (this.#isInsideNestedOpenPopover(event, normalizedAnchorElement)) {
      return;
    }

    // Track anchors as soon as they are detected, even when showing is delayed.
    this.#knownAnchors.add(normalizedAnchorElement);

    // For hover events
    if (event.type === 'pointerover') {
      clearTimeout(this.#timer);
      this.#timer = undefined;

      // If already open, update anchor immediately to avoid "stickiness"
      if (isPopoverOpen(this)) {
        this.#showTooltip(normalizedAnchorElement, this.#openedByFocus, anchorRoot);
      } else {
        this.#timer = setTimeout(() => this.#showTooltip(normalizedAnchorElement, false, anchorRoot), this.showDelay);
      }
      return;
    }

    // For keyboard navigation (focus events or dialog/popover closing)
    if (event.type === 'focusin' || event.type === 'sl-close') {
      clearTimeout(this.#timer);
      this.#timer = undefined;

      if (!(anchorElement instanceof HTMLElement) || !this.#matchesAnchor(anchorElement)) {
        return;
      }

      const path = event.composedPath();
      const getHasFocusVisible = (): boolean =>
        anchorElement.matches(':focus-visible') ||
        path.some(el => el instanceof Element && el.matches(':focus-visible'));

      // If already open (e.g. tabbing between shared buttons), update anchor immediately
      if (isPopoverOpen(this)) {
        this.#prepareKeyboardAnchors(normalizedAnchorElement);
        this.#showTooltip(normalizedAnchorElement, getHasFocusVisible(), anchorRoot);
      } else {
        requestAnimationFrame(() => {
          const hasFocusVisible = getHasFocusVisible();

          if (hasFocusVisible) {
            this.#prepareKeyboardAnchors(normalizedAnchorElement);
            this.#showTooltip(normalizedAnchorElement, true, anchorRoot);
          }
        });
      }
    }
  };

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

  #findAnchorFromElement = (element: Element | null): HTMLElement | undefined => {
    if (!element) {
      return undefined;
    }

    let current: Element | null = element;

    while (current) {
      if (current instanceof HTMLElement && this.#stableAnchors.has(current)) {
        return current;
      }

      if (current instanceof HTMLElement && this.#matchesAnchor(current)) {
        return current;
      }

      if (current.parentElement) {
        current = current.parentElement;
        continue;
      }

      const shadowRoot = this.#getShadowRoot(current.getRootNode());
      current = shadowRoot?.host ?? null;
    }

    return undefined;
  };

  #findStableAnchorFromElement = (element: Element | null): HTMLElement | undefined => {
    if (!element) {
      return undefined;
    }

    let current: Element | null = element;

    while (current) {
      if (current instanceof HTMLElement && this.#stableAnchors.has(current)) {
        return current;
      }

      if (current.parentElement) {
        current = current.parentElement;
        continue;
      }

      const shadowRoot = this.#getShadowRoot(current.getRootNode());
      current = shadowRoot?.host ?? null;
    }

    return undefined;
  };

  #isEventActiveAnchor = (element: HTMLElement, event: Event, path: EventTarget[], host: Element): boolean => {
    if (path.includes(element)) {
      return true;
    }

    if (host !== event.target) {
      return false;
    }

    if (event.type === 'pointerover') {
      return element.matches(':hover');
    }

    if (event.type === 'focusin' || event.type === 'sl-close') {
      return element.matches(':focus-within');
    }

    return false;
  };

  /**
   * Find the anchor element for a given event. First checks the composed path directly,
   * then searches inside shadow roots of elements in the path. This handles cases where
   * the pointer is over a host element (e.g. `sl-menu-button`) but the actual anchor
   * (e.g. `sl-button` with `ariaDescribedByElements`) is inside its shadow DOM.
   */
  #findAnchorInEvent = (event: Event): HTMLElement | undefined => {
    const path = event.composedPath(),
      escapedId = this.id ? CSS.escape(this.id) : undefined;

    // First check elements directly in the composed path
    const anchor = path.find((el): el is HTMLElement => el instanceof HTMLElement && this.#matchesAnchor(el));

    if (anchor) {
      return anchor;
    }

    for (const el of path) {
      if (!(el instanceof Element)) {
        continue;
      }

      const stableAnchor = this.#findStableAnchorFromElement(el);

      if (stableAnchor) {
        return stableAnchor;
      }
    }

    for (const el of path) {
      if (el instanceof Element && el.shadowRoot) {
        const ariaMatch = escapedId
          ? el.shadowRoot.querySelector(`[aria-describedby~="${escapedId}"], [aria-labelledby~="${escapedId}"]`)
          : null;

        if (
          ariaMatch instanceof HTMLElement &&
          this.#isEventActiveAnchor(ariaMatch, event, path, el) &&
          this.#matchesAnchor(ariaMatch)
        ) {
          return ariaMatch;
        }

        for (const child of Array.from(el.shadowRoot.children)) {
          if (
            child instanceof HTMLElement &&
            this.#isEventActiveAnchor(child, event, path, el) &&
            this.#matchesAnchor(child)
          ) {
            return child;
          }
        }
      }
    }

    return undefined;
  };

  #findFocusedAnchor = (): HTMLElement | undefined => {
    const root = this.getRootNode() as Document | ShadowRoot;
    let activeElement: Element | null = root.activeElement || document.activeElement;

    while (activeElement instanceof HTMLElement && activeElement.shadowRoot?.activeElement) {
      activeElement = activeElement.shadowRoot.activeElement;
    }

    return this.#findAnchorFromElement(activeElement);
  };

  #findKnownFocusedAnchor = (): HTMLElement | undefined =>
    Array.from(this.#knownAnchors).find(anchor => anchor.isConnected && anchor.matches(':focus-within'));

  /**
   * Start with cheap lookups: explicit ARIA attributes in this root and anchors we
   * already observed before. This covers the common cases without scanning the full DOM.
   */
  #seedKnownAnchors = (): void => {
    for (const anchor of this.#getAriaAnchors()) {
      this.#knownAnchors.add(this.#normalizeAnchorElement(anchor));
    }

    void this.#getKnownAnchors();
  };

  /**
   * As a last resort for keyboard navigation, scan the root and cache anchors that
   * only expose the tooltip relation through reflected/forwarded ARIA.
   */
  #discoverAnchorsByScan = (): void => {
    for (const root of this.#getAnchorSearchRoots()) {
      for (const element of Array.from(root.querySelectorAll('*'))) {
        if (element instanceof HTMLElement && this.#matchesAnchor(element)) {
          this.#knownAnchors.add(this.#normalizeAnchorElement(element));
        }
      }
    }
  };

  /**
   * Shared keyboard flows need a stable cache because browsers can clear reflected
   * ARIA relations on proxy targets while focus is moving between anchors.
   */
  #prepareKeyboardAnchors = (anchorElement: HTMLElement): void => {
    const root = this.getRootNode() as ParentNode;

    this.#seedKnownAnchors();

    if (this.#preparedKeyboardAnchorRoots.has(root)) {
      return;
    }

    const proxyTarget = (anchorElement as Element & { getProxyTarget?(): Element | null }).getProxyTarget?.(),
      internals = (anchorElement as HTMLElement & { internals?: ElementInternals }).internals,
      reliesOnReflectedRelation =
        this.#hasAnyReflectedRelation(anchorElement) ||
        this.#hasAnyReflectedRelation(proxyTarget) ||
        this.#hasAnyReflectedRelation(internals);

    if (reliesOnReflectedRelation) {
      this.#discoverAnchorsByScan();
      this.#preparedKeyboardAnchorRoots.add(root);
    }
  };

  #getAnchorSearchRoots = (): ParentNode[] => {
    const roots: ParentNode[] = [];
    const seen = new Set<Node>();
    let root: Node | null = this.getRootNode();

    while (root && !seen.has(root)) {
      seen.add(root);

      if (root instanceof Document) {
        roots.push(root);
        break;
      }

      const shadowRoot = this.#getShadowRoot(root);
      if (!shadowRoot) {
        break;
      }

      roots.push(shadowRoot);
      root = shadowRoot.host.getRootNode();
    }

    return roots;
  };

  #findAssignedSlotRoot = (anchorElement: HTMLElement, path: EventTarget[]): ShadowRoot | undefined => {
    const slotInPath = path.find((el): el is HTMLSlotElement => {
        const slot =
          el instanceof HTMLSlotElement
            ? el
            : el instanceof Element && el.tagName === 'SLOT'
              ? (el as HTMLSlotElement)
              : null;

        if (!slot) {
          return false;
        }

        return slot.assignedNodes({ flatten: true }).includes(anchorElement);
      }),
      assignedSlot = anchorElement.assignedSlot || slotInPath,
      assignedSlotRoot = this.#getShadowRoot(assignedSlot?.getRootNode());

    return assignedSlotRoot;
  };

  /**
   * Event-time slot information can become stale before a delayed show fires.
   * Prefer the anchor's current assigned slot root when it exists, and only fall
   * back to the previously captured root for cases that are only discoverable from
   * the original event path.
   */
  #resolveAnchorRoot = (anchorElement: HTMLElement, anchorRootHint?: ShadowRoot): ShadowRoot | undefined => {
    const currentAssignedSlotRoot = this.#getShadowRoot(anchorElement.assignedSlot?.getRootNode());

    return currentAssignedSlotRoot ?? anchorRootHint;
  };

  #getAriaAnchorSelector = (): string | undefined => {
    const escapedId = this.id ? CSS.escape(this.id) : undefined;
    if (!escapedId) {
      return undefined;
    }

    return `[aria-describedby~="${escapedId}"], [aria-labelledby~="${escapedId}"]`;
  };

  #getAriaAnchors = (root: ParentNode = this.getRootNode() as ParentNode): HTMLElement[] => {
    const selector = this.#getAriaAnchorSelector();

    if (!selector) {
      return [];
    }

    return Array.from(root.querySelectorAll<HTMLElement>(selector));
  };

  #getKnownAnchors = (): HTMLElement[] => {
    const knownAnchors: HTMLElement[] = [];

    for (const anchor of this.#knownAnchors) {
      if (!anchor.isConnected || (!this.#stableAnchors.has(anchor) && !this.#matchesAnchor(anchor))) {
        this.#knownAnchors.delete(anchor);
        this.#stableAnchors.delete(anchor);
        this.#explicitRelationAnchors.delete(anchor);
      } else {
        knownAnchors.push(anchor);
      }
    }

    return knownAnchors;
  };

  #getShadowRoot = (node: Node | null | undefined): ShadowRoot | undefined => {
    if (node instanceof ShadowRoot) {
      return node;
    }

    // Browser test runners can surface a real ShadowRoot from another realm,
    // which makes `instanceof ShadowRoot` return false even though the node
    // still exposes `host` and behaves like a shadow root.
    if (
      node &&
      node.nodeType === Node.DOCUMENT_FRAGMENT_NODE &&
      'host' in node &&
      (node.host as Element)?.nodeType === Node.ELEMENT_NODE
    ) {
      return node as ShadowRoot;
    }

    return undefined;
  };

  #moveToAnchorRoot = (anchorElement: HTMLElement, anchorRoot?: ShadowRoot): boolean => {
    const root = anchorRoot ?? this.#findAssignedSlotRoot(anchorElement, []);

    if (root && this.getRootNode() !== root) {
      root.append(this);
      return true;
    }

    return false;
  };

  #canMoveToAnchorRoot = (anchorElement: HTMLElement): boolean => {
    const proxyTarget = (anchorElement as Element & { getProxyTarget?(): Element | null }).getProxyTarget?.(),
      internals = (anchorElement as HTMLElement & { internals?: ElementInternals }).internals,
      hasExplicitRelation =
        this.#explicitRelationAnchors.has(anchorElement) ||
        this.#hasAnyExplicitRelation(anchorElement) ||
        this.#hasAnyExplicitRelation(proxyTarget);

    if (internals) {
      return true;
    }

    return !hasExplicitRelation;
  };

  #syncSlotWithAnchor = (anchorElement: HTMLElement, movedToAnchorRoot: boolean): void => {
    if (movedToAnchorRoot) {
      this.removeAttribute('slot');
      return;
    }

    const anchorSlot = anchorElement.getAttribute('slot');

    if (typeof anchorSlot === 'string' && anchorSlot.length > 0) {
      this.setAttribute('slot', anchorSlot);
    } else {
      this.removeAttribute('slot');
    }
  };

  #ensureTooltipInList = (elements: readonly Element[] | null | undefined): Element[] => {
    const list = elements ? Array.from(elements) : [];

    return list.includes(this) ? list : [...list, this];
  };

  #requiresFullAnchorDiscovery = (anchorElement: HTMLElement): boolean => {
    const proxyTarget = (anchorElement as Element & { getProxyTarget?(): Element | null }).getProxyTarget?.(),
      internals = (anchorElement as HTMLElement & { internals?: ElementInternals }).internals;

    if (this.#hasAnyExplicitRelation(anchorElement)) {
      return false;
    }

    return (
      this.#hasAnyExplicitRelation(proxyTarget) ||
      this.#hasAnyReflectedRelation(anchorElement) ||
      this.#hasAnyReflectedRelation(proxyTarget) ||
      this.#hasAnyReflectedRelation(internals)
    );
  };

  /**
   * Prefer already-known anchors and explicit ARIA selectors before falling back to
   * a full scan. This keeps repeated hover/focus updates cheap in the common case.
   */
  #collectCheapMatchingAnchors = (anchorElement: HTMLElement): Set<HTMLElement> => {
    const anchors = new Set<HTMLElement>([anchorElement]);

    for (const knownAnchor of this.#getKnownAnchors()) {
      if (this.#matchesAnchor(knownAnchor)) {
        anchors.add(this.#normalizeAnchorElement(knownAnchor));
      }
    }

    for (const root of this.#getAnchorSearchRoots()) {
      for (const ariaAnchor of this.#getAriaAnchors(root)) {
        if (this.#matchesAnchor(ariaAnchor)) {
          anchors.add(this.#normalizeAnchorElement(ariaAnchor));
        }
      }
    }

    return anchors;
  };

  /**
   * Before moving the tooltip into another root, collect every anchor that currently
   * matches it. Shared anchors that rely on forwarded/reflected ARIA can lose their
   * ID-based relation once the tooltip leaves the original root, so we mirror the
   * relation onto all of them in one pass.
   */
  #collectMatchingAnchors = (anchorElement: HTMLElement): HTMLElement[] => {
    const anchors = this.#collectCheapMatchingAnchors(anchorElement);

    if (anchors.size === 1 && this.#requiresFullAnchorDiscovery(anchorElement)) {
      for (const root of this.#getAnchorSearchRoots()) {
        for (const element of Array.from(root.querySelectorAll('*'))) {
          if (element instanceof HTMLElement && this.#matchesAnchor(element)) {
            anchors.add(this.#normalizeAnchorElement(element));
          }
        }
      }
    }

    return Array.from(anchors);
  };

  #rememberAnchorRelation = (anchorElement: HTMLElement): void => {
    const proxyTarget = (anchorElement as Element & { getProxyTarget?(): Element | null }).getProxyTarget?.();

    if (this.#hasAnyExplicitRelation(anchorElement) || this.#hasAnyExplicitRelation(proxyTarget)) {
      this.#explicitRelationAnchors.add(anchorElement);
    }
  };

  #getElementRelationTargets = (
    anchorElement: HTMLElement,
    proxyTarget: Element | null | undefined,
    relation: 'description' | 'label'
  ): Element[] => {
    const attribute = relation === 'label' ? 'aria-labelledby' : 'aria-describedby',
      targets = new Set<Element>();

    if (this.#hasExplicitRelation(anchorElement, attribute) || this.#hasReflectedRelation(anchorElement, relation)) {
      targets.add(anchorElement);
    }

    if (
      proxyTarget instanceof Element &&
      proxyTarget !== anchorElement &&
      (this.#hasExplicitRelation(proxyTarget, attribute) || this.#hasReflectedRelation(proxyTarget, relation))
    ) {
      targets.add(proxyTarget);
    }

    if (targets.size > 0) {
      return Array.from(targets);
    }

    return proxyTarget instanceof Element && proxyTarget !== anchorElement ? [proxyTarget] : [anchorElement];
  };

  #setReflectedRelation = (
    target:
      | {
          ariaDescribedByElements?: readonly Element[] | null;
          ariaLabelledByElements?: readonly Element[] | null;
        }
      | null
      | undefined,
    relation: 'description' | 'label'
  ): void => {
    if (!target) {
      return;
    }

    if (relation === 'label') {
      (target as { ariaLabelledByElements: Element[] | null }).ariaLabelledByElements = this.#ensureTooltipInList(
        target.ariaLabelledByElements
      );
      return;
    }

    (target as { ariaDescribedByElements: Element[] | null }).ariaDescribedByElements = this.#ensureTooltipInList(
      target.ariaDescribedByElements
    );
  };

  /**
   * Checks the raw ARIA attributes because they preserve the original author intent:
   * whether the tooltip should behave as a label or as a description.
   */
  #hasExplicitRelation = (
    element: Element | null | undefined,
    attribute: 'aria-describedby' | 'aria-labelledby'
  ): boolean =>
    typeof this.id === 'string' &&
    typeof element?.getAttribute(attribute) === 'string' &&
    element.getAttribute(attribute)!.split(/\s+/).includes(this.id);

  /**
   * Checks reflected element lists used by native ARIA reflection APIs and ElementInternals.
   * We use this after explicit attributes because these lists do not tell us who set them first.
   */
  #hasReflectedRelation = (
    target:
      | {
          ariaDescribedByElements?: readonly Element[] | null;
          ariaLabelledByElements?: readonly Element[] | null;
        }
      | null
      | undefined,
    relation: 'description' | 'label'
  ): boolean => {
    const elements = relation === 'label' ? target?.ariaLabelledByElements : target?.ariaDescribedByElements;

    return !!elements?.includes(this);
  };

  #hasAnyExplicitRelation = (element: Element | null | undefined): boolean =>
    this.#hasExplicitRelation(element, 'aria-describedby') || this.#hasExplicitRelation(element, 'aria-labelledby');

  #hasAnyReflectedRelation = (
    target:
      | {
          ariaDescribedByElements?: readonly Element[] | null;
          ariaLabelledByElements?: readonly Element[] | null;
        }
      | null
      | undefined
  ): boolean => this.#hasReflectedRelation(target, 'description') || this.#hasReflectedRelation(target, 'label');

  /**
   * When the tooltip moves into the anchor's shadow root, it can no longer rely on the host's
   * original ARIA wiring alone. This method mirrors the existing relation onto ElementInternals
   * when available, and otherwise falls back to native ARIA reflection on the anchor/proxy
   * element without dropping any previously registered labels/descriptions.
   */
  #preserveAnchorRelation = (anchorElement: HTMLElement): void => {
    const proxyTarget = (anchorElement as Element & { getProxyTarget?(): Element | null }).getProxyTarget?.(),
      internals = (anchorElement as HTMLElement & { internals?: ElementInternals }).internals;
    let relation: 'description' | 'label' = 'description';

    if (
      this.#hasExplicitRelation(anchorElement, 'aria-labelledby') ||
      this.#hasExplicitRelation(proxyTarget, 'aria-labelledby')
    ) {
      relation = 'label';
    } else if (
      this.#hasExplicitRelation(anchorElement, 'aria-describedby') ||
      this.#hasExplicitRelation(proxyTarget, 'aria-describedby')
    ) {
      relation = 'description';
    } else if (
      anchorElement.ariaLabelledByElements?.includes(this) ||
      proxyTarget?.ariaLabelledByElements?.includes(this) ||
      internals?.ariaLabelledByElements?.includes(this)
    ) {
      relation = 'label';
    } else if (
      anchorElement.ariaDescribedByElements?.includes(this) ||
      proxyTarget?.ariaDescribedByElements?.includes(this) ||
      internals?.ariaDescribedByElements?.includes(this)
    ) {
      relation = 'description';
    }

    if (internals) {
      this.#setReflectedRelation(internals, relation);
      return;
    }

    for (const target of this.#getElementRelationTargets(anchorElement, proxyTarget, relation)) {
      this.#setReflectedRelation(target, relation);
    }
  };

  #hideTooltip = (): void => {
    this.hidePopover();
    this.#openedByFocus = false;
  };

  #isInsideNestedOpenPopover = (event: Event, anchorElement: HTMLElement): boolean => {
    const path = event.composedPath(),
      anchorIndex = path.findIndex(el => el === anchorElement);

    if (anchorIndex === -1) {
      return false;
    }

    return path.some(
      (el, index) => index < anchorIndex && el instanceof HTMLElement && el !== this && isPopoverOpen(el)
    );
  };

  /**
   * Checks whether an element is connected to this tooltip through any supported ARIA wiring
   * (attributes, reflected ARIA element lists, forwarded proxy targets, or ElementInternals).
   * This is the core anchor-matching predicate used across hover/focus handling.
   */
  #matchesAnchor = (element: Element): boolean => {
    if (!this.id || !element || element.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    if (this.#hasAnyExplicitRelation(element) || this.#hasAnyReflectedRelation(element)) {
      return true;
    }

    // Support components that forward ARIA to an internal proxy target (e.g. ForwardAriaMixin).
    const proxyTarget = (element as Element & { getProxyTarget?(): Element | null }).getProxyTarget?.();
    if (proxyTarget instanceof Element && proxyTarget !== element) {
      if (this.#hasAnyExplicitRelation(proxyTarget) || this.#hasAnyReflectedRelation(proxyTarget)) {
        return true;
      }
    }

    // Check ElementInternals ariaDescribedByElements and ariaLabelledByElements
    // This handles cases where elements use ElementInternals to connect to the tooltip across shadow DOM boundaries
    const internals = (element as HTMLElement & { internals?: ElementInternals }).internals;

    return this.#hasAnyReflectedRelation(internals);
  };

  /**
   * Normalizes an internal proxy target back to the public host element when both represent
   * the same anchor. This keeps `anchorElement` stable for consumers and tests, even when
   * ARIA is forwarded to an internal control inside the component's shadow DOM.
   */
  #normalizeAnchorElement = (element: HTMLElement): HTMLElement => {
    let normalized = element;

    while (true) {
      const rootNode = this.#getShadowRoot(normalized.getRootNode());
      if (!rootNode) {
        return normalized;
      }

      const host = rootNode.host;
      const proxyTarget = (host as HTMLElement & { getProxyTarget?(): Element | null }).getProxyTarget?.();

      if (host instanceof HTMLElement && proxyTarget === normalized && this.#matchesAnchor(host)) {
        normalized = host;
        continue;
      }

      return normalized;
    }
  };

  #showTooltip = (element: HTMLElement, openedByFocus = false, anchorRoot?: ShadowRoot): void => {
    const normalizedElement = this.#normalizeAnchorElement(element);
    const wasOpen = isPopoverOpen(this),
      anchorChanged = this.anchorElement !== normalizedElement,
      targetAnchorRoot = this.#resolveAnchorRoot(normalizedElement, anchorRoot),
      canMoveToAnchorRoot = !!targetAnchorRoot && this.#canMoveToAnchorRoot(normalizedElement),
      anchorsToPreserve = canMoveToAnchorRoot ? this.#collectMatchingAnchors(normalizedElement) : [normalizedElement],
      currentTooltipRoot = this.getRootNode(),
      wasReparentedFromOriginalRoot = !!this.#originalRoot && currentTooltipRoot !== this.#originalRoot;

    for (const anchor of anchorsToPreserve) {
      this.#rememberAnchorRelation(anchor);
    }

    if (canMoveToAnchorRoot) {
      this.#moveToAnchorRoot(normalizedElement, targetAnchorRoot);
    } else if (
      wasReparentedFromOriginalRoot &&
      currentTooltipRoot !== normalizedElement.getRootNode() &&
      normalizedElement.parentElement
    ) {
      normalizedElement.insertAdjacentElement('afterend', this);
    }

    const isInAnchorRoot = !!targetAnchorRoot && this.getRootNode() === targetAnchorRoot;

    this.#openedByFocus = openedByFocus;
    this.anchorElement = normalizedElement;
    this.#knownAnchors.add(normalizedElement);
    this.#syncSlotWithAnchor(normalizedElement, isInAnchorRoot);

    if (isInAnchorRoot) {
      for (const anchor of anchorsToPreserve) {
        this.#knownAnchors.add(anchor);
        this.#stableAnchors.add(anchor);
        this.#preserveAnchorRelation(anchor);
      }
    }

    if (!wasOpen || !isPopoverOpen(this)) {
      this.showPopover();
    } else if (anchorChanged) {
      this.#anchor.updatePosition();
    } else {
      return;
    }

    requestAnimationFrame(() => {
      this.#calculateSafeTriangle();
    });
  };
}
