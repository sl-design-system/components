import { faGear } from '@fortawesome/pro-regular-svg-icons';
import { faGear as fasGear } from '@fortawesome/pro-solid-svg-icons';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type ToggleButton } from './toggle-button.js';

type Props = Pick<ToggleButton, 'disabled' | 'fill' | 'pressed' | 'size'> & {
  icons?: TemplateResult;
  label: string;
};
type Story = StoryObj<Props>;

Icon.register(faGear, fasGear);

export default {
  title: 'Actions/Toggle button',
  tags: ['preview'],
  args: {
    disabled: false,
    label: 'Show settings',
    pressed: false
  },
  argTypes: {
    fill: {
      control: 'inline-radio',
      options: ['ghost', 'outline']
    },
    icons: {
      table: { disable: true }
    },
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    }
  },
  render: ({ disabled, fill, icons, label, pressed, size }) => {
    return html`
      <sl-toggle-button
        ?disabled=${disabled}
        ?pressed=${pressed}
        aria-label=${ifDefined(label)}
        fill=${ifDefined(fill)}
        size=${ifDefined(size)}
      >
        ${icons}
      </sl-toggle-button>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    icons: html`
      <sl-icon name="far-gear" slot="default"></sl-icon>
      <sl-icon name="fas-gear" slot="pressed"></sl-icon>
    `
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const Outline: Story = {
  args: {
    ...Basic.args,
    fill: 'outline'
  }
};

export const Pressed: Story = {
  args: {
    ...Basic.args,
    pressed: true
  }
};

export const Errors: Story = {
  render: () => {
    return html`
      <p>
        When the 'pressed' icon is not set you will get an error in the console and the button will not look correct
      </p>
      <sl-toggle-button fill="outline">
        <sl-icon name="pinata" slot="default"></sl-icon>
      </sl-toggle-button>

      <p>Setting the same icon for both states as "workaround" will not work, you will get the same error</p>
      <sl-toggle-button fill="outline">
        <sl-icon name="far-gear" slot="default"></sl-icon>
        <sl-icon name="far-gear" slot="pressed"></sl-icon>
      </sl-toggle-button>
    `;
  }
};

export const All: Story = {
  render: () => {
    return html`
      <style>
        section {
          align-items: center;
          align-self: start;
          display: inline-grid;
          gap: 1rem 2rem;
          grid-template-columns: auto 1fr 1fr 1fr 1fr;
          justify-items: center;
        }
      </style>
      <section>
        <span>Ghost</span>
        <span>Idle</span>
        <span>Pressed</span>
        <span>Disabled</span>
        <span>Disabled + pressed</span>

        <span>md</span>
        <sl-toggle-button>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button pressed>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button disabled>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button disabled pressed>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>

        <span>lg</span>
        <sl-toggle-button size="lg">
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button pressed size="lg">
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button disabled size="lg">
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button disabled pressed size="lg">
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>

        <span>Outline</span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>

        <span>md</span>
        <sl-toggle-button fill="outline">
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button fill="outline" pressed>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button fill="outline" disabled>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button disabled fill="outline" pressed>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>

        <span>lg</span>
        <sl-toggle-button fill="outline" size="lg">
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button fill="outline" pressed size="lg">
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button disabled fill="outline" size="lg">
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button disabled fill="outline" pressed size="lg">
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
      </section>
    `;
  }
};
