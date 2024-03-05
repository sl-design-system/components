import { faRabbitRunning, faTurtle } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type Switch, type SwitchSize } from './switch.js';

type Props = Pick<Switch, 'checked' | 'disabled' | 'reverse' | 'size' | 'value'> & {
  text: string;
};
type Story = StoryObj<Props>;

const sizes: SwitchSize[] = ['sm', 'md', 'lg'];

export default {
  title: 'Switch',
  args: {
    checked: false,
    disabled: false,
    reverse: false,
    size: 'md',
    text: 'Text inside the switch',
    value: '12345'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes
    }
  },
  render: ({ checked, disabled, reverse, size, text, value }) => html`
    <sl-switch ?checked=${checked} ?disabled=${disabled} ?reverse=${reverse} .size=${size} .value=${value}>
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
  }
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
    Icon.register(faTurtle, faRabbitRunning);

    return html`${sizes.map(
      size => html`<sl-switch .size=${size} icon-off="far-turtle" icon-on="far-rabbit-running"></sl-switch>`
    )}`;
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

export const All: StoryObj = {
  render: () => {
    return html`
      <style>
        table {
          border-collapse: collapse;
          border-spacing: 0;
        }
        td[colspan] {
          font-weight: bold;
          padding-block-start: 1rem;
          text-align: center;
        }
        td + td {
          padding-inline-start: 1rem;
        }
      </style>
      <table>
        <tbody>
          ${sizes.map(
            size => html`
              <tr>
                <td colspan="2">${size}</td>
              </tr>
              <tr>
                <td>
                  <sl-switch .size=${size}>Toggle me</sl-switch>
                  <sl-switch .size=${size} disabled>Toggle me</sl-switch>
                </td>
                <td>
                  <sl-switch .size=${size} checked>Toggle me</sl-switch>
                  <sl-switch .size=${size} checked disabled>Toggle me</sl-switch>
                </td>
              </tr>
            `
          )}
          </tr>
        </tbody>
      </table>
    `;
  }
};
