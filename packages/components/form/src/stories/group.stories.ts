import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { computed, watch } from '@lit-labs/preact-signals';
import '@sl-design-system/text-input/register.js';
import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { FormGroup } from '../form-group.js';
import { FormControl } from '../form-control.js';
import '../../register.js';

class GroupForm extends LitElement {
  static override styles: CSSResultGroup = css`
    :host {
      align-items: center;
      display: grid;
      gap: 0.5rem;
      grid-template-columns: auto 1fr;
    }
    p {
      grid-column: 1 / 3;
    }
  `;

  group = new FormGroup(this, {
    name: new FormControl(this, ''),
    email: new FormControl(this, '')
  });

  formValue = computed(() => JSON.stringify(this.group.value.value));

  @property({ attribute: false }) value?: { name: string; email: string };

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('value')) {
      this.group.setValue(this.value);
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-label for="name">Name</sl-label>
      <sl-text-input ${this.group.bind('name')} id="name"></sl-text-input>

      <sl-label for="email">Email</sl-label>
      <sl-text-input ${this.group.bind('email')} id="email"></sl-text-input>

      <p>Value: <code>${watch(this.formValue)}</code></p>
    `;
  }
}

try {
  customElements.define('group-form', GroupForm);
} catch {}

type Story = StoryObj<GroupForm>;

export default {
  title: 'Form/Group',
  args: {
    value: undefined
  },
  render: ({ value }) => html`<group-form .value=${value}></group-form>`
} satisfies Meta<GroupForm>;

export const Blank: Story = {};

export const InitialValue: Story = {
  args: {
    value: {
      name: 'John Doe',
      email: 'john@doe.com'
    }
  }
};
