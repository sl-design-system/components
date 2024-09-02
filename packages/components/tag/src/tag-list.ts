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

  /**
   * Observe changes to the size of the tag-list,
   * so we can determine when to display a counter with amount of hidden tags
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

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'list');

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
    this.tags?.forEach(tag => this.#resizeObserver.unobserve(tag));

    this.tags = Array.from(event.target.assignedElements({ flatten: true })).filter(
      (el): el is Tag => el instanceof Tag
    );

    this.tags.forEach(tag => {
      tag.emphasis = this.emphasis;
      tag.size = this.size;
      tag.setAttribute('role', 'listitem');

      this.#resizeObserver.observe(tag);
    });

    // Give the browser time to update the tag styling before we calculate the visibility
    requestAnimationFrame(() => this.#updateVisibility());
  }

  #updateVisibility(): void {
    this.#rovingTabindexController.clearElementCache();

    if (!this.stacked || !this.tags) {
      return;
    }

    const gap = parseInt(getComputedStyle(this).getPropertyValue('--_gap') || '0'),
      stack = this.renderRoot.querySelector<HTMLElement>('.stack'),
      containerWidth = this.offsetWidth,
      counterWidth = this.stackSize > 0 ? (stack?.offsetWidth ?? 0) : 0;

    let totalTagsWidth = 0;

    // Reset styles to calculate total width correctly and calculate total width of tags
    this.tags.forEach(tag => {
      tag.style.display = '';
      totalTagsWidth += tag.offsetWidth + gap;
    });

    // Determine which tags to show or hide
    if (totalTagsWidth > containerWidth - counterWidth) {
      for (let i = 0; i < this.tags.length; i++) {
        totalTagsWidth -= this.tags[i].offsetWidth + gap;
        this.tags[i].style.display = 'none';

        if (totalTagsWidth <= containerWidth - counterWidth) {
          this.tags[this.tags.length - 1].style.display = '';
          break;
        }
      }
    } else {
      this.tags.forEach(tag => (tag.style.display = ''));
    }

    this.stackSize = this.tags.reduce((acc, tag) => (tag.style.display === 'none' ? acc + 1 : acc), 0);
  }
}
