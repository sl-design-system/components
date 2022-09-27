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
  // argTypes: {
  //   fill: {
  //     control: {
  //       type: 'inline-radio',
  //       options: ['ghost', 'outline', 'solid', 'subtle']
  //     }
  //   },
  //   size: {
  //     control: {
  //       type: 'inline-radio',
  //       options: ['sm', 'md', 'lg']
  //     }
  //   },
  //   variant: {
  //     control: {
  //       type: 'radio',
  //       options: ['primary', 'secondary', 'success', 'danger', 'info', 'warning']
  //     }
  //   }
  // },
  render: ({ /*fill, size, text, variant*/ }) => html`
    <form>
        <label for="input-1">label
          <sl-input id="input-1" placeholder="placeholder"></sl-input>
        </label>
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
      <label for="test3">label second</label>
      <sl-input id="test3" placeholder="placeholder"></sl-input>
    </form>
    <!--    aria-labelledby="test1"-->
    <!--ariaLabelledby="test3"-->
  `
};

export const InputTest4: Story = {
  render: () => html`
    <form id="formId4">
      <label id="test4" for="test5">label second</label>
      <sl-input id="test5" placeholder="placeholder"></sl-input>
    </form>
<!--    aria-labelledby="test1"-->
    <!--ariaLabelledby="test3"-->
  `
};
