import { faGear as farGear } from '@fortawesome/pro-regular-svg-icons';
import { faEyeSlash, faGear as fasGear } from '@fortawesome/pro-solid-svg-icons';

import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type ToggleButton, ToggleButtonFill, ToggleButtonSize } from './toggle-button.js';

type Props = Pick<ToggleButton, 'size' | 'fill' | 'pressed'>;
type Story = StoryObj<Props>;

const fills: ToggleButtonFill[] = ['outline', 'ghost'];
const sizes: ToggleButtonSize[] = ['sm', 'md', 'lg'];

Icon.register(fasGear, farGear, faEyeSlash);

export default {
  title: 'Components/ToggleButton',
  tags: ['draft'],
  args: {
    pressed: false,
    size: 'md',
    fill: 'ghost'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes
    },
    fill: {
      control: 'inline-radio',
      options: fills
    }
  },
  render: ({ fill, size, pressed }) => {
    const onToggle = (event: Event & { target: ToggleButton }): void => {
      console.log(event.target.pressed);
    };

    return html`
      <sl-toggle-button .fill=${fill} .size=${size} ?pressed=${pressed} @sl-toggle=${onToggle}>
        <sl-icon name="far-gear"></sl-icon>
        <sl-icon name="fas-gear" slot="pressed"></sl-icon>
      </sl-toggle-button>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const All: Story = {};
