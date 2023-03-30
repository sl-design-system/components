import type { Meta, StoryObj } from '@storybook/web-components';
import type { IconStyle } from '@fortawesome/fontawesome-common-types';
import { html } from 'lit';
import './register.js';
import { faPinata } from '@fortawesome/pro-light-svg-icons';
import { faPinata as fatPinata } from '@fortawesome/pro-thin-svg-icons';
import { Icon } from './icon.js';

interface Props {
  label: string;
  iconStyle: IconStyle;
  name?: string;
}

export default {
  title: 'Icon',
  render: () => {
    const faIcons = Object.keys(window.SLDS.icons);
    return html`
      <style>
        section {
          display: flex;
          gap: 8px;
        }
      </style>
      <section>${faIcons.map(i => html`<sl-icon .name=${i}></sl-icon>`)}</section>
    `;
  }
} satisfies Meta<Props>;

type Story = StoryObj<Props>;

export const Basic: Story = {};
export const RegisterAdditionalIcons: Story = {
  render: () => {
    Icon.registerIcon(faPinata);
    Icon.registerIcon(fatPinata);
    return html`
      <sl-icon name="fal-pinata"></sl-icon>
      <sl-icon name="fat-pinata"></sl-icon>
    `;
  }
};
