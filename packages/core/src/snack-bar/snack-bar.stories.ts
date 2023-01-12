import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../snack-bar/register.js';
import { snackBar } from './snack-bar.js';
import './register.js';

export default {
  title: 'Snack bar'
};

const onClick = async (): Promise<void> => {
  await snackBar.show({ message: 'heee joh' });
};
export const API: StoryObj = {
  render: () =>
    html` <sl-snack-bar-controller></sl-snack-bar-controller>
      <sl-button @click=${onClick}>Show notification</sl-button>`
};
