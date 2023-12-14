import type { Textarea, TextareaSize } from './textarea.js';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/form/register.js';
import { html } from 'lit';
import '../register.js';

type Props = Pick<
  Textarea,
  | 'disabled'
  | 'maxLength'
  | 'minLength'
  | 'placeholder'
  | 'readonly'
  | 'required'
  | 'rows'
  | 'size'
  | 'resize'
  | 'value'
  | 'wrap'
> & {
  hint?: string;
  label?: string;
  slot?: () => TemplateResult;
};
type Story = StoryObj<Props>;

const sizes: TextareaSize[] = ['md', 'lg'];

export default {
  title: 'Textarea',
  args: {
    disabled: false,
    placeholder: 'Type something here',
    readonly: false,
    required: false,
    resize: 'vertical',
    size: 'md',
    value: null,
    wrap: 'soft'
  },
  argTypes: {
    resize: {
      control: 'inline-radio',
      options: ['none', 'vertical', 'auto']
    },
    size: {
      control: 'inline-radio',
      options: sizes
    },
    value: {
      control: 'text'
    },
    wrap: {
      control: 'inline-radio',
      options: ['soft', 'hard']
    }
  },
  render: ({
    disabled,
    label,
    hint,
    maxLength,
    minLength,
    placeholder,
    required,
    size,
    resize,
    readonly,
    rows,
    slot,
    value,
    wrap
  }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('form')?.reportValidity();
    };

    return html`
      <style>
        sl-button-bar {
          margin-block-start: 1rem;
        }
      </style>
      <form>
        <sl-form-field .hint=${hint} .label=${label}>
          ${slot?.() ??
          html`
            <sl-textarea
              ?disabled=${disabled}
              ?readonly=${readonly}
              ?required=${required}
              .maxLength=${maxLength}
              .minLength=${minLength}
              .placeholder=${placeholder ?? ''}
              .resize=${resize}
              .rows=${rows}
              .size=${size}
              .value=${value}
              .wrap=${wrap}
            ></sl-textarea>
          `}
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onClick}>Report validity</sl-button>
        </sl-button-bar>
      </form>
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
    hint: 'After clicking the button, this field will show it is valid.'
  }
};

export const CustomValidity: StoryObj = {
  args: {
    hint: 'Type "SLDS" to make the field valid.',
    slot: () => {
      const onChange = (event: Event & { target: Textarea }): void => {
        const value = event.target.value;

        event.target.setCustomValidity(!value || value === 'SLDS' ? '' : 'Enter "SLDS"');
      };

      return html`<sl-textarea @sl-change=${onChange}></sl-textarea>`;
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
      sl-textarea {
        width: 300px;
      }
    </style>

    ${sizes.map(
      size => html`
        <h2>Size: ${size}</h2>
        <div class="content-wrapper">
          <div class="wrapper">
            <sl-textarea size=${size} placeholder="Placeholder ${size}"></sl-textarea>
            <sl-textarea size=${size} value="I am ${size}"></sl-textarea>
            <sl-textarea readonly size=${size} value="${size} readonly"></sl-textarea>
            <sl-textarea disabled size=${size} value="${size} disabled"></sl-textarea>
            <sl-textarea disabled size=${size} placeholder="Placeholder ${size} disabled"></sl-textarea>
          </div>
          <div class="wrapper">
            <sl-textarea show-validity="invalid" size=${size} value="${size} invalid"></sl-textarea>
            <sl-textarea placeholder="Placeholder ${size} invalid" show-validity="invalid" size=${size}></sl-textarea>
            <sl-textarea disabled show-validity="invalid" size=${size} value="${size} invalid disabled"></sl-textarea>
            <sl-textarea
              disabled
              placeholder="Placeholder ${size} disabled invalid"
              size=${size}
              show-validity="invalid"
            ></sl-textarea>
          </div>
          <div class="wrapper">
            <sl-textarea show-valid show-validity="valid" size=${size} value="I am md valid"></sl-textarea>
            <sl-textarea
              disabled
              show-valid
              show-validity="valid"
              size=${size}
              value="${size} valid disabled"
            ></sl-textarea>
          </div>
        </div>
      `
    )}
  `
};
