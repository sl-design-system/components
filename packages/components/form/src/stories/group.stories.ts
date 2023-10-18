import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/text-input/register.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { FormGroup } from '../form-group.js';
import { FormControl } from '../form-control.js';

class GroupForm extends LitElement {
  group = new FormGroup(this, {
    name: new FormControl(this, ''),
    email: new FormControl(this, '')
  });

  @property({ attribute: false }) value?: { name: string; email: string };

  override updated(changes: Map<string, unknown>): void {
    super.updated(changes);

    if (changes.has('value') && this.value) {
      this.group.setValue(this.value);
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-text-input label="Name" ${this.group.bind('name')}></sl-text-input>
      <sl-text-input label="Email" ${this.group.bind('email')}></sl-text-input>
    `;
  }
}

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
