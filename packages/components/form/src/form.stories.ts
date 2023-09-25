import type { TemplateResult } from 'lit';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/text-input/register.js';
import { LitElement, html } from 'lit';
import '../register.js';
import { FormControl } from './form-control.js';

class SimpleForm extends LitElement {
  name = new FormControl(this);

  override render(): TemplateResult {
    return html`<sl-text-input ${this.name.bind()}></sl-text-input>`;
  }
}

try {
  customElements.define('simple-form', SimpleForm);
} catch {}

export default {
  title: 'Form'
};

export const Simple: StoryObj = {
  render: () => html`<simple-form></simple-form>`
};
