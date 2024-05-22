import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Form, FormController, FormField } from '@sl-design-system/form';
import { TextField } from '@sl-design-system/text-field';
import { LitElement, type TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';

export class DynamicArrayForm extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-text-field': TextField
    };
  }

  #form = new FormController(this);

  @state() items: string[] = ['Item 1'];

  override render(): TemplateResult {
    return html`
      <sl-form>
        <sl-button-bar>
          <sl-button @click=${this.#onAdd}>Add item</sl-button>
          <sl-button @click=${this.#onRemove}>Remove item</sl-button>
        </sl-button-bar>
        <sl-form-field label="Items">
          ${this.items.map(
            (item, index) => html`<sl-text-field .name=${`items[${index}]`} .value=${item}></sl-text-field>`
          )}
        </sl-form-field>
      </sl-form>
      <pre>${JSON.stringify(this.#form.value, null, 2)}</pre>
    `;
  }

  #onAdd(): void {
    this.items = [...this.items, `Item ${this.items.length + 1}`];

    // Request update in a timeout, so the serialized form value get's updated
    setTimeout(() => this.requestUpdate(), 50);
  }

  #onRemove(): void {
    this.items = this.items.slice(0, -1);

    // Request update in a timeout, so the serialized form value get's updated
    setTimeout(() => this.requestUpdate(), 50);
  }
}
