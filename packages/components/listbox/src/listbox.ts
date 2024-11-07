import { LitVirtualizer } from '@lit-labs/virtualizer';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type PathKeys, getValueByPath } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './listbox.scss.js';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListboxRenderer<T = any> = (item: T, index: number) => Element | TemplateResult;

/**
 * Container for a list of selectable options.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Listbox<T = any> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'lit-virtualizer': LitVirtualizer,
      'sl-option': Option
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The virtualizer instance when the `items` property is set. */
  #virtualizer?: LitVirtualizer;

  /**
   * Use this property to set an array of items to render. When you set this
   * property, the component will render the items using a virtualizer. This means
   * that it only renders the items that are visible in the viewport, which allows
   * it to handle a large number of items efficiently.
   *
   * If you don't need virtualization, you can omit this property and render the
   * items declaratively using the default slot and `<sl-option>` and `<sl-option-group>`.
   */
  @property({ type: Array }) items?: T[];

  /** The path to the property to use for the label. */
  @property({ attribute: 'item-label-path' }) itemLabelPath?: PathKeys<T>;

  /** The path to the property to use for the selected state. */
  @property({ attribute: 'item-selected-path' }) itemSelectedPath?: PathKeys<T>;

  /** The path to the property to use for the value. */
  @property({ attribute: 'item-value-path' }) itemValuePath?: PathKeys<T>;

  /**
   * By setting this property, you can customize how an item in the `items` array is rendered.
   * By default, this will render the item as an `<sl-option>`.
   */
  @property({ attribute: false }) renderer: ListboxRenderer<T> = (item: T) => {
    const option = this.shadowRoot!.createElement('sl-option'),
      itemString = typeof item === 'string' ? item : JSON.stringify(item);

    if (this.itemLabelPath) {
      const label = getValueByPath(item, this.itemLabelPath);

      option.selected = this.itemSelectedPath ? !!getValueByPath(item, this.itemSelectedPath) : false;
      option.textContent = typeof label === 'string' ? label : (label?.toString() ?? itemString);
      option.value = this.itemValuePath ? getValueByPath(item, this.itemValuePath) : item;
    } else {
      option.textContent = itemString;
      option.value = item;
    }

    return option;
  };

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'listbox');
  }

  override updated(changes: PropertyValues<this>): void {
    if (changes.has('items')) {
      if (this.items !== undefined) {
        this.#virtualizer ||= this.#createVirtualizer();
        this.#virtualizer.items = this.items;
      } else {
        this.#virtualizer?.remove();
        this.#virtualizer = undefined;
      }
    }

    if (
      (changes.has('itemLabelPath') ||
        changes.has('itemSelectedPath') ||
        changes.has('itemValuePath') ||
        changes.has('renderer')) &&
      this.#virtualizer
    ) {
      this.#virtualizer.renderItem = (item: unknown, index: number) =>
        this.renderer(item as T, index) as TemplateResult;
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  #createVirtualizer(): LitVirtualizer {
    const virtualizer = this.shadowRoot!.createElement('lit-virtualizer');
    virtualizer.renderItem = (item: unknown, index: number) => this.renderer(item as T, index) as TemplateResult;

    this.appendChild(virtualizer);

    return virtualizer;
  }
}
