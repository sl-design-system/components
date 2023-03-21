import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Icon',
  args: {
    iconStyle: 'regular'
  },
  argTypes: {
    iconStyle: {
      control: 'inline-radio',
      options: ['regular', 'light', 'solid']
    }
  }
};

export const API: StoryObj = {
  render: ({ iconStyle }) => html`
    <h1>FontAwesome icons</h1>
    <sl-icon name="chevron-down" .iconStyle=${iconStyle}></sl-icon>
    <sl-icon name="check" .iconStyle=${iconStyle}></sl-icon>
    <sl-icon name="face-smile" .iconStyle=${iconStyle}></sl-icon>
    <h1>Custom icons</h1>
    <sl-icon name="fav" .iconStyle=${iconStyle}></sl-icon>
    <sl-icon name="open-eye" .iconStyle=${iconStyle}></sl-icon>
    <h1>Icons that are not in base.json but are in FontAwesome</h1>
    <sl-icon name="glasses" .iconStyle=${iconStyle}></sl-icon>
    <sl-icon name="book" .iconStyle=${iconStyle}></sl-icon>
  `
};
