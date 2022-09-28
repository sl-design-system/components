import { Story } from '@storybook/web-components';
import { html } from 'lit';
import '../button-bar/register.js';
import './register.js';

export default {
  title: 'Input'
};

export const API: Story = {
  args: {
    fill: 'solid',
    size: 'md',
    text: 'Button',
    variant: 'primary'
  },
  render: ({ /*fill, size, text, variant*/ }) => html`
    <form>
        <label id="input-1" for="input-2">label</label>
          <sl-input id="input-2" placeholder="placeholder"></sl-input>
    </form>
  `
  // <sl-button .fill=${fill} .size=${size} .variant=${variant}>${text}</sl-button>
};

export const InputTest: Story = {
  render: () => html`
    <form>
      <label for="test1">label</label>
      <sl-input id="test1"></sl-input>
    </form>
  `
};

export const InputTestArialabelledbyExample: Story = {
  render: () => html`
    <form>
      <label id="test2">label second</label>
      <sl-input placeholder="placeholder"></sl-input>
    </form>
<!--    aria-labelledby="test1"-->
    <!--ariaLabelledby="test2"-->
  `
};

export const InputTest3: Story = {
  render: () => html`
    <form id="formId">
      <label for="test3">label 3</label>
      <sl-input id="test3" placeholder="placeholder"></sl-input>
    </form>
    <!--    aria-labelledby="test1"-->
    <!--ariaLabelledby="test3"-->
  `
};

export const InputTest4: Story = {
  render: () => html`
    <form id="formId4">
      <label id="test4" for="test5">label 4</label>
      <sl-input id="test5" placeholder="placeholder"></sl-input>
    </form>
<!--    aria-labelledby="test1"-->
    <!--ariaLabelledby="test3"-->
  `
};
