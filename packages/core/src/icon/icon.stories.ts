import type { IconSize } from './icon.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import { faPinata as falPinata } from '@fortawesome/pro-light-svg-icons';
import { faPinata as fasPinata } from '@fortawesome/pro-solid-svg-icons';
import { faPinata as fatPinata } from '@fortawesome/pro-thin-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { html } from 'lit';
import { Icon } from './icon.js';
import './register.js';

interface Props extends Pick<Icon, 'label' | 'name' | 'size'> {
  icons: string[];
}

const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

const sizeName = (size: IconSize): string => {
  switch (size) {
    case 'sm':
      return 'Small';
    case 'md':
      return 'Medium';
    case 'lg':
      return 'Large';
    case 'xl':
      return 'Extra Large';
    case '2xl':
      return '2 Extra Large';
    case '3xl':
      return '3 Extra Large';
    case '4xl':
      return '4 Extra Large';
    default:
      return 'Extra Small';
  }
};

export default {
  title: 'Icon',
  args: {
    icons: Object.keys(window.SLDS.icons)
  },
  argTypes: {
    icons: {
      control: {
        type: null
      }
    }
  },
  render: ({ icons }) => {
    return html`
      <style>
        section {
          display: grid;
          grid-auto-columns: var(--sl-size-icon-4xl);
          gap: 8px;
          grid-auto-flow: column;
          justify-items: center;
        }
      </style>
      <h2>System and custom icons:</h2>
      ${sizes.map(
        size => html`
          <h3>${sizeName(size)}</h3>
          <section>${icons.map(i => html`<sl-icon .name=${i} .size=${size}></sl-icon>`)}</section>
        `
      )}
      <h2>Referring to a non-existing icon:</h2>
      <section><sl-icon name="sl-non-existent"></sl-icon></section>
    `;
  }
} satisfies Meta<Props>;

type Story = StoryObj<Props>;

export const Basic: Story = {};
export const RegisterAdditionalIcons: Story = {
  render: () => {
    // load the entire FA library of a certain variant:
    Icon.registerIcon(...Object.values(far));

    // load a single icon:
    Icon.registerIcon(fatPinata);
    Icon.registerIcon(fatPinata);

    // load multiple icons at once:
    Icon.registerIcon(falPinata, fasPinata);

    return html`
      <style>
        section {
          display: flex;
          gap: 8px;
        }
      </style>
      <h2>Icons added directly from FontAwesome:</h2>
      <section>
        <sl-icon name="fas-pinata"></sl-icon>
        <sl-icon name="far-pinata"></sl-icon>
        <sl-icon name="fal-pinata"></sl-icon>
        <sl-icon name="fat-pinata"></sl-icon>
        <sl-icon name="far-narwhal"></sl-icon>
      </section
    `;
  }
};
