var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Form, FormController, FormField } from '@sl-design-system/form';
import { TextField } from '@sl-design-system/text-field';
import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
export class DynamicArrayForm extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    this.#form = new FormController(this);
    this.items = ['Item 1'];
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-text-field': TextField
    };
  }
  #form;
  render() {
    return html`
      <sl-form>
        <sl-button-bar>
          <sl-button @click=${this.#onAdd}>Add item</sl-button>
          <sl-button @click=${this.#onRemove}>Remove item</sl-button>
        </sl-button-bar>
        <sl-form-field label="Items">
          ${this.items.map(
            (item, index) =>
              html`<sl-text-field .name=${`items[${index}]`} .value=${item}></sl-text-field>`
          )}
        </sl-form-field>
      </sl-form>
      <pre>${JSON.stringify(this.#form.value, null, 2)}</pre>
    `;
  }
  #onAdd() {
    this.items = [...this.items, `Item ${this.items.length + 1}`];
    setTimeout(() => this.requestUpdate(), 50);
  }
  #onRemove() {
    this.items = this.items.slice(0, -1);
    setTimeout(() => this.requestUpdate(), 50);
  }
}
__decorateClass([state()], DynamicArrayForm.prototype, 'items', 2);
//# sourceMappingURL=dynamic-array-form.js.map
