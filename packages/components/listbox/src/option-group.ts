import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { OptionGroupHeader } from './option-group-header.js';
import styles from './option-group.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-option-group': OptionGroup;
  }
}

/**
 * An option group in a list, such as select or combobox.
 *
 * @slot default - The option's label.
 */
export class OptionGroup extends ScopedElementsMixin(LitElement) {
  /** Watches for `label` attribute updates so we can consume and remove it from the host. */
  #labelObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type !== 'attributes' || mutation.attributeName !== 'label') {
        return;
      }

      const value = this.getAttribute('label');

      if (value !== null) {
        this.label = value;
        this.removeAttribute('label');
      }
    });
  });

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-option-group-header': OptionGroupHeader
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The optional label for the group. */
  @property({ attribute: false }) label?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    // Consume `label` from markup and remove it from the host element to avoid
    // exposing group labels in Safari/VoiceOver's listbox parsing path.
    if (this.hasAttribute('label')) {
      this.label = this.getAttribute('label') || undefined;
      this.removeAttribute('label');
    }

    this.#labelObserver.observe(this, { attributes: true, attributeFilter: ['label'] });

    // NOTE: We do NOT set role="group" here because it breaks Safari/VoiceOver.
    // When role="group" is inside role="listbox", Safari loses track of the
    // listbox/option relationship, causing incorrect item counts and aria-selected
    // announcements. Instead, we flatten the structure and use aria-hidden headers.

    // This is a workaround, because :has is not working in Safari and Firefox with :host element as it works in Chrome
    const style = document.createElement('style');
    style.innerHTML = `
      sl-option-group:has(+ sl-option) {
        border-block-end: var(--sl-color-border-plain) solid var(--sl-size-borderWidth-default);
        margin-block-end: var(--sl-size-050);
        padding-block-end: var(--sl-size-050);
      }
    `;
    this.prepend(style);
  }

  override disconnectedCallback(): void {
    this.#labelObserver.disconnect();

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        ${this.label
          ? html`<sl-option-group-header>${this.label}</sl-option-group-header>`
          : nothing}
        <slot></slot>
      </div>
    `;
  }
}
