import {
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faBold,
  faItalic,
  faUnderline
} from '@fortawesome/pro-regular-svg-icons';
import {
  faAlignJustify as fasAlignJustify,
  faAlignLeft as fasAlignLeft,
  faAlignRight as fasAlignRight,
  faBold as fasBold,
  faItalic as fasItalic,
  faUnderline as fasUnderline
} from '@fortawesome/pro-solid-svg-icons';
import '@sl-design-system/button-bar/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/toggle-button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type ToggleGroup } from './toggle-group.js';

type Props = Pick<ToggleGroup, 'disabled' | 'multiple' | 'size'> & { slot?(): TemplateResult };
type Story = StoryObj<Props>;

Icon.register(
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faBold,
  faItalic,
  faUnderline,
  fasAlignJustify,
  fasAlignLeft,
  fasAlignRight,
  fasBold,
  fasItalic,
  fasUnderline
);

export default {
  title: 'Components/Toggle group',
  tags: ['draft'],
  args: {
    disabled: false,
    multiple: false
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    },
    slot: {
      table: { disable: true }
    }
  },
  render: ({ disabled, multiple, size, slot }) => {
    return html`
      <sl-toggle-group ?disabled=${disabled} ?multiple=${multiple} size=${ifDefined(size)}>${slot?.()}</sl-toggle-group>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    slot: () => html`
      <sl-toggle-button aria-label="Align left">
        <sl-icon name="far-align-left" slot="default"></sl-icon>
        <sl-icon name="fas-align-left" slot="pressed"></sl-icon>
      </sl-toggle-button>
      <sl-toggle-button aria-label="Justify">
        <sl-icon name="far-align-justify" slot="default"></sl-icon>
        <sl-icon name="fas-align-justify" slot="pressed"></sl-icon>
      </sl-toggle-button>
      <sl-toggle-button aria-label="Align right">
        <sl-icon name="far-align-right" slot="default"></sl-icon>
        <sl-icon name="fas-align-right" slot="pressed"></sl-icon>
      </sl-toggle-button>
    `
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const Multiple: Story = {
  args: {
    multiple: true,
    slot: () => html`
      <sl-toggle-button aria-label="Bold">
        <sl-icon name="far-bold" slot="default"></sl-icon>
        <sl-icon name="fas-bold" slot="pressed"></sl-icon>
      </sl-toggle-button>
      <sl-toggle-button aria-label="Italic">
        <sl-icon name="far-italic" slot="default"></sl-icon>
        <sl-icon name="fas-italic" slot="pressed"></sl-icon>
      </sl-toggle-button>
      <sl-toggle-button aria-label="Underline">
        <sl-icon name="far-underline" slot="default"></sl-icon>
        <sl-icon name="fas-underline" slot="pressed"></sl-icon>
      </sl-toggle-button>
    `
  }
};

export const Text: Story = {
  args: {
    slot: () => html`
      <sl-toggle-button>Insufficient</sl-toggle-button>
      <sl-toggle-button>Pass</sl-toggle-button>
      <sl-toggle-button>Good</sl-toggle-button>
    `
  }
};

export const All: Story = {
  render: () => html`
    <style>
      #root-inner {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      #root-inner > div {
        align-items: center;
        align-self: start;
        display: inline-grid;
        gap: 1rem 2rem;
        grid-template-columns: auto 1fr 1fr 1fr 1fr;
        justify-items: center;
      }
      #root-inner > div:last-child {
        grid-template-columns: auto 1fr 1fr;
      }
    </style>
    <div>
      <span></span>
      <span>Multiple</span>
      <span>Multiple, pressed</span>
      <span>Disabled</span>
      <span>Single</span>

      <span>md</span>
      <sl-toggle-group multiple>
        <sl-toggle-button aria-label="Bold">
          <sl-icon name="far-bold" slot="default"></sl-icon>
          <sl-icon name="fas-bold" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Italic">
          <sl-icon name="far-italic" slot="default"></sl-icon>
          <sl-icon name="fas-italic" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Underline">
          <sl-icon name="far-underline" slot="default"></sl-icon>
          <sl-icon name="fas-underline" slot="pressed"></sl-icon>
        </sl-toggle-button>
      </sl-toggle-group>
      <sl-toggle-group multiple>
        <sl-toggle-button aria-label="Bold" pressed>
          <sl-icon name="far-bold" slot="default"></sl-icon>
          <sl-icon name="fas-bold" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Italic">
          <sl-icon name="far-italic" slot="default"></sl-icon>
          <sl-icon name="fas-italic" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Underline" pressed>
          <sl-icon name="far-underline" slot="default"></sl-icon>
          <sl-icon name="fas-underline" slot="pressed"></sl-icon>
        </sl-toggle-button>
      </sl-toggle-group>
      <sl-toggle-group disabled multiple>
        <sl-toggle-button aria-label="Bold" pressed>
          <sl-icon name="far-bold" slot="default"></sl-icon>
          <sl-icon name="fas-bold" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Italic">
          <sl-icon name="far-italic" slot="default"></sl-icon>
          <sl-icon name="fas-italic" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Underline" pressed>
          <sl-icon name="far-underline" slot="default"></sl-icon>
          <sl-icon name="fas-underline" slot="pressed"></sl-icon>
        </sl-toggle-button>
      </sl-toggle-group>
      <sl-toggle-group>
        <sl-toggle-button aria-label="Align left" pressed>
          <sl-icon name="far-align-left" slot="default"></sl-icon>
          <sl-icon name="fas-align-left" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Justify">
          <sl-icon name="far-align-justify" slot="default"></sl-icon>
          <sl-icon name="fas-align-justify" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Align right">
          <sl-icon name="far-align-right" slot="default"></sl-icon>
          <sl-icon name="fas-align-right" slot="pressed"></sl-icon>
        </sl-toggle-button>
      </sl-toggle-group>

      <span>lg</span>
      <sl-toggle-group multiple size="lg">
        <sl-toggle-button aria-label="Bold">
          <sl-icon name="far-bold" slot="default"></sl-icon>
          <sl-icon name="fas-bold" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Italic">
          <sl-icon name="far-italic" slot="default"></sl-icon>
          <sl-icon name="fas-italic" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Underline">
          <sl-icon name="far-underline" slot="default"></sl-icon>
          <sl-icon name="fas-underline" slot="pressed"></sl-icon>
        </sl-toggle-button>
      </sl-toggle-group>
      <sl-toggle-group multiple size="lg">
        <sl-toggle-button aria-label="Bold" pressed>
          <sl-icon name="far-bold" slot="default"></sl-icon>
          <sl-icon name="fas-bold" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Italic">
          <sl-icon name="far-italic" slot="default"></sl-icon>
          <sl-icon name="fas-italic" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Underline" pressed>
          <sl-icon name="far-underline" slot="default"></sl-icon>
          <sl-icon name="fas-underline" slot="pressed"></sl-icon>
        </sl-toggle-button>
      </sl-toggle-group>
      <sl-toggle-group disabled multiple size="lg">
        <sl-toggle-button aria-label="Bold" pressed>
          <sl-icon name="far-bold" slot="default"></sl-icon>
          <sl-icon name="fas-bold" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Italic">
          <sl-icon name="far-italic" slot="default"></sl-icon>
          <sl-icon name="fas-italic" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Underline" pressed>
          <sl-icon name="far-underline" slot="default"></sl-icon>
          <sl-icon name="fas-underline" slot="pressed"></sl-icon>
        </sl-toggle-button>
      </sl-toggle-group>
      <sl-toggle-group size="lg">
        <sl-toggle-button aria-label="Align left" pressed>
          <sl-icon name="far-align-left" slot="default"></sl-icon>
          <sl-icon name="fas-align-left" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Justify">
          <sl-icon name="far-align-justify" slot="default"></sl-icon>
          <sl-icon name="fas-align-justify" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Align right">
          <sl-icon name="far-align-right" slot="default"></sl-icon>
          <sl-icon name="fas-align-right" slot="pressed"></sl-icon>
        </sl-toggle-button>
      </sl-toggle-group>
    </div>

    <div>
      <span></span>
      <span>Text</span>
      <span>Text, pressed</span>

      <span>md</span>
      <sl-toggle-group>
        <sl-toggle-button>Easy</sl-toggle-button>
        <sl-toggle-button>Medium</sl-toggle-button>
        <sl-toggle-button>Hard</sl-toggle-button>
      </sl-toggle-group>
      <sl-toggle-group>
        <sl-toggle-button>Easy</sl-toggle-button>
        <sl-toggle-button>Medium</sl-toggle-button>
        <sl-toggle-button pressed>Hard</sl-toggle-button>
      </sl-toggle-group>

      <span>lg</span>
      <sl-toggle-group size="lg">
        <sl-toggle-button>Easy</sl-toggle-button>
        <sl-toggle-button>Medium</sl-toggle-button>
        <sl-toggle-button>Hard</sl-toggle-button>
      </sl-toggle-group>
      <sl-toggle-group size="lg">
        <sl-toggle-button>Easy</sl-toggle-button>
        <sl-toggle-button>Medium</sl-toggle-button>
        <sl-toggle-button pressed>Hard</sl-toggle-button>
      </sl-toggle-group>
    </div>
  `
};
