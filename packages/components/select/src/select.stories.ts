import type { Select, SelectSize } from './select.js';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/avatar/register.js';
import '@sl-design-system/form/register.js';
import { html } from 'lit';
import '../register.js';

type Props = Pick<Select, 'disabled' | 'placeholder' | 'required' | 'size' | 'value'> & {
  hint?: string;
  label?: string;
  options?: TemplateResult;
  slot?: () => TemplateResult;
};
type Story = StoryObj<Props>;

const sizes: SelectSize[] = ['md', 'lg'];

export default {
  title: 'Select',
  args: {
    disabled: false,
    label: 'Label',
    placeholder: 'Select an option',
    required: false,
    size: 'md',
    value: null
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes
    },
    value: {
      control: 'text'
    }
  },
  render: ({ disabled, hint, label, options, placeholder, required, size, slot }) => {
    return html`
      <sl-form-field .hint=${hint} .label=${label}>
        ${slot?.() ??
        html`
          <sl-select ?disabled=${disabled} ?required=${required} .placeholder=${placeholder} .size=${size}>
            ${options ??
            html`
              <sl-select-option value="1">Option 1</sl-select-option>
              <sl-select-option value="2">Option 2</sl-select-option>
              <sl-select-option value="3">Option 3</sl-select-option>
            `}
          </sl-select>
        `}
      </sl-form-field>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const EmbeddedComponents: Story = {
  args: {
    options: html`
      <sl-select-option>
        <sl-avatar uniqueProfileId="1"></sl-avatar>
      </sl-select-option>
      <sl-select-option selected>
        <sl-avatar uniqueProfileId="2"></sl-avatar>
      </sl-select-option>
      <sl-select-option>
        <sl-avatar uniqueProfileId="3"></sl-avatar>
      </sl-select-option>
      <sl-select-option>
        <sl-avatar uniqueProfileId="14"></sl-avatar>
      </sl-select-option>
      <sl-select-option disabled>
        <sl-avatar uniqueProfileId="4"></sl-avatar>
      </sl-select-option>
      <sl-select-option>
        <sl-avatar uniqueProfileId="5"></sl-avatar>
      </sl-select-option>
    `
  }
};

export const Groups: Story = {
  args: {
    options: html`
      <sl-select-option-group group-heading="Happy">
        <sl-select-option>😄 Grinning Face with Smiling Eyes</sl-select-option>
        <sl-select-option>😂 Face with Tears of Joy</sl-select-option>
        <sl-select-option>😊 Smiling Face with Smiling Eyes</sl-select-option>
        <sl-select-option>🤩 Star-Struck</sl-select-option>
        <sl-select-option disabled>🙂 Slightly Smiling Face</sl-select-option>
        <sl-select-option>🥳 Partying Face</sl-select-option>
      </sl-select-option-group>
      <sl-select-option>😶 Unfazed</sl-select-option>
      <sl-select-option-group group-heading="Sad">
        <sl-select-option>😒 Unamused Face</sl-select-option>
        <sl-select-option>🤧 Sneezing Face</sl-select-option>
        <sl-select-option>😓 Downcast Face with Sweat</sl-select-option>
        <sl-select-option>😡 Enraged Face</sl-select-option>
      </sl-select-option-group>
      <sl-select-option-group>
        <sl-select-option>🐷 Pig</sl-select-option>
        <sl-select-option selected>🐨 Koala</sl-select-option>
        <sl-select-option>🐼 Panda</sl-select-option>
        <sl-select-option>🦊 Fox</sl-select-option>
      </sl-select-option-group>
      <sl-select-option>🤖 Robot</sl-select-option>
    `
  }
};

export const Overflow: Story = {
  args: {
    placeholder:
      'Cupidatat adipisicing adipisicing dolore in ea ea magna culpa Lorem aute veniam in. Laboris ea pariatur velit adipisicing pariatur aliqua Lorem est aliqua Lorem minim excepteur.',
    options: html`
      <sl-select-option value="1">
        Voluptate sint ullamco proident cillum sint nostrud laborum labore et ad minim veniam eiusmod.
      </sl-select-option>
      <sl-select-option value="2">Consequat cupidatat amet sunt laborum laborum quis.</sl-select-option>
      <sl-select-option value="3">
        Culpa cillum nulla aute non quis deserunt minim sit magna. Consectetur in laborum mollit ea cillum dolor est ut
        deserunt qui nostrud deserunt. Labore adipisicing anim non sint.
      </sl-select-option>
    `
  }
};

export const Required: Story = {
  args: {
    hint: 'This field is required, if you leave it empty you will see an error message when clicking the button.',
    required: true
  }
};

export const Valid: Story = {
  args: {
    hint: 'After clicking the button, this field will show it is valid.'
  }
};

export const All: StoryObj = {
  render: () => {
    const states: string[] = ['', 'valid', 'invalid'];
    const disabledStates = [false, true];

    const options = html`
      <sl-select-option>🐷 Pig</sl-select-option>
      <sl-select-option selected>🐨 Koala</sl-select-option>
      <sl-select-option>🐼 Panda</sl-select-option>
      <sl-select-option>🦊 Fox</sl-select-option>
    `;

    return html` <style>
        table {
          border-collapse: collapse;
        }
        th {
          text-transform: capitalize;
        }
        th,
        td {
          padding: 4px 8px;
        }
        thead td {
          text-align: center;
        }
      </style>
      ${sizes.map(
        size => html`<h2>Size: ${size}</h2>
          <table>
            <thead>
              <tr>
                <td></td>
                ${disabledStates.map(
                  disabledState =>
                    html` <td class="${disabledState ? 'sb-disabled' : ''}">
                      ${disabledState ? 'Disabled' : 'Enabled'}
                    </td>`
                )}
              </tr>
            </thead>
            <tbody>
              ${states.map(
                state => html` <tr>
                  <th>${state}</th>
                  ${disabledStates.map(
                    disabledState => html` <td class="${disabledState ? 'sb-disabled' : ''}">
                      <sl-select
                        ?valid=${state === 'valid'}
                        ?invalid=${state === 'invalid'}
                        ?required=${state === 'invalid'}
                        .size=${size}
                        ?disabled=${disabledState}
                        data-mock-state
                        >${options}
                      </sl-select>
                    </td>`
                  )}
                </tr>`
              )}
              ${states.map(
                state => html`<tr>
                  <th>Placeholder ${state}</th>
                  ${disabledStates.map(
                    disabledState => html`
                      <td class="${disabledState ? 'sb-disabled' : ''}">
                        <sl-select
                          ?valid=${state === 'valid'}
                          ?invalid=${state === 'invalid'}
                          ?required=${state === 'invalid'}
                          .size=${size}
                          ?disabled=${disabledState}
                          data-mock-state
                          placeholder="Placeholder"
                          ><sl-select-option .size=${size} ?disabled=${disabledState}>Hamster</sl-select-option>
                        </sl-select>
                      </td>
                    `
                  )}
                </tr>`
              )}
              <tr>
                <th>Unselected Option</th>
                ${disabledStates.map(
                  disabledState => html`
                    <td class="${disabledState ? 'sb-disabled' : ''}">
                      <sl-select-option .size=${size} ?disabled=${disabledState}>🐹 Hamster</sl-select-option>
                    </td>
                  `
                )}
              </tr>
              <tr>
                <th>Selected Option</th>
                ${disabledStates.map(
                  disabledState => html`
                    <td class="${disabledState ? 'sb-disabled' : ''}">
                      <sl-select-option .size=${size} ?disabled=${disabledState} selected>🐹 Hamster</sl-select-option>
                    </td>
                  `
                )}
              </tr>
            </tbody>
          </table>`
      )}`;
  }
};
