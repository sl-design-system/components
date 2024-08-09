import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { RovingTabindexController } from '@sl-design-system/shared';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './tag-list.scss.js';
import { Tag, type TagEmphasis, type TagSize } from './tag.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tag-list': TagList;
  }
}

const OBSERVER_OPTIONS: MutationObserverInit = {
  attributes: true,
  attributeFilter: ['removable', 'label'],
  attributeOldValue: true,
  subtree: true
};

/**
 * A tag list component that can contain tags.
 *
 * ```html
 *   <sl-tag-list>
 *     <sl-tag label="First tag"></sl-tag>
 *     <sl-tag label="Second tag"></sl-tag>
 *     ...
 *   </sl-tag-list>
 * ```
 *
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

  /** Observe changes to tags to update visible and hidden tags if necessary. */
  #mutationObserver = new MutationObserver(() => {
    this.#mutationObserver?.disconnect();

    requestAnimationFrame(() => {
      this.#updateVisibility();
    });

    this.#mutationObserver?.observe(this, OBSERVER_OPTIONS);
  });

  /**
   * Observe changes to the size of the tag-list,
   * so we can determine when to display a counter with amount of hidden tags
   */
  #resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(() => {
      this.#updateVisibility();
    });
  });

  /** Manage keyboard navigation between tags. */
  #rovingTabindexController = new RovingTabindexController<Tag>(this, {
    focusInIndex: (elements: Tag[]) => elements.findIndex(el => !el.disabled),
    elements: () => (this.#visibleTags.length ? this.#visibleTags : this.tags) || [],
    isFocusableElement: (el: Tag) => !el.disabled
  });

  /** The emphasis of the tag-list and tags inside. Defaults to 'subtle'. */
  @property({ reflect: true }) emphasis?: TagEmphasis;

  /** The size of the tag-list (determines size of tags inside the tag-list). Defaults to `md`. */
  @property({ reflect: true }) size?: TagSize;

  /** Whether there should be a stacked version shown when there is not enough space. The list doesn't wrap when `stacked` version is applied. */
  @property({ type: Boolean, reflect: true }) stacked?: boolean;

  /** @internal The slotted tags. */
  @queryAssignedElements({ flatten: true }) tags?: Tag[];

  /** The label for the counter with amount of hidden tags. Applicable only in the `stacked` version. */
  #hiddenLabel = 0;

  /** Array containing hidden tags. Applicable only in the `stacked` version. */
  #hiddenTags: Tag[] = [];

  /** Array containing visible tags. Applicable only in the `stacked` version. */
  #visibleTags: Tag[] = [];

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'list');

    // We need to wait for the next frame so the element has time to render
    requestAnimationFrame(() => {
      this.#resizeObserver.observe(this);

      this.tags?.forEach(tag => {
        tag.size = this.size;
        tag.emphasis = this.emphasis;
        tag.setAttribute('role', 'listitem');
      });

      this.#mutationObserver?.observe(this, OBSERVER_OPTIONS);
    });
  }

  override disconnectedCallback(): void {
    this.#resizeObserver.disconnect();
    this.#mutationObserver.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('size')) {
      this.tags?.forEach(tag => (tag.size = this.size));
    }

    if (changes.has('emphasis')) {
      this.tags?.forEach(tag => (tag.emphasis = this.emphasis));
    }
  }

  override render(): TemplateResult {
    return html`
      ${this.stacked && this.#hiddenLabel > 0
        ? html` <div class="group" tabindex="-1">
            <sl-tag
              emphasis=${this.emphasis}
              aria-describedby="tooltip"
              label=${this.#hiddenLabel > 99 ? '+99' : this.#hiddenLabel}
              size=${this.size}
            ></sl-tag>
            <sl-tooltip id="tooltip" position="bottom" max-width="300">
              ${msg('List of hidden elements')}: ${this.#hiddenTags?.map(tag => tag.label).join(', ')}
            </sl-tooltip>
          </div>`
        : nothing}
      <div class="list">
        <slot @slotchange=${this.#onTagsSlotChange}></slot>
      </div>
    `;
  }

  #updateVisibility(): void {
    this.#rovingTabindexController.clearElementCache();

    if (!this.tags || !this.stacked) {
      return;
    }

    const tagGap = parseInt(getComputedStyle(this).getPropertyValue('--_gap') || '0'),
      groupEl = this.renderRoot.querySelector('.group') as HTMLDivElement,
      containerWidth = this.offsetWidth,
      counterWidth = this.#hiddenTags.length > 0 ? groupEl?.offsetWidth : 0;

    let totalTagsWidth = 0;

    // Reset styles to calculate total width correctly and calculate total width of tags
    this.tags.forEach(tag => {
      tag.style.display = 'inline-flex';
      totalTagsWidth += tag.offsetWidth + tagGap;
    });

    // Determine which tags to show or hide
    if (totalTagsWidth > containerWidth - counterWidth) {
      for (let i = 0; i < this.tags.length; i++) {
        totalTagsWidth -= this.tags[i].offsetWidth + tagGap;
        this.tags[i].style.display = 'none';
        this.#hiddenTags.push(this.tags[i]);

        if (totalTagsWidth <= containerWidth - counterWidth) {
          this.tags[this.tags.length - 1].style.display = 'inline-flex';
          break;
        }
      }
    } else {
      this.tags.forEach(tag => {
        tag.style.display = 'inline-flex';
      });
    }

    this.#visibleTags = Array.from(this.tags).filter(tag => tag.style.display !== 'none');
    this.#hiddenTags = Array.from(this.tags).filter(tag => tag.style.display === 'none');
    this.#hiddenLabel = this.#hiddenTags.length;

    this.setAttribute(
      'aria-label',
      `${msg(str`Showing ${this.#visibleTags.length} out of ${this.tags.length} elements`)}`
    );

    this.requestUpdate();
  }

  #onTagsSlotChange(): void {
    this.#rovingTabindexController.clearElementCache();

    this.#resizeObserver.disconnect();

    this.#resizeObserver.observe(this);

    requestAnimationFrame(() => {
      this.#updateVisibility();
    });
  }
}
