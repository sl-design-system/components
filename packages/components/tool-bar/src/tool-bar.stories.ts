import '@sl-design-system/button/register.js';
import '@sl-design-system/select/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type ToolBar } from './tool-bar.js';

type Props = Pick<ToolBar, 'disabled'> & { items?(): TemplateResult };
type Story = StoryObj<Props>;

export default {
  title: 'Components/Tool bar',
  tags: ['draft'],
  args: {
    disabled: false
  },
  argTypes: {
    items: {
      table: { disable: true }
    }
  },
  render: ({ disabled, items }) => {
    return html`<sl-tool-bar ?disabled=${disabled}>${items?.()}</sl-tool-bar>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    items: () => html`
      <sl-button>Button 1</sl-button>
      <sl-button>Button 2</sl-button>
      <sl-button>Button 3</sl-button>
    `
  }
};
