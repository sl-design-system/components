import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type FormControlShowValidity } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-button.scss.js';
import { type SelectOption } from './select-option.js';
import { type SelectSize } from './select.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-button': SelectButton;
  }
}

export class SelectButton extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // /** @internal */
  // readonly internals = this.attachInternals();

  /** Whether the button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** The placeholder for when there is no selected option.s */
  @property() placeholder?: string;

  /** The selected option. */
  @property({ attribute: false }) selected?: SelectOption | null;

  /** The size of the parent select. */
  @property({ reflect: true }) size?: SelectSize = 'md';

  /** Mirrors the same property on the sl-select parent. */
  @property({ type: Boolean, reflect: true }) required?: boolean;

  /** Indicates whether the control should indicate it is valid. */
  @property({ type: Boolean, attribute: 'show-valid', reflect: true }) showValid?: boolean;

  /** Mirrors the same property on the sl-select parent. */
  @property({ reflect: true, attribute: 'show-validity' }) showValidity: FormControlShowValidity;

  override connectedCallback(): void {
    super.connectedCallback();

    this.slot = 'button';
    this.setAttribute('role', 'combobox');

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = this.disabled ? -1 : 0;
    }

    // this.setFormControlElement(this);
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('disabled')) {
      this.tabIndex = this.disabled ? -1 : 0;
    }

    // if (changes.has('placeholder')) {
    //   if (this.placeholder) {
    //     this.setAttribute('aria-placeholder', this.placeholder);
    //   } else {
    //     this.removeAttribute('aria-placeholder');
    //   }
    // }
  }

  override render(): TemplateResult {
    let selected: string | HTMLElement | undefined = undefined;

    if (this.selected?.childElementCount) {
      selected = this.selected.cloneNode(true) as HTMLElement;
      selected.removeAttribute('selected');
      selected.part.add('selected');
    } else {
      selected = this.selected?.textContent?.trim();
    }

    return html`
      <div>${selected || this.placeholder || '\u00a0'}</div>
      <sl-icon name="chevron-down"></sl-icon>
    `;
  }
}
