import type { Meta, StoryObj } from '@storybook/web-components';
import type { IconStyle } from '@fortawesome/fontawesome-common-types';
import { html } from 'lit';
import './register.js';

interface Props {
  label: string;
  iconStyle: IconStyle;
  name?: string;
}

export default {
  title: 'Icon',
  args: {
    iconStyle: 'regular'
  },
  argTypes: {
    iconStyle: {
      control: 'inline-radio',
      options: ['regular', 'light', 'solid', 'thin', 'duotone']
    }
  },
  render: ({ iconStyle }) => {
    // const faIcons = ['raygun', 'glasses', 'book', 'user', 'camera-retro', 'hippo', 'rabbit-running', 'turtle', 'whale'];
    const faIcons = ['whale'];
    return html`
      <style>
        section {
          display: flex;
          gap: 8px;
        }
      </style>
      <!--<h1>FontAwesome icons</h1>
      <section>
        <sl-icon name="chevron-down" .iconStyle=${iconStyle}></sl-icon>
        <sl-icon name="check" .iconStyle=${iconStyle}></sl-icon>
        <sl-icon name="face-smile" .iconStyle=${iconStyle}></sl-icon>
      </section>
      <h1>Custom icons</h1>
      <section>
        <sl-icon name="fav" .iconStyle=${iconStyle}></sl-icon>
        <sl-icon name="open-eye" .iconStyle=${iconStyle}></sl-icon>
      </section>-->
      <h1>Icons that are not in base.json but are in FontAwesome</h1>
      <section>${faIcons.map(i => html`<sl-icon .name=${i} .iconStyle=${iconStyle}></sl-icon>`)}</section>
    `;
  }
} satisfies Meta<Props>;

type Story = StoryObj<Props>;

export const Basic: Story = {};
