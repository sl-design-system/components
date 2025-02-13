import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { RovingTabindexController } from '@sl-design-system/shared';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
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

  /** The maximum width of the +99 stack counter; used for calculating the (in)visible tags. */
  #maxStackInlineSize = 0;

  /**
   * Observe changes to the size of the tag-list so we can determine when to display
   * a counter with amount of hidden tags.
   */
  #resizeObserver = new ResizeObserver(() => this.#updateVisibility());

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

  /** The size of the tag-list (determines size of tags inside the tag-list). Defaults to `md`. */
  @property() size?: TagSize;

  /**
   * This will hide tags that do not fit inside the available space when set. It will also
   * display a counter that indicates the number of hidden tags.
   */
  @property({ type: Boolean, reflect: true }) stacked?: boolean;

  /** @internal The number of stacked tags. Applicable only in the `stacked` version. */
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

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    this.setAttribute('role', 'list');

    // Calculate the max inline size of the stack *before* we start the observer
    this.#maxStackInlineSize = await this.#getMaxStackInlineSize();

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

    if (changes.has('stacked') && !this.stacked) {
      this.tags.forEach(tag => (tag.style.display = ''));
    }

    if (changes.has('variant')) {
      this.tags?.forEach(tag => (tag.variant = this.variant));
    }
  }

  override render(): TemplateResult {
    return html`
      ${this.stacked && this.stackSize > 0
        ? html`
            <div class=${classMap({ stack: true, double: this.stackSize === 2, triple: this.stackSize >= 3 })}>
              <sl-tag
                aria-labelledby="tooltip"
                size=${ifDefined(this.size)}
                tabindex="0"
                variant=${ifDefined(this.variant)}
              >
                ${this.stackSize > 99 ? '+99' : this.stackSize}
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

    // Hide the stack element while we calculate the visibility of the tags
    const stack = this.renderRoot.querySelector<HTMLElement>('.stack');
    if (stack) {
      stack.style.display = 'none';
    }

    // Reset visibility of all tags
    this.tags.forEach(tag => (tag.style.display = ''));

    const gap = parseInt(getComputedStyle(this).getPropertyValue('--_gap') || '0'),
      sizes = this.tags.map(t => t.getBoundingClientRect().width);

    // Calculate the total width of all tags
    let totalTagsWidth = sizes.reduce((acc, size) => acc + size, 0);
    totalTagsWidth += gap * (this.tags.length - 1);

    let availableWidth = this.getBoundingClientRect().width;

    // We only need to determine visibility if there isn't enough space
    if (totalTagsWidth > availableWidth) {
      // Take the stack into account if there isn't enough space
      availableWidth -= this.#maxStackInlineSize + gap;

      for (let i = 0; i < this.tags.length; i++) {
        totalTagsWidth -= sizes[i] + gap;
        this.tags[i].style.display = 'none';

        if (totalTagsWidth <= availableWidth) {
          break;
        }
      }
    }

    // Reset the stack element visibility
    if (stack) {
      stack.style.display = '';
    }

    // Calculate the stack size based on the visibility of the tags
    this.stackSize = this.tags.reduce((acc, tag) => (tag.style.display === 'none' ? acc + 1 : acc), 0);

    // Now that we updated the visibility of the tags, we need to clear the element cache
    this.#rovingTabindexController.clearElementCache();
  }

  /** This returns the max inline size of the stack (so with a stack size of > 99). */
  async #getMaxStackInlineSize(): Promise<number> {
    const oldStackSize = this.stackSize;

    // Set max stack size and wait for the browser to update the DOM
    this.stackSize = 100;
    await new Promise(resolve => requestAnimationFrame(resolve));

    // Get the max inline size of the stack
    const maxStackInlineSize = this.renderRoot.querySelector('.stack')?.getBoundingClientRect()?.width ?? 0;

    // Restore the stack size and wait for the browser to update the DOM
    this.stackSize = oldStackSize;
    await new Promise(resolve => requestAnimationFrame(resolve));

    return maxStackInlineSize;
  }
}
