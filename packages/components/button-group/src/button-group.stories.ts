import { faBold, faItalic, faUnderline } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type ButtonGroup } from './button-group.js';

type Props = Pick<ButtonGroup, 'disabled'> & { slot?(): TemplateResult };
type Story = StoryObj<Props>;

Icon.register(faBold, faItalic, faUnderline);

export default {
  title: 'Components/Button group',
  tags: ['draft'],
  args: {
    disabled: false
  },
  argTypes: {
    slot: {
      table: { disable: true }
    }
  },
  render: ({ disabled, slot }) => {
    return html`<sl-button-group ?disabled=${disabled}>${slot?.()}</sl-button-group>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    slot: () => html`
      <sl-button aria-label="Bold" fill="ghost">
        <sl-icon name="far-bold"></sl-icon>
      </sl-button>
      <sl-button aria-label="Italic" fill="ghost">
        <sl-icon name="far-italic"></sl-icon>
      </sl-button>
      <sl-button aria-label="Underline" fill="ghost">
        <sl-icon name="far-underline"></sl-icon>
      </sl-button>
    `
  }
};
