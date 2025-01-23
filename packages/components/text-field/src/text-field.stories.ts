import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { TextField, type TextFieldSize } from './text-field.js';

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
  control?(): TemplateResult;
  slot?(): TemplateResult;
};
type Story = StoryObj<Props>;

const sizes: TextFieldSize[] = ['md', 'lg'];

export default {
  title: 'Form/Text field',
  tags: ['stable'],
  args: {
    disabled: false,
    label: 'Label',
    placeholder: 'Type something here',
    readonly: false,
    required: false,
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
    control,
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
          ${control?.() ??
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
              >${slot?.() ?? nothing}</sl-text-field
            >
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
      <sl-icon slot="prefix" name="face-smile"></sl-icon>
      <sl-icon slot="suffix" name="face-smile"></sl-icon>
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
    slot: () => html`<input slot="input" spellcheck="false" />`
  }
};

export const CustomValidity: Story = {
  args: {
    hint: 'This story has both builtin validation (required) and custom validation. You need to enter "SLDS" to make the field valid. The custom validation is done by listening to the sl-validate event and setting the custom validity on the input element.',
    control: () => {
      const onValidate = (event: Event & { target: TextField }): void => {
        const value = event.target.value?.toString() ?? '';

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
    control: () => {
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

// export const CustomComponent: Story = {
//   args: {
//     hint: 'This story uses a custom component that inherits from the text field component. It parses and formats the value as a date in the format "DD-MM-YYYY". The field is invalid if the year is before 2024.',
//     control: () => {
//       class CustomTextField extends TextField<Date> {
//         #value?: Date;

//           if (!match) {
//             throw new Error('Invalid date format');
//           } else {
//             const [, day, month, year] = match,
//               date = new Date(`${year}-${month}-${day}`);

//             if (isNaN(date.getTime())) {
//               throw new Error('Invalid date');
//             }

//             return date;
//           }
//         }

//         /** Format the date as DD-MM-YYYY. */
//         override formatValue(value?: Date): string {
//           return value?.toLocaleDateString() ?? '';
//         }
//       }

//       try {
//         customElements.define('custom-text-field', CustomTextField);
//       } catch {
//         /* empty */
//       }

//       const onValidate = (event: Event & { target: CustomTextField }): void => {
//         const year = event.target.value?.getFullYear();

//         if (typeof year === 'number') {
//           event.target.setCustomValidity(year < 2024 ? 'Enter a date after 2023' : '');
//         } else {
//           event.target.setCustomValidity('');
//         }
//       };

//       return html`
//         <custom-text-field
//           @sl-validate=${onValidate}
//           placeholder="Enter a DD-MM-YYYY value"
//           required
//         ></custom-text-field>
//       `;
//     }
//   }
// };

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
            <sl-text-field aria-label="label" size=${size} placeholder="Placeholder ${size}"></sl-text-field>
            <sl-text-field aria-label="label" size=${size} value="I am ${size}"></sl-text-field>
            <sl-text-field aria-label="label" readonly size=${size} value="${size} readonly"></sl-text-field>
            <sl-text-field aria-label="label" disabled size=${size} value="${size} disabled"></sl-text-field>
            <sl-text-field
              aria-label="label"
              disabled
              size=${size}
              placeholder="Placeholder ${size} disabled"
            ></sl-text-field>
          </div>
          <div class="wrapper">
            <sl-text-field
              aria-label="label"
              .size=${size}
              show-validity="invalid"
              value="I am ${size} invalid"
            ></sl-text-field>
            <sl-text-field
              aria-label="label"
              .size=${size}
              placeholder="Placeholder ${size} invalid"
              show-validity="invalid"
            ></sl-text-field>
            <sl-text-field
              aria-label="label"
              .size=${size}
              disabled
              show-validity="invalid"
              value="${size} invalid disabled"
            ></sl-text-field>
            <sl-text-field
              aria-label="label"
              .size=${size}
              disabled
              placeholder="Placeholder ${size} disabled invalid"
              show-validity="invalid"
            ></sl-text-field>
          </div>
          <div class="wrapper">
            <sl-text-field
              aria-label="label"
              show-validity="valid"
              .size=${size}
              value="I am ${size} valid"
            ></sl-text-field>
            <sl-text-field
              aria-label="label"
              .size=${size}
              disabled
              show-validity="valid"
              value="${size} valid disabled"
            ></sl-text-field>
          </div>
        </div>
      `
    )}
  `
};
