import { LitVirtualizer } from '@lit-labs/virtualizer';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type PathKeys, getStringByPath, getValueByPath } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './listbox.scss.js';
import { OptionGroupHeader } from './option-group-header.js';
import { Option } from './option.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-listbox': Listbox;
  }

  interface ShadowRoot {
    // Workaround for missing type in @open-wc/scoped-elements
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K];
  }
}

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
export type ListboxRenderer<T = any, U = T> = (item: ListboxItem<T, U>, index: number) => Element | TemplateResult;

let nextUniqueId = 0;

/**
 * Container for a list of selectable options.
 */
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

  /**
   * Use this property if you want to have full control over how the items
   * are rendered using lit-virtualizer. You are expected to provide an
   * array of ListboxItem<T, U> and most likely will also want to provide a
   * custom `renderer`.
   *
   * Only use this property if you know what you are doing. If you are unsure
   * about using this property, use the `options` property instead.
   */
  @property({ attribute: false }) items?: Array<ListboxItem<T, U>>;

  /**
   * Use this property to set an array of options to render. When you set this
   * property, the component will render the options using a virtualizer. This means
   * that it only renders the options that are visible in the viewport, which allows
   * it to handle a large number of options efficiently.
   *
   * When using this property, you can also provide paths to the properties to use for
   * the label, value, selected state, and group. This allows you to render options
   * that are objects and have nested properties. See `optionGroupPath`, `optionLabelPath`,
   * `optionSelectedPath`, and `optionValuePath` for more information.
   *
   * If you don't need virtualization, you can omit this property and render the
   * options declaratively using the default slot and `<sl-option>` and `<sl-option-group>`.
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
    if (changes.has('items')) {
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
    return html`<slot></slot>`;
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

  #prepareOptions(options: T[]): Array<ListboxItem<T, U>> {
    if (this.optionGroupPath) {
      const groups = Object.groupBy(options, option => getStringByPath(option, this.optionGroupPath!));

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

  #renderItem(item: ListboxItem<T, U>, index: number): Element {
    if ('option' in item) {
      const element = this.shadowRoot!.createElement('sl-option');
      element.id = item.id;
      element.selected = item.selected;
      element.innerText = item.label;
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
