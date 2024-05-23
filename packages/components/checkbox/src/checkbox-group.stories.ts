import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type CheckboxGroup } from './checkbox-group.js';

type Props = Pick<CheckboxGroup, 'disabled' | 'required' | 'size' | 'value'> & {
  hint?: string;
  label?: string;
  slot?(): TemplateResult;
  boxes?(): TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Form/Checkbox group',
  tags: ['stable'],
  args: {
    disabled: false,
    label: 'Label',
    size: 'md'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    }
  },
  render: ({ boxes, disabled, hint, label, required, size, slot, value }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          ${slot?.() ??
          html`
            <sl-checkbox-group
              ?disabled=${disabled}
              ?required=${required}
              .label=${label}
              .size=${size}
              .value=${value}
            >
              ${boxes?.() ??
              html`
                <sl-checkbox value="0">Option 1</sl-checkbox>
                <sl-checkbox value="1">Option 2</sl-checkbox>
                <sl-checkbox value="2">Option 3</sl-checkbox>
                <sl-checkbox disabled value="2">Option 4</sl-checkbox>
              `}
            </sl-checkbox-group>
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

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Required: Story = {
  args: {
    hint: 'This checkbox is required and should display an error after reporting the validity',
    required: true
  }
};

export const CustomValidity: Story = {
  args: {
    hint: 'This story has both builtin validation (required) and custom validation. You need to select the middle option to make the field valid. The custom validation is done by listening to the sl-validate event and setting the custom validity on the checkbox group.',
    slot: () => {
      const onValidate = (event: Event & { target: CheckboxGroup }): void => {
        event.target.setCustomValidity(event.target.value?.includes('2') ? '' : 'Pick the middle option');
      };

      return html`
        <sl-checkbox-group @sl-validate=${onValidate} required>
          <sl-checkbox value="1">One</sl-checkbox>
          <sl-checkbox value="2">Two</sl-checkbox>
          <sl-checkbox value="3">Three</sl-checkbox>
        </sl-checkbox-group>
      `;
    }
  }
};

export const CustomAsyncValidity: Story = {
  args: {
    hint: 'This story has an async validator. You need to select the middle option to make the field valid. It will wait 2 seconds before validating.',
    slot: () => {
      const onValidate = (event: Event & { target: CheckboxGroup }): void => {
        if (!event.target.value?.length) {
          return;
        }

        const promise = new Promise<string>(resolve =>
          setTimeout(() => resolve(event.target.value?.includes('2') ? '' : 'Pick the middle option'), 2000)
        );

        event.target.setCustomValidity(promise);
      };

      return html`
        <sl-checkbox-group @sl-validate=${onValidate} required>
          <sl-checkbox value="1">One</sl-checkbox>
          <sl-checkbox value="2">Two</sl-checkbox>
          <sl-checkbox value="3">Three</sl-checkbox>
        </sl-checkbox-group>
      `;
    }
  }
};
