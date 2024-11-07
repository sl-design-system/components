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
export type ListboxRenderer<T = any> = (option: T, index: number) => Element | TemplateResult;

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

  /** The virtualizer instance when the `options` property is set. */
  #virtualizer?: LitVirtualizer;

  /**
   * Use this property to set an array of options to render. When you set this
   * property, the component will render the options using a virtualizer. This means
   * that it only renders the options that are visible in the viewport, which allows
   * it to handle a large number of options efficiently.
   *
   * If you don't need virtualization, you can omit this property and render the
   * options declaratively using the default slot and `<sl-option>` and `<sl-option-group>`.
   */
  @property({ type: Array }) options?: T[];

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
  @property({ attribute: false }) renderer: ListboxRenderer<T> = (option: T) => {
    const element = this.shadowRoot!.createElement('sl-option'),
      itemString = typeof option === 'string' ? option : JSON.stringify(option);

    if (this.optionLabelPath) {
      const label = getValueByPath(option, this.optionLabelPath);

      element.selected = this.optionSelectedPath ? !!getValueByPath(option, this.optionSelectedPath) : false;
      element.textContent = typeof label === 'string' ? label : (label?.toString() ?? itemString);
      element.value = this.optionValuePath ? getValueByPath(option, this.optionValuePath) : option;
    } else {
      element.textContent = itemString;
      element.value = option;
    }

    return element;
  };

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'listbox');
  }

  override updated(changes: PropertyValues<this>): void {
    if (changes.has('options')) {
      if (this.options !== undefined) {
        this.#virtualizer ||= this.#createVirtualizer();
        this.#virtualizer.items = this.options;
      } else {
        this.#virtualizer?.remove();
        this.#virtualizer = undefined;
      }
    }

    if (
      this.#virtualizer &&
      (changes.has('optionLabelPath') ||
        changes.has('optionSelectedPath') ||
        changes.has('optionValuePath') ||
        changes.has('renderer'))
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
