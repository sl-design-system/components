import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { RovingTabindexController } from '@sl-design-system/shared';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './tag-list.scss.js';
import { Tag, type TagSize, type TagVariant } from './tag.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tag-list': TagList;
  }
}

/**
 * A tag list component that can contain tags.
 *
 * ```html
 *   <sl-tag-list>
 *     <sl-tag>First tag</sl-tag>
 *     <sl-tag>Second tag</sl-tag>
 *     ...
 *   </sl-tag-list>
 * ```
 *
 * @slot default - The place for tags.
 */
@localized()
export class TagList extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-tag': Tag,
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * Observe size changes so we can determine when to display a counter
   * with the amount of hidden tags.
   */
  #resizeObserver = new ResizeObserver(entries => this.#onResize(entries));

  // /** Manage keyboard navigation between tags. */
  #rovingTabindexController = new RovingTabindexController<Tag>(this, {
    direction: 'horizontal',
    focusInIndex: (elements: Tag[]) => elements.findIndex(el => !el.disabled),
    elements: () => [
      ...(this.stackTag ? [this.stackTag] : []),
      ...(this.tags ?? []).filter(t => t.style.display !== 'none' && t.removable)
    ],
    isFocusableElement: (el: Tag) => !el.disabled
  });

  /**
   * The size of the tag-list (determines size of tags inside the tag-list).
   * @default 'md'
   */
  @property() size?: TagSize;

  /** @internal The stack element. */
  @query('.stack') stack?: HTMLElement;

  /** @internal The inline size of the stack element. */
  stackInlineSize = 0;

  /**
   * This will hide tags that do not fit inside the available space when set. It will also
   * display a counter that indicates the number of hidden tags.
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
   * @default 'neutral'
   */
  @property({ reflect: true }) variant?: TagVariant;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'list');

    // Calculate the max inline size of the stack *before* we start the observer
    // this.#maxStackInlineSize = await this.#getMaxStackInlineSize();

    this.#resizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    this.#resizeObserver.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('size')) {
      this.tags?.forEach(tag => (tag.size = this.size));
    }

    if (changes.has('stacked')) {
      if (this.stacked && this.stack) {
        this.#resizeObserver.observe(this.stack);
      } else {
        this.tags.forEach(tag => (tag.style.display = ''));
      }
    }

    if (changes.has('variant')) {
      this.tags?.forEach(tag => (tag.variant = this.variant));
    }
  }

  override render(): TemplateResult {
    return html`
      ${this.stacked
        ? html`
            <div class="stack">
              <sl-tag
                aria-labelledby="tooltip"
                size=${ifDefined(this.size)}
                tabindex="0"
                variant=${ifDefined(this.variant)}
              >
                +${Math.min(this.stackSize, 99)}
              </sl-tag>
              <sl-tooltip id="tooltip" position="bottom" max-width="300">
                ${msg('List of hidden elements')}:
                ${this.tags
                  .filter(tag => tag.style.display === 'none')
                  .map(tag => tag.label)
                  .join(', ')}
              </sl-tooltip>
            </div>
          `
        : nothing}
      <div class="list">
        <slot @slotchange=${this.#onSlotChange}></slot>
      </div>
    `;
  }

  #onResize(entries: ResizeObserverEntry[]): void {
    const stackEntry = entries.find(entry => entry.target === this.stack);
    if (stackEntry) {
      this.stackInlineSize = stackEntry.contentRect.width;
    }

    this.#updateVisibility();
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.tags = Array.from(event.target.assignedElements({ flatten: true })).filter(
      (el): el is Tag => el instanceof Tag
    );

    this.tags.forEach(tag => {
      tag.size = this.size;
      tag.variant = this.variant;
      tag.setAttribute('role', 'listitem');
    });

    this.#rovingTabindexController.clearElementCache();

    requestAnimationFrame(() => this.#updateVisibility());
  }

  #updateVisibility(): void {
    if (!this.stacked || !this.tags) {
      return;
    }

    // Reset visibility of all tags
    this.tags.forEach(tag => (tag.style.display = ''));

    const gap = parseInt(getComputedStyle(this).gap),
      sizes = this.tags.map(t => t.getBoundingClientRect().width);

    // Calculate the total width of all tags
    let totalTagsWidth = sizes.reduce((acc, size) => acc + size, 0);
    totalTagsWidth += gap * (this.tags.length - 1);

    let availableWidth = this.getBoundingClientRect().width;

    // We only need to determine visibility if there isn't enough space
    if (totalTagsWidth > availableWidth) {
      // Take the stack into account if there isn't enough space
      availableWidth -= this.stackInlineSize + gap;

      for (let i = 0; i < this.tags.length; i++) {
        totalTagsWidth -= sizes[i] + gap;
        this.tags[i].style.display = 'none';

        if (totalTagsWidth <= availableWidth) {
          break;
        }
      }
    }

    // Calculate the stack size based on the visibility of the tags
    this.stackSize = this.tags.reduce((acc, tag) => (tag.style.display === 'none' ? acc + 1 : acc), 0);

    // Now that we updated the visibility of the tags, we need to clear the element cache
    this.#rovingTabindexController.clearElementCache();
  }
}
