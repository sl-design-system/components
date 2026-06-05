import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { type PathKeys, getStringByPath, getValueByPath } from '@sl-design-system/shared';
import { VirtualList } from '@sl-design-system/virtual-list';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html
} from 'lit';
import { property } from 'lit/decorators.js';
import styles from './listbox.scss.js';
import { OptionGroupHeader } from './option-group-header.js';
import { OptionGroup } from './option-group.js';
import { Option, type OptionEmphasis } from './option.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-listbox': Listbox;
    'sl-virtual-list': VirtualList;
  }

  interface ShadowRoot {
    // Workaround for missing type in @open-wc/scoped-elements
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K];
  }
}

export type ListboxEmphasis = OptionEmphasis;

export type ListboxOption<T, U = T> = {
  id: string;
  label: string;
  group?: string;
  option: T;
  selected?: boolean;
  value: U;
};

export type ListboxOptionGroup = {
  id: string;
  label: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListboxItem<T = any, U = T> = ListboxOption<T, U> | ListboxOptionGroup;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListboxRenderer<T = any, U = T> = (
  item: ListboxItem<T, U>,
  index: number
) => Element | TemplateResult;

let nextUniqueId = 0;

/** Container for a list of selectable options. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Listbox<T = any, U = T> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-virtual-list': VirtualList,
      'sl-option': Option,
      'sl-option-group-header': OptionGroupHeader
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The virtual list instance when the `options` or `items` property is set. */
  #virtualizer?: VirtualList<ListboxItem<T, U>>;

  /**
   * The emphasis of the selected options in the listbox.
   *
   * @default 'subtle'
   */
  @property({ reflect: true }) emphasis?: ListboxEmphasis;

  /**
   * Use this property if you want to have full control over how the items are rendered using a
   * virtual list. You are expected to provide an array of ListboxItem<T, U> and most likely will
   * also want to provide a custom `renderer`.
   *
   * Only use this property if you know what you are doing. If you are unsure about using this
   * property, use the `options` property instead.
   */
  @property({ attribute: false }) items?: Array<ListboxItem<T, U>>;

  /**
   * Use this property to set an array of options to render. When you set this property, the
   * component will render the options using a virtualizer. This means that it only renders the
   * options that are visible in the viewport, which allows it to handle a large number of options
   * efficiently.
   *
   * When using this property, you can also provide paths to the properties to use for the label,
   * value, selected state, and group. This allows you to render options that are objects and have
   * nested properties. See `optionGroupPath`, `optionLabelPath`, `optionSelectedPath`, and
   * `optionValuePath` for more information.
   *
   * If you don't need virtualization, you can omit this property and render the options
   * declaratively using the default slot and `<sl-option>` and `<sl-option-group>`.
   */
  @property({ type: Array }) options?: T[];

  /** The path to the property to use to group the options. */
  @property({ attribute: 'option-group-path' }) optionGroupPath?: PathKeys<T>;

  /** The path to the property to use for the label. */
  @property({ attribute: 'option-label-path' }) optionLabelPath?: PathKeys<T>;

  /** The path to the property to use for the selected state. */
  @property({ attribute: 'option-selected-path' }) optionSelectedPath?: PathKeys<T>;

  /** The path to the property to use for the value. */
  @property({ attribute: 'option-value-path' }) optionValuePath?: PathKeys<T>;

  /**
   * By setting this property, you can customize how an option in the `options` array is rendered.
   * By default, this will render the option as an `<sl-option>`.
   */
  @property({ attribute: false }) renderer?: ListboxRenderer<T>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'listbox');
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    // Ensure attribute is set on first render if we have items, unless consumer set height
    if (this.items && this.items.length > 0) {
      this.#updateVirtualConstraintAttribute();
    }
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (
      changes.has('options') ||
      changes.has('optionGroupPath') ||
      changes.has('optionLabelPath') ||
      changes.has('optionSelectedPath') ||
      changes.has('optionValuePath')
    ) {
      if (this.options) {
        this.items = this.#prepareOptions(this.options);
        // Update attribute after setting items
        this.#updateVirtualConstraintAttribute();
      } else if (changes.get('options')) {
        this.items = undefined;
        this.removeAttribute('data-virtual-unconstrained');
      }
    }

    // Also handle direct items assignment
    if (changes.has('items')) {
      this.#updateVirtualConstraintAttribute();
    }
  }

  #updateVirtualConstraintAttribute(): void {
    // Only apply fallback constraint if:
    // 1. We have items (virtual list will be used)
    // 2. Consumer hasn't set explicit height constraints (inline or via CSS)

    // Temporarily remove attribute to check computed styles without our CSS rule applying
    // This avoids circular dependency where our CSS rule affects the detection
    this.removeAttribute('data-virtual-unconstrained');

    // Check inline styles first (highest priority)
    const hasInlineHeightConstraint = !!(
      this.style.height ||
      this.style.blockSize ||
      this.style.maxHeight ||
      this.style.maxBlockSize
    );

    // Check computed styles to catch CSS-set constraints (without our fallback interfering)
    let hasComputedHeightConstraint = false;
    if (!hasInlineHeightConstraint) {
      const computed = getComputedStyle(this);
      // Check if max-height or max-block-size is set (not 'none')
      // Note: We can't reliably detect explicit height from computed styles
      // (getComputedStyle().height always returns pixels, not 'auto').
      // Consumers should use max-height in CSS or inline styles for height.
      hasComputedHeightConstraint =
        computed.maxHeight !== 'none' || computed.maxBlockSize !== 'none';
    }

    // Set attribute if no constraints found
    if (
      this.items &&
      this.items.length > 0 &&
      !hasInlineHeightConstraint &&
      !hasComputedHeightConstraint
    ) {
      this.setAttribute('data-virtual-unconstrained', '');
    }
    // else: attribute already removed above
  }

  override updated(changes: PropertyValues<this>): void {
    if (changes.has('emphasis')) {
      this.#propagateEmphasis();
    }

    // Check for options/items changes - items is set in willUpdate() so won't appear in changes
    const itemsChanged = changes.has('options') || changes.has('items');

    if (itemsChanged) {
      if (this.items) {
        const renderer = this.renderer;

        this.#virtualizer ||= this.shadowRoot!.createElement('sl-virtual-list');
        this.#virtualizer.items = this.items ?? [];
        this.#virtualizer.scrollMargin = 0;
        this.#virtualizer.gap =
          getComputedStyle(this).gap !== '' ? parseInt(getComputedStyle(this).gap) : 0;
        this.#virtualizer.overscan = 3;
        this.#virtualizer.renderItem = (item: unknown, index: number) =>
          renderer
            ? renderer(item as ListboxItem<T, U>, index)
            : this.#renderItem(item as ListboxItem<T, U>, index);
        if (!this.#virtualizer.parentElement) {
          this.prepend(this.#virtualizer);
        }
      } else if (changes.get('items') || changes.get('options')) {
        this.#virtualizer?.remove();
        this.#virtualizer = undefined;
      }
    }

    if (changes.has('renderer') && this.#virtualizer) {
      const renderer = this.renderer;

      if (renderer) {
        this.#virtualizer.renderItem = (item: unknown, index: number) =>
          renderer(item as ListboxItem<T, U>, index);
      } else {
        this.#virtualizer.renderItem = (item: unknown, index: number) =>
          this.#renderItem(item as ListboxItem<T, U>, index);
      }
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#propagateEmphasis}></slot>`;
  }

  /**
   * Request a layout update for the virtual list. Call this method after the listbox becomes
   * visible (for example, when a popover opens) to ensure item positions are measured correctly.
   */
  async requestLayout(): Promise<void> {
    if (this.#virtualizer && this.items) {
      await this.#virtualizer.requestLayout();
    }
  }

  scrollToIndex(index: number, options?: ScrollIntoViewOptions): void {
    if (this.#virtualizer) {
      const alignMap: Record<
          NonNullable<ScrollIntoViewOptions['block']>,
          'start' | 'center' | 'end' | 'auto'
        > = {
          center: 'center',
          end: 'end',
          nearest: 'auto',
          start: 'start'
        },
        block = options?.block ?? 'start',
        behavior = options?.behavior === 'instant' ? 'auto' : options?.behavior;
      this.#virtualizer.scrollToIndex(index, {
        align: alignMap[block],
        behavior
      });
    } else {
      Array.from(this.querySelectorAll('sl-option'))
        .filter(el => el.style.display !== 'none')
        .at(index)
        ?.scrollIntoView(options);
    }
  }

  #prepareOptions(options: T[]): Array<ListboxItem<T, U>> {
    if (this.optionGroupPath) {
      const groups = Object.groupBy(options, option =>
        getStringByPath(option, this.optionGroupPath!)
      );

      return Object.keys(groups).reduce(
        (acc, group) => {
          return [
            ...acc,
            {
              id: `sl-listbox-option-group-${nextUniqueId++}`,
              label: group
            },
            ...groups[group]!.map(option => this.#prepareOption(option, group))
          ];
        },
        [] as Array<ListboxItem<T, U>>
      );
    } else {
      return options.map(option => this.#prepareOption(option));
    }
  }

  #prepareOption(option: T, group?: string): ListboxOption<T, U> {
    const label = this.optionLabelPath
      ? getStringByPath(option, this.optionLabelPath)
      : (option as unknown as { toString(): string }).toString();

    return {
      group,
      id: `sl-listbox-option-${nextUniqueId++}`,
      label,
      option,
      selected: this.optionSelectedPath ? !!getValueByPath(option, this.optionSelectedPath) : false,
      value: (this.optionValuePath ? getValueByPath(option, this.optionValuePath) : option) as U
    };
  }

  #propagateEmphasis(): void {
    const slot = this.renderRoot.querySelector('slot');

    slot?.assignedElements({ flatten: true }).forEach(el => {
      if (el instanceof Option) {
        el.emphasis = this.emphasis;
      } else if (el instanceof OptionGroup) {
        el.querySelectorAll('sl-option').forEach(o => (o.emphasis = this.emphasis));
      }
    });
  }

  #renderItem(item: ListboxItem<T, U>, index: number): Element {
    if ('option' in item) {
      const element = this.shadowRoot!.createElement('sl-option');
      element.emphasis = this.emphasis;
      element.id = item.id;
      element.innerText = item.label;
      element.selected = item.selected;
      element.value = item.value;

      return element;
    } else {
      const element = this.shadowRoot!.createElement('sl-option-group-header');
      element.divider = index !== 0;
      element.id = item.id;
      element.innerText = item.label;

      return element;
    }
  }
}
