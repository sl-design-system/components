import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { RovingTabindexController } from '@sl-design-system/shared';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './tag-list.scss.js';
import { Tag, type TagEmphasis, type TagSize } from './tag.js';

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

  /** Manage keyboard navigation between tags. */
  #rovingTabindexController = new RovingTabindexController<Tag>(this, {
    direction: 'horizontal',
    focusInIndex: (elements: Tag[]) => elements.findIndex(el => !el.disabled),
    elements: () => [
      ...(this.stackTag ? [this.stackTag] : []),
      ...(this.tags ?? []).filter(t => t.style.display !== 'none')
    ],
    isFocusableElement: (el: Tag) => !el.disabled
  });

  /** The emphasis of the tag-list and tags inside. Defaults to 'subtle'. */
  @property({ reflect: true }) emphasis?: TagEmphasis;

  /** The size of the tag-list (determines size of tags inside the tag-list). Defaults to `md`. */
  @property() size?: TagSize;

  /**
   * Whether there should be a stacked version shown when there is not enough space.
   * The list doesn't wrap when `stacked` version is applied.
   */
  @property({ type: Boolean, reflect: true }) stacked?: boolean;

  /** @internal The number of stacked tags. Applicable only in the `stacked` version. */
  @state() stackSize = 0;

  /** @internal The tag used to display the stack. */
  @query('sl-tag') stackTag?: Tag;

  /** @internal The slotted tags. */
  @state() tags: Tag[] = [];

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

    if (changes.has('emphasis')) {
      this.tags?.forEach(tag => (tag.emphasis = this.emphasis));
    }

    if (changes.has('size')) {
      this.tags?.forEach(tag => (tag.size = this.size));
    }

    if (changes.has('stacked') && !this.stacked) {
      this.tags.forEach(tag => (tag.style.display = ''));
    }

    if (changes.has('stacked') || changes.has('stackSize') || changes.has('tags')) {
      if (this.stacked) {
        const total = this.tags.length;

        this.setAttribute('aria-label', `${msg(str`Showing ${total - this.stackSize} out of ${total} items`)}`);
      } else {
        this.removeAttribute('aria-label');
      }
    }
  }

  override render(): TemplateResult {
    return html`
      ${this.stacked && this.stackSize > 0
        ? html`
            <div class=${classMap({ stack: true, double: this.stackSize === 2, triple: this.stackSize >= 3 })}>
              <sl-tag aria-describedby="tooltip" emphasis=${ifDefined(this.emphasis)} size=${ifDefined(this.size)}>
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
    this.#rovingTabindexController.clearElementCache();

    this.tags = Array.from(event.target.assignedElements({ flatten: true })).filter(
      (el): el is Tag => el instanceof Tag
    );

    this.tags.forEach(tag => {
      tag.emphasis = this.emphasis;
      tag.size = this.size;
      tag.setAttribute('role', 'listitem');
    });

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
