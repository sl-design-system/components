import { Story } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Button',
  argTypes: {
    fill: {
      control: {
        type: 'inline-radio',
        options: ['ghost', 'outline', 'solid', 'subtle']
      }
    },
    size: {
      control: {
        type: 'inline-radio',
        options: ['sm', 'md', 'lg']
      }
    },
    variant: {
      control: {
        type: 'radio',
        options: ['primary', 'secondary']
      }
    }
  }
};

export const API: Story = {
  args: {
    fill: 'solid',
    size: 'lg',
    text: 'Button',
    variant: 'primary'
  },
  render: ({ fill, size, text, variant }) => html`
    <sl-button .fill=${fill} .size=${size} .variant=${variant}>${text}</sl-button>
  `
};
