import { faMoonStars, faSunBright } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Switch } from './switch.js';

type Props = Pick<Switch, 'checked' | 'disabled' | 'reverse' | 'size' | 'value'> & {
  text: string;
};
type Story = StoryObj<Props>;

Icon.register(faMoonStars, faSunBright);

export default {
  title: 'Form/Switch',
  tags: ['stable'],
  args: {
    checked: false,
    disabled: false,
    reverse: false,
    text: 'Text inside the switch',
    value: '12345'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    }
  },
  render: ({ checked, disabled, reverse, size, text, value }) => html`
    <sl-switch ?checked=${checked} ?disabled=${disabled} ?reverse=${reverse} size=${ifDefined(size)} .value=${value}>
      ${text}
    </sl-switch>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Checked: Story = {
  args: {
    checked: true
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Empty: Story = {
  args: {
    text: ''
  },
  render: ({ checked, disabled, reverse, size, text, value }) => html`
    <sl-switch
      aria-label="Switch with no label"
      ?checked=${checked}
      ?disabled=${disabled}
      ?reverse=${reverse}
      size=${ifDefined(size)}
      .value=${value}
    >
      ${text}
    </sl-switch>
  `
};

export const Overflow: Story = {
  args: {
    text: 'Ad fugiat esse qui dolore. Est dolore non aute consectetur nisi commodo magna dolore aute irure elit. Ipsum nulla labore minim anim nisi laborum. Reprehenderit non aliqua aliqua amet in enim dolor duis Lorem. Do magna amet ea laboris aliqua. Eu dolor nostrud adipisicing nostrud in cillum eu magna est non id culpa eiusmod. Esse non cillum officia et ad aute incididunt ea elit commodo adipisicing adipisicing.'
  }
};

export const Reverse: Story = {
  args: {
    reverse: true
  }
};

export const CustomIcons: Story = {
  render: () => {
    return html`
      <sl-switch size="sm" icon-off="far-sun-bright" icon-on="far-moon-stars"></sl-switch>
      <sl-switch icon-off="far-sun-bright" icon-on="far-moon-stars"></sl-switch>
      <sl-switch size="lg" icon-off="far-sun-bright" icon-on="far-moon-stars"></sl-switch>
    `;
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
          hint="This story has custom validation. If you do not toggle the switch, you will see a validation message. NOTE: This is a technical story; this is NOT meant as a functional example. The switch component should never be used in this way."
          label="Do not do this in real code!"
        >
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
        <sl-switch icon-off="far-sun-bright" icon-on="far-moon-stars" size="sm">Unchecked</sl-switch>
        <sl-switch checked icon-off="far-sun-bright" icon-on="far-moon-stars" size="sm">Checked</sl-switch>
        <sl-switch icon-off="far-sun-bright" icon-on="far-moon-stars">Unchecked</sl-switch>
        <sl-switch checked icon-off="far-sun-bright" icon-on="far-moon-stars">Checked</sl-switch>
        <sl-switch icon-off="far-sun-bright" icon-on="far-moon-stars" size="lg">Unchecked</sl-switch>
        <sl-switch checked icon-off="far-sun-bright" icon-on="far-moon-stars" size="lg">Checked</sl-switch>

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
