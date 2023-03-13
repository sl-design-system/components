import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Icon'
};

export const API: StoryObj = {
  render: () => html`
    <h1>FontAwesome icons</h1>
    <sl-icon name="chevron-down"></sl-icon>
    <sl-icon name="check"></sl-icon>
    <sl-icon name="face-smile"></sl-icon>
    <h1>Custom icons</h1>
    <sl-icon name="fav"></sl-icon>
    <sl-icon name="open-eye"></sl-icon>
    <h1>Icons that are not in base.json but are in FontAwesome</h1>
    <sl-icon name="glasses"></sl-icon>
    <sl-icon name="book"></sl-icon>
  `
};
