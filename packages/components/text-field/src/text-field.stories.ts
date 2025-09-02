import { faCalendar } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { TextField } from './text-field.js';

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

Icon.register(faCalendar);

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
      options: ['md', 'lg']
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

export const Standalone: Story = {
  render: () => {
    return html`
      <style>
        p {
          margin: 0 0 1rem 0;
        }
      </style>
      <p>
        This story shows how you can use a standalone text field, outside of a form, while still keeping it accessible.
        To do this, we slot a custom input with the aria-label property set into the component.
      </p>
      <sl-text-field>
        <input slot="input" aria-label="Text field" />
      </sl-text-field>
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
          grid-template-columns: auto 1fr 1fr;
        }
      </style>
      <div class="wrapper">
        <span></span>
        <span style="justify-self: center">md</span>
        <span style="justify-self: center">lg</span>

        <span>Empty</span>
        <sl-text-field aria-label="Text field" placeholder="Placeholder"></sl-text-field>
        <sl-text-field aria-label="Text field" placeholder="Placeholder" size="lg"></sl-text-field>

        <span>Value</span>
        <sl-text-field aria-label="Text field" value="Value"></sl-text-field>
        <sl-text-field aria-label="Text field" size="lg" value="Value"></sl-text-field>

        <span>Invalid</span>
        <sl-text-field aria-label="Text field" show-validity="invalid" value="Invalid"></sl-text-field>
        <sl-text-field aria-label="Text field" show-validity="invalid" size="lg" value="Invalid"></sl-text-field>

        <span>Valid</span>
        <sl-text-field aria-label="Text field" show-validity="valid" value="Valid"></sl-text-field>
        <sl-text-field aria-label="Text field" show-validity="valid" size="lg" value="Valid"></sl-text-field>

        <span>Prefix/suffix</span>
        <sl-text-field aria-label="Text field" placeholder="Placeholder">
          <sl-icon slot="prefix" name="face-smile"></sl-icon>
          <sl-icon slot="suffix" name="face-smile"></sl-icon>
        </sl-text-field>
        <sl-text-field aria-label="Text field" placeholder="Placeholder" size="lg">
          <sl-icon slot="prefix" name="face-smile"></sl-icon>
          <sl-icon slot="suffix" name="face-smile"></sl-icon>
        </sl-text-field>

        <span>Field button</span>
        <sl-text-field aria-label="Text field" placeholder="Placeholder">
          <sl-field-button aria-label="Show calendar" slot="suffix">
            <sl-icon name="far-calendar"></sl-icon>
          </sl-field-button>
        </sl-text-field>
        <sl-text-field aria-label="Text field" placeholder="Placeholder" size="lg">
          <sl-field-button aria-label="Show calendar" slot="suffix">
            <sl-icon name="far-calendar"></sl-icon>
          </sl-field-button>
        </sl-text-field>

        <span>Readonly</span>
        <sl-text-field aria-label="Text field" readonly value="Value"></sl-text-field>
        <sl-text-field aria-label="Text field" readonly size="lg" value="Value"></sl-text-field>

        <span>Disabled</span>
        <sl-text-field aria-label="Text field" disabled value="Value"></sl-text-field>
        <sl-text-field aria-label="Text field" disabled size="lg" value="Value"></sl-text-field>
      </div>
    `;
  }
};
