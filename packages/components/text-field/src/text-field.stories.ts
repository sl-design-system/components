import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type TextField, type TextFieldSize } from './text-field.js';

type Props = Pick<
  TextField,
  | 'disabled'
  | 'maxLength'
  | 'minLength'
  | 'pattern'
  | 'placeholder'
  | 'readonly'
  | 'required'
  | 'showValid'
  | 'size'
  | 'type'
  | 'value'
> & {
  hint?: string;
  label?: string;
  slot?(): TemplateResult;
};
type Story = StoryObj<Props>;

const sizes: TextFieldSize[] = ['md', 'lg'];

export default {
  title: 'Text field',
  args: {
    disabled: false,
    label: 'Label',
    placeholder: 'Type something here',
    required: false,
    readonly: false,
    showValid: false
  },
  argTypes: {
    maxLength: { type: 'number' },
    minLength: { type: 'number' },
    size: {
      control: 'inline-radio',
      options: sizes
    },
    type: {
      control: 'inline-radio',
      options: ['text', 'number', 'email', 'tel', 'url']
    }
  },
  render: ({
    disabled,
    hint,
    label,
    maxLength,
    minLength,
    pattern,
    placeholder,
    readonly,
    required,
    showValid,
    size,
    slot,
    type,
    value
  }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          ${slot?.() ??
          html`
            <sl-text-field
              ?disabled=${disabled}
              ?readonly=${readonly}
              ?required=${required}
              .maxLength=${maxLength}
              .minLength=${minLength}
              .pattern=${pattern}
              .placeholder=${placeholder ?? ''}
              .showValid=${showValid}
              .size=${size ?? 'md'}
              .type=${type ?? 'text'}
              .value=${value}
            ></sl-text-field>
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

export const MinMaxLength: Story = {
  args: {
    hint: "This field requires a minimum of 3 and a maximum of 5 characters. The browser won't report an error until you type at least 1 character.",
    minLength: 3,
    maxLength: 5
  }
};

export const Pattern: Story = {
  args: {
    hint: 'This field has a pattern that requires you to enter at least 3 characters and at most 5 characters.',
    pattern: '.{3,5}'
  }
};

export const PrefixSuffix: Story = {
  args: {
    hint: 'You can slot content before and after the input by using the prefix and suffix slots.',
    slot: () => html`
      <sl-text-field>
        <sl-icon slot="prefix" name="face-smile"></sl-icon>
        <sl-icon slot="suffix" name="face-smile"></sl-icon>
      </sl-text-field>
    `
  }
};

export const Readonly: Story = {
  args: {
    hint: 'The field is readonly, you can focus it, but you cannot enter any text.',
    readonly: true
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
    hint: 'After clicking the button, this field will show it is valid.',
    showValid: true
  }
};

export const CustomInput: Story = {
  args: {
    hint: 'This field has a custom input element with the spellcheck attribute set.',
    slot: () => html`
      <sl-text-field>
        <input slot="input" spellcheck="false" />
      </sl-text-field>
    `
  }
};

export const CustomValidity: Story = {
  args: {
    hint: 'This story has both builtin validation (required) and custom validation. You need to enter "SLDS" to make the field valid. The custom validation is done by listening to the sl-validate event and setting the custom validity on the input element.',
    slot: () => {
      const onValidate = (event: Event & { target: TextField }): void => {
        const value = event.target.value;

        let message = '';
        if (value.length > 0 && value !== 'SLDS') {
          message = 'Enter "SLDS"';
        }

        console.log({ message });

        event.target.setCustomValidity(message);
      };

      return html`<sl-text-field @sl-validate=${onValidate} required></sl-text-field>`;
    }
  }
};

export const CustomAsyncValidity: Story = {
  args: {
    hint: 'This story has an async validator. You need to enter "SLDS" to make the field valid. It will wait 2 seconds before validating.',
    slot: () => {
      const onValidate = (event: Event & { target: TextField }): void => {
        const promise = new Promise<string>(resolve =>
          setTimeout(() => resolve(event.target.value === 'SLDS' ? '' : 'Enter "SLDS"'), 2000)
        );

        event.target.setCustomValidity(promise);
      };

      return html`<sl-text-field @sl-validate=${onValidate} required></sl-text-field>`;
    }
  }
};

export const All: StoryObj = {
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: () => html`
    <style>
      .content-wrapper {
        display: inline-grid;
        gap: 1rem;
      }
      .wrapper {
        display: inline-grid;
        gap: 1rem;
        grid-template-columns: repeat(2, 1fr);
        justify-items: center;
      }
      sl-text-field {
        width: 300px;
      }
    </style>
    ${sizes.map(
      size => html`
        <h2>Size: ${size}</h2>
        <div class="content-wrapper">
          <div class="wrapper">
            <sl-text-field size=${size} placeholder="Placeholder ${size}"></sl-text-field>
            <sl-text-field size=${size} value="I am ${size}"></sl-text-field>
            <sl-text-field readonly size=${size} value="${size} readonly"></sl-text-field>
            <sl-text-field disabled size=${size} value="${size} disabled"></sl-text-field>
            <sl-text-field disabled size=${size} placeholder="Placeholder ${size} disabled"></sl-text-field>
          </div>
          <div class="wrapper">
            <sl-text-field .size=${size} show-validity="invalid" value="I am ${size} invalid"></sl-text-field>
            <sl-text-field
              .size=${size}
              placeholder="Placeholder ${size} invalid"
              show-validity="invalid"
            ></sl-text-field>
            <sl-text-field
              .size=${size}
              disabled
              show-validity="invalid"
              value="${size} invalid disabled"
            ></sl-text-field>
            <sl-text-field
              .size=${size}
              disabled
              placeholder="Placeholder ${size} disabled invalid"
              show-validity="invalid"
            ></sl-text-field>
          </div>
          <div class="wrapper">
            <sl-text-field show-validity="valid" .size=${size} value="I am ${size} valid"></sl-text-field>
            <sl-text-field .size=${size} disabled show-validity="valid" value="${size} valid disabled"></sl-text-field>
          </div>
        </div>
      `
    )}
  `
};
