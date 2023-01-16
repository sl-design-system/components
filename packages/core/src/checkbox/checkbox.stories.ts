import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../label/register.js';
import './register.js';

export default {
  title: 'Checkbox'
};

export const API: StoryObj = {
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    text: 'Toggle me',
    value: '12345'
  },
  render: ({ checked, disabled, indeterminate, text, value }) => html`
    <sl-checkbox ?checked=${checked} ?disabled=${disabled} .indeterminate=${indeterminate} .value=${value}
      >${text}</sl-checkbox
    >
  `
};

export const Indeterminate: StoryObj = {
  render: () => html`<sl-checkbox indeterminate>Indeterminate</sl-checkbox>`
};

export const NoText: StoryObj = {
  render: () => html`<sl-checkbox aria-label="Hello world"></sl-checkbox>`
};

export const Overflow: StoryObj = {
  render: () => html`
    <sl-checkbox
      >Elit consectetur duis nisi id veniam id deserunt cupidatat. Consectetur consectetur consequat ea proident nulla
      consectetur anim incididunt esse magna eu. In est cupidatat ea veniam exercitation irure ullamco nisi proident
      enim.</sl-checkbox
    >
  `
};

export const WithLabel: StoryObj = {
  render: () => html`
    <label for="checkbox">Label</label>
    <sl-checkbox id="checkbox">Checkbox</sl-checkbox>
  `
};

export const Group: StoryObj = {
  render: () => html`
    <sl-label for="group">Checkbox group</sl-label>
    <sl-checkbox-group id="group" hint="Pick one of these options.">
      <sl-checkbox>Check me</sl-checkbox>
      <sl-checkbox>No me</sl-checkbox>
      <sl-checkbox>I was here first!</sl-checkbox>
    </sl-checkbox-group>
  `
};
