import '@sl-design-system/avatar/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type FormControlShowValidity } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Select, type SelectSize } from './select.js';

type Props = Pick<Select, 'disabled' | 'placeholder' | 'required' | 'size' | 'value'> & {
  hint?: string;
  label?: string;
  options?: TemplateResult;
  slot?(): TemplateResult;
};
type Story = StoryObj<Props>;

const sizes: SelectSize[] = ['md', 'lg'];

export default {
  title: 'Components/Select',
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
  render: ({ disabled, hint, label, options, placeholder, required, size, slot, value }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          ${slot?.() ??
          html`
            <sl-select
              ?disabled=${disabled}
              ?required=${required}
              .placeholder=${placeholder}
              .size=${size}
              .value=${value}
            >
              ${options ??
              html`
                <sl-select-option value="1">Option 1</sl-select-option>
                <sl-select-option value="2">Option 2</sl-select-option>
                <sl-select-option value="3">Option 3</sl-select-option>
              `}
            </sl-select>
          `}
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onClick}>Report validity</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Clear: Story = {
  args: {
    options: html`
      <sl-select-option>&nbsp;</sl-select-option>
      <sl-select-option value="1">Option 1</sl-select-option>
      <sl-select-option value="2">Option 2</sl-select-option>
      <sl-select-option value="3">Option 3</sl-select-option>
    `
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const EmbeddedComponents: Story = {
  args: {
    placeholder: 'Select a student',
    slot: () => html`
      <style>
        sl-select-button::part(selected),
        sl-select-option {
          align-items: center;
          display: flex;
        }
        sl-select-button::part(selected) {
          padding-block: 3px;
        }
        sl-select-option {
          padding-block: 4px;
        }
      </style>
      <sl-select value="2">
        <sl-select-option value="1">
          <sl-avatar size="sm" user='{"name":{"first":"Ashley","last":"Howard"}}'></sl-avatar>
        </sl-select-option>
        <sl-select-option value="2">
          <sl-avatar size="sm" user='{"name":{"first":"Aria","last":"Bailey"}}'></sl-avatar>
        </sl-select-option>
        <sl-select-option value="3">
          <sl-avatar size="sm" user='{"name":{"first":"Cooper","last":"Philips"}}'></sl-avatar>
        </sl-select-option>
        <sl-select-option value="4">
          <sl-avatar size="sm" user='{"name":{"first":"Abigail","last":"Lewis"}}'></sl-avatar>
        </sl-select-option>
        <sl-select-option disabled value="5">
          <sl-avatar size="sm" user='{"name":{"first":"Ryder","last":"Turner"}}'></sl-avatar>
        </sl-select-option>
        <sl-select-option value="6">
          <sl-avatar size="sm" user='{"name":{"first":"Zoe","last":"Robinson"}}'></sl-avatar>
        </sl-select-option>
      </sl-select>
    `
  }
};

export const Empty: Story = {
  args: {
    placeholder: undefined
  }
};

export const Groups: Story = {
  args: {
    options: html`
      <sl-select-option-group heading="Happy">
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

export const OptionOverflow: Story = {
  args: {
    hint: 'This field has a lot of options, try scrolling through them.',
    options: html`
      ${Array.from(
        { length: 100 },
        (_, i) => html`<sl-select-option value=${i + 1}>Option ${i + 1}</sl-select-option>`
      )}
    `
  }
};

export const Required: Story = {
  args: {
    hint: 'This field is required, if you leave it empty you will see an error message when clicking the button.',
    required: true
  }
};

export const Selected: Story = {
  args: {
    value: '2'
  }
};

export const TextOverflow: Story = {
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

export const Valid: Story = {
  args: {
    hint: 'After clicking the button, this field will show it is valid.'
  }
};

export const CustomValidity: Story = {
  args: {
    hint: 'This story has both builtin validation (required) and custom validation. The second option should be selected to make the field valid. In this example, you should never see the builtin validation message.',
    slot: () => {
      const onValidate = (event: Event & { target: Select }): void => {
        const value = event.target.value;

        event.target.setCustomValidity(value === '2' ? '' : 'Select the second option.');
      };

      return html`
        <sl-select @sl-validate=${onValidate} required>
          <sl-select-option value="1">Option 1</sl-select-option>
          <sl-select-option value="2">Option 2</sl-select-option>
          <sl-select-option value="3">Option 3</sl-select-option>
        </sl-select>
      `;
    }
  }
};

export const CustomAsyncValidity: Story = {
  args: {
    hint: 'This story has an async validator. You need to the second option to make the field valid. It will wait 2 seconds before validating.',
    slot: () => {
      const onValidate = (event: Event & { target: Select }): void => {
        const promise = new Promise<string>(resolve =>
          setTimeout(() => resolve(event.target.value === '2' ? '' : 'Select the second option'), 2000)
        );

        event.target.setCustomValidity(promise);
      };

      return html`
        <sl-select @sl-validate=${onValidate} required>
          <sl-select-option value="1">Option 1</sl-select-option>
          <sl-select-option value="2">Option 2</sl-select-option>
          <sl-select-option value="3">Option 3</sl-select-option>
        </sl-select>
      `;
    }
  }
};

export const All: StoryObj = {
  render: () => {
    const disabledStates = [false, true],
      states: FormControlShowValidity[] = [undefined, 'valid', 'invalid'];

    const options = html`
      <sl-select-option value="1">🐷 Pig</sl-select-option>
      <sl-select-option value="2">🐨 Koala</sl-select-option>
      <sl-select-option value="3">🐼 Panda</sl-select-option>
      <sl-select-option value="4">🦊 Fox</sl-select-option>
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
        size => html`
          <h2>Size: ${size}</h2>
          <table>
            <thead>
              <tr>
                <td></td>
                ${disabledStates.map(
                  state => html`<td class=${state ? 'sb-disabled' : ''}>${state ? 'Disabled' : 'Enabled'}</td>`
                )}
              </tr>
            </thead>
            <tbody>
              ${states.map(
                state => html`
                  <tr>
                    <th>${state}</th>
                    ${disabledStates.map(
                      disabledState => html`
                        <td class=${disabledState ? 'sb-disabled' : ''}>
                          <sl-select
                            ?disabled=${disabledState}
                            ?required=${state === 'invalid'}
                            .showValid=${state === 'valid'}
                            .showValidity=${state}
                            .size=${size}
                            data-mock-state
                            value="1"
                            >${options}
                          </sl-select>
                        </td>
                      `
                    )}
                  </tr>
                `
              )}
              ${states.map(
                state =>
                  html`<tr>
                    <th>Placeholder ${state}</th>
                    ${disabledStates.map(
                      disabledState => html`
                        <td class=${disabledState ? 'sb-disabled' : ''}>
                          <sl-select
                            ?disabled=${disabledState}
                            ?required=${state === 'invalid'}
                            .showValid=${state === 'valid'}
                            .showValidity=${state}
                            .size=${size}
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
                  state => html`
                    <td class=${state ? 'sb-disabled' : ''}>
                      <sl-select-option .size=${size} ?disabled=${state}>🐹 Hamster</sl-select-option>
                    </td>
                  `
                )}
              </tr>
              <tr>
                <th>Selected Option</th>
                ${disabledStates.map(
                  state => html`
                    <td class=${state ? 'sb-disabled' : ''}>
                      <sl-select-option .size=${size} ?disabled=${state} selected>🐹 Hamster</sl-select-option>
                    </td>
                  `
                )}
              </tr>
            </tbody>
          </table>
        `
      )}`;
  }
};
