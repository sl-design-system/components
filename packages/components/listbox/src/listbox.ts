import { LitVirtualizer } from '@lit-labs/virtualizer/LitVirtualizer.js';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { type PathKeys, getStringByPath, getValueByPath } from '@sl-design-system/shared';
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
    'lit-virtualizer': LitVirtualizer;
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
      'lit-virtualizer': LitVirtualizer,
      'sl-option': Option,
      'sl-option-group-header': OptionGroupHeader
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The virtualizer instance when the `options` property is set. */
  #virtualizer?: LitVirtualizer;

  /** Cache mapping each option item to its 0-based flattened position (excludes group headers). */
  #flattenedPositionCache?: WeakMap<ListboxItem<T, U>, number>;

  /** Cache version matching the items version when the cache was last built. */
  #flattenedPositionCacheVersion = -1;

  /** Monotonically increasing version, incremented whenever `items` changes. */
  #itemsVersion = 0;

  /** Total number of option items in the last built cache. */
  #flattenedSetSize = 0;

  /**
   * The emphasis of the selected options in the listbox.
   *
   * @default 'subtle'
   */
  @property({ reflect: true }) emphasis?: ListboxEmphasis;

  /**
   * Use this property if you want to have full control over how the items are rendered using
   * lit-virtualizer. You are expected to provide an array of ListboxItem<T, U> and most likely will
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
      } else if (changes.get('options')) {
        this.items = [];
      }
    }
  }

  override updated(changes: PropertyValues<this>): void {
    if (changes.has('emphasis')) {
      this.#propagateEmphasis();
    }

    // Keep slotted options normalized out of the box, even if consumers don't
    // explicitly trigger listbox-specific slotchange timing.
    if (!this.options && !this.items) {
      this.#onSlotChange();
    }

    if (changes.has('items')) {
      this.#itemsVersion++;

      if (this.items) {
        this.#virtualizer ||= this.shadowRoot!.createElement('lit-virtualizer');
        this.#virtualizer.items = (this.items ?? []) as unknown[];
        this.#virtualizer.renderItem = (item: unknown, index: number) =>
          (this.renderer?.(item as ListboxItem<T, U>, index) ??
            this.#renderItem(item as ListboxItem<T, U>, index)) as unknown as TemplateResult;

        if (!this.#virtualizer.parentElement) {
          this.prepend(this.#virtualizer);
        }
      } else if (changes.get('items')) {
        this.#virtualizer?.remove();
        this.#virtualizer = undefined;
      }
    }

    if (changes.has('renderer') && this.#virtualizer) {
      if (this.renderer) {
        this.#virtualizer.renderItem = (item: unknown, index: number) =>
          this.renderer?.(item as ListboxItem<T, U>, index) as TemplateResult;
      } else {
        this.#virtualizer.renderItem = (item: unknown, index: number) =>
          this.#renderItem(item as ListboxItem<T, U>, index) as unknown as TemplateResult;
      }
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotChange}></slot>`;
  }

  scrollToIndex(index: number, options?: ScrollIntoViewOptions): void {
    if (this.#virtualizer) {
      this.#virtualizer.element(index)?.scrollIntoView(options);
    } else {
      Array.from(this.querySelectorAll('sl-option'))
        .filter(el => el.style.display !== 'none')
        .at(index)
        ?.scrollIntoView(options);
    }
  }

  /**
   * Applies flattened accessibility metadata to options.
   *
   * Kept public so composed consumers can trigger deterministic timing when options are projected
   * through nested slots.
   */
  applyFlattenedOptionAccessibility(options: Option[]): void {
    this.#applyFlattenedOptionAccessibility(options);
  }

  /**
   * Returns the 0-based flattened position of an option item among all option items (group headers
   * are excluded). Returns -1 if the item is a group header or is not in `items`.
   *
   * @internal Used by virtual-list consumers (e.g. combobox) so they don't need a duplicate cache.
   */
  getFlattenedPosition(item: ListboxItem<T, U>): number {
    if (!this.items || !('option' in item)) return -1;

    if (
      this.#flattenedPositionCacheVersion !== this.#itemsVersion ||
      !this.#flattenedPositionCache
    ) {
      this.#buildFlattenedPositionCache();
    }

    return this.#flattenedPositionCache!.get(item) ?? -1;
  }

  /**
   * Returns the total number of option items (group headers excluded) in the current `items` array.
   *
   * @internal Companion to `getFlattenedPosition`.
   */
  getFlattenedSetSize(): number {
    if (!this.items) return 0;

    if (
      this.#flattenedPositionCacheVersion !== this.#itemsVersion ||
      !this.#flattenedPositionCache
    ) {
      this.#buildFlattenedPositionCache();
    }

    return this.#flattenedSetSize;
  }

  #buildFlattenedPositionCache(): void {
    this.#flattenedPositionCache = new WeakMap<ListboxItem<T, U>, number>();
    this.#flattenedPositionCacheVersion = this.#itemsVersion;

    let position = 0;
    (this.items ?? []).forEach(i => {
      if ('option' in i) {
        this.#flattenedPositionCache!.set(i, position++);
      }
    });

    this.#flattenedSetSize = position;
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

  #onSlotChange(): void {
    this.#propagateEmphasis();

    const options = Array.from(this.querySelectorAll('sl-option')).filter(
      (el): el is Option => el instanceof Option
    );

    this.#applyFlattenedOptionAccessibility(options);
  }

  #applyFlattenedOptionAccessibility(options: Option[]): void {
    const metadata = options.map(option => ({
      group: option.closest<OptionGroup>('sl-option-group')?.label,
      label: this.#getOptionLabel(option),
      option
    }));

    metadata.forEach((item, index) => {
      this.#applyOptionAccessibility(item.option, {
        group: item.group,
        label: item.label,
        position: index + 1,
        setSize: metadata.length,
        selected: item.option.selected
      });
    });

    // Clean up stale aria-label on any options that moved out of groups.
    // This ensures that if an option was previously grouped and had a generated
    // aria-label, but then moved out of the group, the stale label is removed.
    const processedOptions = new Set(metadata.map(m => m.option));

    this.querySelectorAll('sl-option').forEach(option => {
      if (!processedOptions.has(option)) {
        const currentGroup = option.closest<OptionGroup>('sl-option-group')?.label;
        const hasGeneratedLabel =
          option.hasAttribute('aria-label') &&
          option.getAttribute('aria-label')!.includes('(') &&
          option.getAttribute('aria-label')!.includes(')');

        // If option has a generated aria-label but no current group, it's stale
        if (hasGeneratedLabel && !currentGroup) {
          option.removeAttribute('aria-label');
        }
      }
    });
  }

  #getOptionLabel(option: Option): string {
    const assignedNodes =
      option.shadowRoot?.querySelector('slot')?.assignedNodes({ flatten: true }) ??
      Array.from(option.childNodes);

    const label = assignedNodes
      .map(node => node.textContent || '')
      .join('')
      .trim();

    return label || option.innerText?.trim() || option.textContent?.trim() || '';
  }

  #renderItem(item: ListboxItem<T, U>, index: number): Element {
    if ('option' in item) {
      const element = this.shadowRoot!.createElement('sl-option');
      element.emphasis = this.emphasis;
      element.id = item.id;
      element.innerText = item.label;
      element.selected = item.selected;
      element.value = item.value;

      const flattenedPosition = this.getFlattenedPosition(item);

      if (flattenedPosition !== -1) {
        this.#applyOptionAccessibility(element, {
          group: item.group,
          label: item.label,
          position: flattenedPosition + 1,
          setSize: this.getFlattenedSetSize(),
          selected: item.selected
        });
      }

      return element;
    } else {
      const element = this.shadowRoot!.createElement('sl-option-group-header');
      element.divider = index !== 0;
      element.id = item.id;
      element.innerText = item.label;

      return element;
    }
  }

  #applyOptionAccessibility(
    option: Option,
    {
      group,
      label,
      position,
      selected,
      setSize
    }: {
      group?: string;
      label: string;
      position: number;
      selected?: boolean;
      setSize: number;
    }
  ): void {
    option.setAttribute('aria-posinset', position.toString());
    option.setAttribute('aria-setsize', setSize.toString());
    option.setAttribute('aria-selected', Boolean(selected).toString());

    if (group && label.trim()) {
      option.setAttribute('aria-label', `${label} (${group})`);
    } else {
      option.removeAttribute('aria-label');
    }
  }
}
