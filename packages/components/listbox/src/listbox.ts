import { LitVirtualizer } from '@lit-labs/virtualizer/LitVirtualizer.js';
import { type TemplateResult, html, nothing } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'sl-listbox': Listbox;
  }
}

/**
 * Container for a list of selectable options.
 *
 * In order to support large number of items, this component extends the LitVirtualizer
 * component from the @lit-labs/virtualizer package. This also means it has no
 * shadow root. Therefore it is up to the consumer (such as combobox) to style the component.
 */
export class Listbox extends LitVirtualizer {
  override renderItem = (item: unknown) =>
    html`<sl-option>${typeof item === 'string' ? item : JSON.stringify(item)}</sl-option>`;

  override connectedCallback(): void {
    super.connectedCallback();

    if (customElements.get('sl-option') === undefined) {
      console.warn('The <sl-listbox> component requires the <sl-option> custom element to be defined.');
    }

    this.setAttribute('role', 'listbox');
    this.style.display = 'block';
  }

  override render(): TemplateResult<1> {
    if (this.items?.length) {
      return super.render();
    } else {
      return nothing as unknown as TemplateResult<1>;
    }
  }
}
