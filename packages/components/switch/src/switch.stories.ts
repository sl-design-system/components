import { faMoonStars, faSunBright } from '@fortawesome/pro-solid-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/infotip/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Switch } from './switch.js';

type Props = Pick<
  Switch,
  'checked' | 'disabled' | 'iconOff' | 'iconOn' | 'reverse' | 'size' | 'tooltip' | 'value'
> & {
  component(): TemplateResult;
  description: string;
  infotip(): string | TemplateResult;
  label: string;
  styles(): string;
};
type Story = StoryObj<Props>;

Icon.register(faMoonStars, faSunBright);

export default {
  title: 'Form/Switch',
  args: {
    checked: false,
    disabled: false,
    label: 'Enable Dyslexia-Friendly Font',
    reverse: false,
    value: '12345'
  },
  argTypes: {
    description: {
      control: 'text'
    },
    iconOff: {
      table: { disable: true }
    },
    iconOn: {
      table: { disable: true }
    },
    infotip: {
      table: { disable: true }
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    },
    styles: {
      table: { disable: true }
    }
  },
  render: ({
    checked,
    component,
    description,
    disabled,
    iconOff,
    iconOn,
    infotip,
    label,
    reverse,
    size,
    styles,
    tooltip,
    value
  }) => html`
    ${styles
      ? html`
          <style>
            ${styles()}
          </style>
        `
      : nothing}
    ${component
      ? component()
      : html`
          <sl-switch
            ?checked=${checked}
            ?disabled=${disabled}
            icon-off=${ifDefined(iconOff)}
            icon-on=${ifDefined(iconOn)}
            id="switch"
            ?reverse=${reverse}
            size=${ifDefined(size)}
            tooltip=${ifDefined(tooltip)}
            .value=${value}>
            ${label} ${description ? html`<div slot="description">${description}</div>` : nothing}
            ${infotip ? html`<sl-infotip slot="infotip">${infotip()}</sl-infotip>` : nothing}
          </sl-switch>
        `}
  `
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    description:
      'Switches all reading materials, quizzes, and menu text to OpenDyslexic, a typeface designed to help readers with dyslexia process letters more easily.'
  }
};

export const Checked: Story = {
  args: {
    ...Basic.args,
    checked: true
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'This switch is disabled. You cannot toggle or focus it.'
  }
};

export const AriaDisabled: Story = {
  args: {
    component: () => html`
      <sl-switch
        aria-disabled="true"
        tooltip="You can combine the aria-disabled attribute with a tooltip to explain why the switch is disabled.">
        This switch has the aria-disabled attribute meaning it looks disabled, but you can still
        focus it.
      </sl-switch>
    `,
    styles: () => `
      sl-switch::part(tooltip) {
        max-inline-size: 200px;
      }
    `
  }
};

export const Icons: Story = {
  args: {
    iconOff: 'fas-sun-bright',
    iconOn: 'fas-moon-stars',
    label: '',
    styles: () => `
      sl-switch {
        width: fit-content;
      }
    `,
    tooltip: 'Click to toggle between light and dark mode.'
  }
};

export const Overflow: Story = {
  args: {
    description:
      'If you need a lot of text to explain the switch, you can use a description slot. Use that instead of having a label that spans multiple lines. The toggle will center vertically on the label and description.',
    label: 'Do not use long labels'
  }
};

export const Reverse: Story = {
  args: {
    label:
      'Reverse is not meant for regular use, but it is available if you need it for a specific design, such as when used within a form field.',
    reverse: true
  }
};

export const Infotip: Story = {
  args: {
    description: 'We look at which exercises you find difficult to suggest what to practice next.',
    infotip: () => html`
      <style>
        sl-infotip p {
          margin: 0;

          + p {
            margin-block-start: var(--sl-size-100);
          }
        }
      </style>
      <p>
        Your answers stay within your school. We keep them for the length of the school year, and
        your teacher never sees which suggestions you got.
      </p>
      <p>
        <a href="https://example.com">Read how we use your data</a>
      </p>
    `,
    label: 'Personalized practice suggestions'
  }
};

export const CustomValidity: Story = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    const onValidate = (event: Event & { target: Switch }): void => {
      event.target.setCustomValidity(event.target.checked ? '' : 'Toggle the switch.');
    };

    return html`
      <sl-form>
        <sl-form-field
          hint="This story has custom validation. If you do not toggle the switch, you will see a validation message."
          label="Do not do this in real code! The switch component should never be used in this way.">
          <sl-switch @sl-validate=${onValidate} reverse>You must toggle me</sl-switch>
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onClick}>Report validity</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
};

export const All: Story = {
  render: () => {
    return html`
      <style>
        .wrapper {
          align-items: center;
          display: inline-grid;
          gap: 1rem;
          grid-template-columns: auto 1fr 1fr 1fr 1fr 1fr 1fr;
          justify-items: center;
        }
      </style>
      <div class="wrapper">
        <span></span>
        <span style="grid-column: 2 / 4">sm</span>
        <span style="grid-column: 4 / 6">md</span>
        <span style="grid-column: 6 / 8">lg</span>

        <span style="justify-self: start">Default</span>
        <sl-switch size="sm">Unchecked</sl-switch>
        <sl-switch checked size="sm">Checked</sl-switch>
        <sl-switch>Unchecked</sl-switch>
        <sl-switch checked>Checked</sl-switch>
        <sl-switch size="lg">Unchecked</sl-switch>
        <sl-switch checked size="lg">Checked</sl-switch>

        <span style="justify-self: start">Custom</span>
        <sl-switch icon-off="fas-sun-bright" icon-on="fas-moon-stars" size="sm"
          >Unchecked</sl-switch
        >
        <sl-switch checked icon-off="fas-sun-bright" icon-on="fas-moon-stars" size="sm"
          >Checked</sl-switch
        >
        <sl-switch icon-off="fas-sun-bright" icon-on="fas-moon-stars">Unchecked</sl-switch>
        <sl-switch checked icon-off="fas-sun-bright" icon-on="fas-moon-stars">Checked</sl-switch>
        <sl-switch icon-off="fas-sun-bright" icon-on="fas-moon-stars" size="lg"
          >Unchecked</sl-switch
        >
        <sl-switch checked icon-off="fas-sun-bright" icon-on="fas-moon-stars" size="lg"
          >Checked</sl-switch
        >

        <span style="justify-self: start">Reverse</span>
        <sl-switch reverse size="sm">Unchecked</sl-switch>
        <sl-switch checked reverse size="sm">Checked</sl-switch>
        <sl-switch reverse>Unchecked</sl-switch>
        <sl-switch checked reverse>Checked</sl-switch>
        <sl-switch reverse size="lg">Unchecked</sl-switch>
        <sl-switch checked reverse size="lg">Checked</sl-switch>

        <span style="justify-self: start">Disabled</span>
        <sl-switch disabled size="sm">Unchecked</sl-switch>
        <sl-switch checked disabled size="sm">Checked</sl-switch>
        <sl-switch disabled>Unchecked</sl-switch>
        <sl-switch checked disabled>Checked</sl-switch>
        <sl-switch disabled size="lg">Unchecked</sl-switch>
        <sl-switch checked disabled size="lg">Checked</sl-switch>
      </div>
    `;
  }
};
