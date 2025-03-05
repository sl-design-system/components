import { faGear } from '@fortawesome/pro-regular-svg-icons';
import { faGear as fasGear } from '@fortawesome/pro-solid-svg-icons';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type ToggleButton, ToggleButtonFill, ToggleButtonSize } from './toggle-button.js';

type Props = Pick<ToggleButton, 'disabled' | 'fill' | 'pressed' | 'shape' | 'size'> & {
  icons(): TemplateResult;
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
      options: ['outline', 'solid']
    },
    shape: {
      control: 'inline-radio',
      options: ['pill', 'square']
    },
    icons: {
      table: { disable: true }
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    }
  },
  render: ({ disabled, fill, icons, label, pressed, shape, size }) => {
    return html`
      <sl-toggle-button
        ?disabled=${disabled}
        ?pressed=${pressed}
        aria-label=${ifDefined(label)}
        fill=${ifDefined(fill)}
        shape=${ifDefined(shape)}
        size=${ifDefined(size)}
      >
        ${icons?.()}
      </sl-toggle-button>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    icons: () => html`
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
      <sl-toggle-button aria-label="Show settings" fill="outline">
        <sl-icon name="pinata" slot="default"></sl-icon>
      </sl-toggle-button>

      <p>Setting the same icon for both states as "workaround" will not work, you will get the same error</p>
      <sl-toggle-button aria-label="Show settings" fill="outline">
        <sl-icon name="far-gear" slot="default"></sl-icon>
        <sl-icon name="far-gear" slot="pressed"></sl-icon>
      </sl-toggle-button>
    `;
  }
};

export const All: Story = {
  render: () => {
    const renderRow = (options: { fill: ToggleButtonFill; size: ToggleButtonSize }) => {
      return html`
        <div>
          <sl-toggle-button aria-label="Show settings" fill=${ifDefined(options.fill)} size=${ifDefined(options.size)}>
            <sl-icon name="far-gear" slot="default"></sl-icon>
            <sl-icon name="fas-gear" slot="pressed"></sl-icon>
          </sl-toggle-button>
          <sl-toggle-button
            aria-label="Show settings"
            fill=${ifDefined(options.fill)}
            size=${ifDefined(options.size)}
            shape="pill"
          >
            <sl-icon name="far-gear" slot="default"></sl-icon>
            <sl-icon name="fas-gear" slot="pressed"></sl-icon>
          </sl-toggle-button>
        </div>
        <div>
          <sl-toggle-button
            aria-label="Show settings"
            fill=${ifDefined(options.fill)}
            pressed
            size=${ifDefined(options.size)}
          >
            <sl-icon name="far-gear" slot="default"></sl-icon>
            <sl-icon name="fas-gear" slot="pressed"></sl-icon>
          </sl-toggle-button>
          <sl-toggle-button
            aria-label="Show settings"
            fill=${ifDefined(options.fill)}
            pressed
            shape="pill"
            size=${ifDefined(options.size)}
          >
            <sl-icon name="far-gear" slot="default"></sl-icon>
            <sl-icon name="fas-gear" slot="pressed"></sl-icon>
          </sl-toggle-button>
        </div>
        <div>
          <sl-toggle-button
            aria-label="Show settings"
            disabled
            fill=${ifDefined(options.fill)}
            size=${ifDefined(options.size)}
          >
            <sl-icon name="far-gear" slot="default"></sl-icon>
            <sl-icon name="fas-gear" slot="pressed"></sl-icon>
          </sl-toggle-button>
          <sl-toggle-button
            aria-label="Show settings"
            disabled
            shape="pill"
            fill=${ifDefined(options.fill)}
            size=${ifDefined(options.size)}
          >
            <sl-icon name="far-gear" slot="default"></sl-icon>
            <sl-icon name="fas-gear" slot="pressed"></sl-icon>
          </sl-toggle-button>
        </div>
        <div>
          <sl-toggle-button
            aria-label="Show settings"
            disabled
            fill=${ifDefined(options.fill)}
            pressed
            size=${ifDefined(options.size)}
          >
            <sl-icon name="far-gear" slot="default"></sl-icon>
            <sl-icon name="fas-gear" slot="pressed"></sl-icon>
          </sl-toggle-button>
          <sl-toggle-button
            aria-label="Show settings"
            disabled
            fill=${ifDefined(options.fill)}
            pressed
            shape="pill"
            size=${ifDefined(options.size)}
          >
            <sl-icon name="far-gear" slot="default"></sl-icon>
            <sl-icon name="fas-gear" slot="pressed"></sl-icon>
          </sl-toggle-button>
        </div>
      `;
    };
    return html`
      <style>
        section {
          align-items: center;
          align-self: start;
          display: inline-grid;
          gap: 0.5rem 2rem;
          grid-template-columns: auto auto 1fr 1fr 1fr 1fr;
          justify-items: center;
        }
        section div {
          white-space: nowrap;
        }
        hr {
          grid-column: span 6;
          border: 1px solid var(--sl-color-border-disabled);
          width: 100%;
        }
      </style>
      <section>
        <span style="grid-column: span 2">Subtle</span>
        <span>Idle</span>
        <span>Pressed</span>
        <span>Disabled</span>
        <span>Disabled + pressed</span>

        <span style="grid-row: span 2">sm</span>
        <span>Solid</span>
        ${renderRow({
          fill: 'solid',
          size: 'sm'
        })}
        <span>Outline</span>
        ${renderRow({
          fill: 'outline',
          size: 'sm'
        })}
        <hr />
        <span style="grid-row: span 2;">md</span>
        <span>Solid</span>
        ${renderRow({
          fill: 'solid',
          size: 'md'
        })}
        <span>Outline</span>
        ${renderRow({
          fill: 'outline',
          size: 'md'
        })}
        <hr />

        <span style="grid-row: span 2">lg</span>
        <span>Solid</span>
        ${renderRow({
          fill: 'solid',
          size: 'lg'
        })}
        <span>Outline</span>
        ${renderRow({
          fill: 'outline',
          size: 'lg'
        })}
      </section>
      <p>First item on the first row is the default combination of values; subtle, outline, md and square shape.</p>
    `;
  }
};
