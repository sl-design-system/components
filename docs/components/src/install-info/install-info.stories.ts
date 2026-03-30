import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { InstallInfo } from './install-info.js';

type Props = Pick<InstallInfo, 'package'>;
type Story = StoryObj<Props>;

try {
  customElements.define('doc-install-info', InstallInfo);
} catch {
  /* empty */
}

export default {
  title: 'Install Info',
  args: {
    package: 'button'
  },
  argTypes: {
    package: {
      control: 'text'
    }
  },
  render: ({ package: pkg }) => html`<doc-install-info .package=${pkg}></doc-install-info>`
} satisfies Meta<Props>;

export const Basic: Story = {};

export const DifferentPackage: Story = {
  args: {
    package: 'text-field'
  }
};
