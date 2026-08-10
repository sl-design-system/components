import { localized, msg } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { RovingTabindexController } from '@sl-design-system/shared';
import { Tooltip } from '@sl-design-system/tooltip';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './tag-list.scss.js';
import { type SlRemoveEvent, Tag, type TagSize, type TagVariant } from './tag.js';

const SUBPIXEL_BUFFER_PX = 0.5;

declare global {
  interface HTMLElementTagNameMap {
    'sl-tag-list': TagList;
  }
}

/**
 * A tag list component that can contain tags.
 *
 * ```html
 * <sl-tag-list>
 *   <sl-tag>First tag</sl-tag>
 *   <sl-tag>Second tag</sl-tag>
 *   ...
 * </sl-tag-list>
 * ```
 *
 * @slot default - The place for tags.
 */
@localized()
export class TagList extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();

    // Default to unresolved so stacked lists stay hidden until first stable
    // visibility calculation completes.
    this.removeAttribute('data-visibility-resolved');
  }

  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-tag': Tag,
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Timer used for breaking a possible resize observer loop. */
  #breakResizeObserverLoop?: ReturnType<typeof setTimeout>;

  /** Tracks whether the first visibility resolution already happened. */
  #hasResolvedInitialVisibility = false;

  /** Animation frame used to batch slot-change visibility updates. */
  #scheduleVisibilityUpdate?: number;

  /** Animation frame used to run an additional initial stabilization pass. */
  #initialVisibilityPassFrame?: number;

  /** Whether the roving tabindex controller is currently listening for keyboard navigation. */
  #rovingTabindexManaged = true;

  /** Original disabled state of tags temporarily disabled through the tag list. */
  #tagDisabledState = new WeakMap<Tag, boolean | undefined>();

  /** Number of completed passes before the initial visibility is considered stable. */
  #initialVisibilityPasses = 0;

  /** Currently observed stack element, if stacked mode is active. */
  #observedStack?: HTMLElement;

  /**
   * Stacked lists stay hidden until the first visibility calculation settles. These helpers keep
   * that initial render stable and ensure the resize observer follows only the currently rendered
   * stack element.
   */
  #isStackedActive(): boolean {
    return this.stacked || this.hasAttribute('stacked');
  }

  /** Expose stacked tag list only after initial visibility has been resolved. */
  #syncInitialVisibilityState(): void {
    this.toggleAttribute(
      'data-visibility-resolved',
      !this.#isStackedActive() || this.#hasResolvedInitialVisibility
    );
  }

  /** Restart the initial visibility flow whenever stacked mode needs a fresh layout pass. */
  #resetInitialVisibilityState(): void {
    this.#hasResolvedInitialVisibility = false;
    this.#initialVisibilityPasses = 0;
    this.#syncInitialVisibilityState();

    if (this.#initialVisibilityPassFrame !== undefined) {
      cancelAnimationFrame(this.#initialVisibilityPassFrame);
      this.#initialVisibilityPassFrame = undefined;
    }
  }

  /** Keep the ResizeObserver subscribed to the current stack element only. */
  #syncStackObservation(): void {
    const nextObservedStack = this.stacked ? this.stack : undefined;

    if (this.#observedStack === nextObservedStack) {
      return;
    }

    if (this.#observedStack) {
      this.#resizeObserver.unobserve(this.#observedStack);
    }

    if (nextObservedStack) {
      this.#resizeObserver.observe(nextObservedStack);
    }

    this.#observedStack = nextObservedStack;
  }

  /**
   * Observe size changes so we can determine when to display a counter with the amount of hidden
   * tags.
   */
  #resizeObserver = new ResizeObserver(entries => this.#onResize(entries));

  /** Manage keyboard navigation between tags. */
  #rovingTabindexController = new RovingTabindexController<Tag>(this, {
    direction: 'horizontal',
    focusInIndex: (elements: Tag[]) => {
      const index = elements.findIndex(el => this.#isFocusableElement(el));

      return index === -1 ? 0 : index;
    },
    elements: () => {
      if (!this.keyboardNavigation) {
        return [];
      }

      const stackTags =
        this.stacked &&
        this.stackTag &&
        this.stackTag.style.display !== 'none' &&
        this.#isFocusableElement(this.stackTag)
          ? [this.stackTag]
          : [];

      return [
        ...stackTags,
        ...(this.tags ?? []).filter(t => t.style.display !== 'none' && !!t.removable)
      ];
    },
    isFocusableElement: (el: Tag) => this.#isFocusableElement(el)
  });

  /** Disables removable tags in the tag list. */
  @property({ type: Boolean }) disabled?: boolean;

  /** @internal Whether the tag list manages keyboard navigation between removable tags. */
  @property({ attribute: false }) keyboardNavigation = true;

  /**
   * The size of the tag-list (determines size of tags inside the tag-list).
   *
   * @default 'md'
   */
  @property() size?: TagSize;

  /** @internal The stack element. */
  @query('.stack') stack?: HTMLElement;

  /** @internal The inline size of the stack element. */
  stackInlineSize = 0;

  /**
   * This will hide tags that do not fit inside the available space when set. It will also display a
   * counter that indicates the number of hidden tags.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) stacked?: boolean;

  /** @internal The number of stacked tags. Applicable only when `stacked` is set. */
  @state() stackSize = 0;

  /** @internal The tag used to display the stack. */
  @query('sl-tag') stackTag?: Tag;

  /** @internal The slotted tags. */
  @state() tags: Tag[] = [];

  /**
   * The variant of the tag-list and tags inside.
   *
   * @default 'neutral'
   */
  @property({ reflect: true }) variant?: TagVariant;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'list');
    this.#resetInitialVisibilityState();
    this.#syncStackObservation();

    this.#resizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    this.#resizeObserver.disconnect();
    this.#observedStack = undefined;

    if (this.#breakResizeObserverLoop) {
      clearTimeout(this.#breakResizeObserverLoop);
      this.#breakResizeObserverLoop = undefined;
    }

    if (this.#scheduleVisibilityUpdate !== undefined) {
      cancelAnimationFrame(this.#scheduleVisibilityUpdate);
      this.#scheduleVisibilityUpdate = undefined;
    }

    if (this.#initialVisibilityPassFrame !== undefined) {
      cancelAnimationFrame(this.#initialVisibilityPassFrame);
      this.#initialVisibilityPassFrame = undefined;
    }

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    this.#syncTags();

    if (changes.has('keyboardNavigation')) {
      this.#rovingTabindexController.clearElementCache();

      if (!this.keyboardNavigation) {
        this.#clearManagedTabindexes();
      }
    }

    this.#syncRovingTabindexController();

    if (changes.has('stacked')) {
      if (this.stacked && this.stack) {
        this.#resetInitialVisibilityState();
      } else {
        this.#resetInitialVisibilityState();
        this.stackSize = 0;
        this.removeAttribute('data-stacked-active');
        this.tags.forEach(tag => (tag.style.display = ''));
      }
    }

    this.#syncStackObservation();
  }

  override render(): TemplateResult {
    const hiddenTagsDescription =
      this.stacked && this.stackSize > 0 ? this.#getHiddenTagsDescription() : '';

    return html`
      ${this.stacked
        ? html`
            <sl-tag
              .tooltip=${hiddenTagsDescription}
              class="stack"
              role="listitem"
              size=${ifDefined(this.size)}
              variant=${ifDefined(this.variant)}>
              +${this.stackSize}
            </sl-tag>
          `
        : nothing}
      <div @sl-remove=${this.#onRemove} class="list">
        <slot @slotchange=${this.#onSlotChange}></slot>
      </div>
    `;
  }

  #getHiddenTagsDescription(): string {
    const labels = this.tags
      .filter(tag => tag.style.display === 'none')
      .map(tag => tag.label)
      .join(', ');

    return `${msg('List of hidden elements', { id: 'sl.tag.listOfHiddenElements' })}: ${labels}`;
  }

  #onRemove(event: SlRemoveEvent & { target: Tag }): void {
    const elements = this.#rovingTabindexController.elements,
      index = elements.indexOf(event.target as Tag),
      nextIndex = index === 0 ? 1 : index - 1,
      nextFocusableTag = elements[nextIndex];

    if (!nextFocusableTag) {
      return;
    }

    this.#rovingTabindexController.focusToElement(nextFocusableTag);
  }

  #isUnknownArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
  }

  #isResizeObserverSize(value: unknown): value is { inlineSize: number } {
    if (typeof value !== 'object' || value === null || !('inlineSize' in value)) {
      return false;
    }

    const inlineSize = (value as { inlineSize: unknown }).inlineSize;

    return typeof inlineSize === 'number';
  }

  #isFocusableElement(el: Tag): boolean {
    return el === this.stackTag || !el.disabled || !!el.removable;
  }

  #getBorderBoxInlineSize(entry: ResizeObserverEntry): number | undefined {
    const borderBoxSize = (entry as { borderBoxSize?: unknown }).borderBoxSize;

    if (this.#isUnknownArray(borderBoxSize)) {
      const firstSize = borderBoxSize[0];

      return this.#isResizeObserverSize(firstSize) ? firstSize.inlineSize : undefined;
    }

    return this.#isResizeObserverSize(borderBoxSize) ? borderBoxSize.inlineSize : undefined;
  }

  #onResize(entries: ResizeObserverEntry[]): void {
    const stackEntry = entries.find(entry => entry.target === this.stack),
      // Use border-box width, not content-box width, so layout-affecting box size
      // is accounted for when computing available space for visible tags.
      stackInlineSize = stackEntry
        ? (this.#getBorderBoxInlineSize(stackEntry) ?? stackEntry.contentRect.width)
        : undefined;

    if (stackInlineSize && stackInlineSize !== this.stackInlineSize) {
      this.stackInlineSize = stackInlineSize;

      // Reset the timeout, so it always ends with visible stack
      if (this.#breakResizeObserverLoop) {
        clearTimeout(this.#breakResizeObserverLoop);
        this.#breakResizeObserverLoop = undefined;
      }
    } else if (this.#breakResizeObserverLoop) {
      return;
    }

    // Resolve the first visual state synchronously so screenshot tooling captures
    // the final stacked state instead of the transient pre-stack state.
    if (!this.#hasResolvedInitialVisibility) {
      this.#runVisibilityUpdate();
      return;
    }

    // Break the loop if it keeps switching between stack visibility; workaround
    // is to just wait a little bit before updating the visibility again.
    this.#breakResizeObserverLoop = setTimeout(() => {
      this.#runVisibilityUpdate();
      this.#breakResizeObserverLoop = undefined;
    }, 50);
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.tags.forEach(tag => {
      tag.navigationDescription = undefined;
      this.#restoreTagDisabledState(tag);
      tag.removeAttribute('role');
    });

    this.tags = Array.from(event.target.assignedElements({ flatten: true })).filter(
      (el): el is Tag => el instanceof Tag
    );

    this.#syncTags();

    this.#clearRovingTabindexCache();

    // Resolve the first layout immediately, without timers.
    if (!this.#hasResolvedInitialVisibility) {
      this.#runVisibilityUpdate();
      return;
    }

    if (this.#scheduleVisibilityUpdate !== undefined) {
      cancelAnimationFrame(this.#scheduleVisibilityUpdate);
    }

    this.#scheduleVisibilityUpdate = requestAnimationFrame(() => {
      this.#runVisibilityUpdate();
      this.#scheduleVisibilityUpdate = undefined;
    });
  }

  #syncTags(): void {
    const navigationDescription = msg('Use arrow keys to move between removable tags.', {
      id: 'sl.tagList.navigationInstructions'
    });

    this.tags.forEach(tag => {
      tag.navigationDescription =
        this.keyboardNavigation && tag.removable ? navigationDescription : undefined;
      this.#syncTagDisabledState(tag);
      tag.size = this.size;
      tag.variant = this.variant;
      tag.setAttribute('role', 'listitem');
    });
  }

  #syncTagDisabledState(tag: Tag): void {
    if (this.disabled && tag.removable) {
      if (!this.#tagDisabledState.has(tag)) {
        this.#tagDisabledState.set(tag, tag.disabled);
      }

      tag.disabled = true;
    } else {
      this.#restoreTagDisabledState(tag);
    }
  }

  #restoreTagDisabledState(tag: Tag): void {
    if (!this.#tagDisabledState.has(tag)) {
      return;
    }

    tag.disabled = this.#tagDisabledState.get(tag);
    this.#tagDisabledState.delete(tag);
  }

  #runVisibilityUpdate(): void {
    if (this.stack) {
      const measuredStackInlineSize = this.stack.getBoundingClientRect().width;

      if (measuredStackInlineSize > 0) {
        this.stackInlineSize = measuredStackInlineSize;
      }
    }

    this.#updateVisibility();

    if (!this.#hasResolvedInitialVisibility && this.stacked && this.tags.length > 0) {
      this.#initialVisibilityPasses += 1;

      if (this.#initialVisibilityPasses >= 2) {
        this.#hasResolvedInitialVisibility = true;
      } else {
        this.#initialVisibilityPassFrame = requestAnimationFrame(() => {
          this.#initialVisibilityPassFrame = undefined;
          this.#runVisibilityUpdate();
        });
      }
    }

    this.#syncInitialVisibilityState();
  }

  #updateVisibility(): void {
    if (!this.stacked || !this.stack || !this.tags) {
      return;
    }

    const styles = getComputedStyle(this),
      // Use inline-axis gap for width calculations.
      // When `gap` has two values (row column), parsing `gap` directly can pick the wrong one.
      gapValue = styles.columnGap && styles.columnGap !== 'normal' ? styles.columnGap : styles.gap;
    let gap = Number.parseFloat(gapValue);

    if (!Number.isFinite(gap)) {
      gap = 0;
    }

    // Lock current width while measuring with all tags visible.
    // Without this, the element can expand during measurement and cause oscillation/flicker.
    const originalInlineSize = this.style.inlineSize;

    let sizes: number[] = [],
      totalTagsWidth = 0,
      availableWidth = 0;

    try {
      // Reset visibility of all tags
      this.tags.forEach(tag => (tag.style.display = ''));

      // Measure available width after restoring tag visibility.
      // This prevents the layout from getting stuck in a collapsed width that
      // was based on a previous stacked state.
      availableWidth = this.getBoundingClientRect().width;
      this.style.inlineSize = `${availableWidth}px`;

      sizes = this.tags.map(t => t.getBoundingClientRect().width);

      // Calculate the total width of all tags
      totalTagsWidth = sizes.reduce((acc, size) => acc + size, 0);
      totalTagsWidth += gap * (this.tags.length - 1);
    } finally {
      this.style.inlineSize = originalInlineSize;
    }

    // We only need to determine visibility if there isn't enough space.
    // We use a small buffer to account for sub-pixel rounding
    // errors that can cause layout oscillation at certain zoom levels.
    if (totalTagsWidth > availableWidth + SUBPIXEL_BUFFER_PX) {
      // Take the stack into account if there isn't enough space
      availableWidth -= this.stackInlineSize + gap;

      for (let i = 0; i < this.tags.length; i++) {
        const isLastTag = i === this.tags.length - 1;

        // Keep at least one actual tag visible next to the stack counter. Otherwise users only see
        // the number of hidden tags without any selected value context.
        if (isLastTag) {
          break;
        }

        totalTagsWidth -= sizes[i] + (isLastTag ? 0 : gap);
        this.tags[i].style.display = 'none';

        if (totalTagsWidth <= availableWidth + SUBPIXEL_BUFFER_PX) {
          break;
        }
      }
    }

    // Excluded tags are not taken into account for rovingTabindex, so there is a tabindex 0 left,
    // when we exclude them, we need to set tabindex -1 explicitly.
    this.tags.forEach(tag => {
      if (tag.style.display === 'none') {
        tag.tabIndex = -1;
      }
    });

    // Calculate the stack size based on the visibility of the tags
    this.stackSize = this.tags.reduce(
      (acc, tag) => (tag.style.display === 'none' ? acc + 1 : acc),
      0
    );
    this.toggleAttribute('data-stacked-active', this.stackSize > 0);
    this.stack.style.display = this.stackSize === 0 ? 'none' : '';
    // Ensure legacy decoration classes are not kept on existing elements (e.g. after HMR).
    this.stack.classList.remove('double', 'triple');

    const stackTag = this.stack.querySelector('sl-tag');

    if (stackTag) {
      stackTag.style.display = this.stackSize === 0 ? 'none' : '';
    }

    // Now that we updated the visibility of the tags, we need to clear the element cache
    this.#clearRovingTabindexCache();
  }

  #clearRovingTabindexCache(): void {
    this.#rovingTabindexController.clearElementCache();
    this.#syncRovingTabindexController();
  }

  #clearManagedTabindexes(): void {
    this.tags.forEach(tag => {
      tag.removeAttribute('tabindex');
      tag.requestUpdate();
    });

    if (this.stackTag) {
      this.stackTag.removeAttribute('tabindex');
      this.stackTag.requestUpdate();
    }
  }

  #syncRovingTabindexController(): void {
    const hasManagedElements =
      this.keyboardNavigation && this.#rovingTabindexController.elements.length > 0;

    if (hasManagedElements && !this.#rovingTabindexManaged) {
      this.#rovingTabindexController.manage();
      this.#rovingTabindexManaged = true;
    } else if (!hasManagedElements && this.#rovingTabindexManaged) {
      this.#rovingTabindexController.unmanage();
      this.#rovingTabindexManaged = false;
    }
  }
}
