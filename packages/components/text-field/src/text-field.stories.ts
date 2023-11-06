import type { TextField, TextFieldSize } from './text-field.js';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/form/register.js';
import { html, nothing } from 'lit';
import '../register.js';

export default {
  title: 'Text field'
};

const sizes: TextFieldSize[] = ['md', 'lg'];

export const API: StoryObj = {
  args: {
    disabled: false,
    hintText: '',
    placeholder: 'Type something here',
    prefix: '',
    required: false,
    suffix: '',
    value: '',
    readonly: false,
    size: 'md',
    type: 'text'
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
    },
    min: { type: 'number' },
    max: { type: 'number' },
    step: { type: 'number' }
  },
  render: ({
    disabled,
    hintText,
    maxLength,
    minLength,
    placeholder,
    prefix,
    required,
    suffix,
    value,
    readonly,
    size,
    type,
    min,
    max,
    step
  }) => html`
    <style>
      sl-text-field {
        width: 400px;
      }
    </style>
    <sl-text-field
      ?disabled=${disabled}
      ?required=${required}
      ?readonly=${readonly}
      .hintText=${hintText}
      .max=${max}
      .maxLength=${maxLength}
      .min=${min}
      .minLength=${minLength}
      .placeholder=${placeholder}
      .size=${size}
      .step=${step}
      .type=${type}
      .value=${value}
    >
      ${prefix ? html`<span slot="prefix">${prefix}</span>` : nothing}
      ${suffix ? html`<span slot="suffix">${suffix}</span>` : nothing}
    </sl-text-field>
  `
};

export const Disabled: StoryObj = {
  render: () => html`<sl-text-field disabled value="Input disabled"></sl-text-field>`
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
            <sl-text-field
              minlength="30"
              show-validity="invalid"
              size=${size}
              value="I am ${size} invalid"
            ></sl-text-field>
            <sl-text-field
              minlength="3"
              placeholder="Placeholder ${size} invalid"
              show-validity="invalid"
              size=${size}
            ></sl-text-field>
            <sl-text-field
              disabled
              minlength="30"
              show-validity="invalid"
              size=${size}
              value="${size} invalid disabled"
            ></sl-text-field>
            <sl-text-field
              disabled
              minlength="3"
              placeholder="Placeholder ${size} disabled invalid"
              show-validity="invalid"
              size=${size}
            ></sl-text-field>
          </div>
          <div class="wrapper">
            <sl-text-field show-valid show-validity="valid" size=${size} value="I am ${size} valid"></sl-text-field>
            <sl-text-field
              disabled
              show-valid
              show-validity="valid"
              size=${size}
              value="${size} valid disabled"
            ></sl-text-field>
          </div>
        </div>
      `
    )}
  `
};

export const Size: StoryObj = {
  render: () => {
    return html`
      <style>
        form {
          display: flex;
          flex-direction: column;
        }
        sl-text-field {
          margin-block-end: 1rem;
        }
      </style>
      <form>
        <sl-label for="medium">What is your name?</sl-label>
        <sl-text-field id="medium" placeholder="Medium" size="md"></sl-text-field>

        <sl-label for="large">What is your name?</sl-label>
        <sl-text-field id="large" placeholder="Large" size="lg"></sl-text-field>
      </form>
    `;
  }
};

export const Hint: StoryObj = {
  render: () => {
    return html`
      <style>
        form {
          display: flex;
          flex-direction: column;
        }
        sl-text-field {
          margin-block-end: 1rem;
        }
      </style>
      <form>
        ${sizes.map((size, id) => {
          return html`
            <sl-label for="form-text-field-${id}">Nickname</sl-label>
            <sl-text-field
              .id=${`form-text-field-${id}`}
              .size=${size}
              hint-text="What would you like people to call you?"
            ></sl-text-field>
          `;
        })}
        <sl-label for="input4">Nickname</sl-label>
        <sl-text-field
          id="input4"
          disabled
          hint-text="What would you like people to call you?"
          value="Disabled input"
        ></sl-text-field>
      </form>
    `;
  }
};

export const RichLabelHint: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
    </style>
    <form>
      <sl-label for="input">
        <label slot="label">Custom <i>label</i></label>
      </sl-label>
      <sl-text-field id="input">
        <div slot="hint-text">
          Hint is an accessible way to provide <strong>additional information</strong> that might help the user
        </div>
      </sl-text-field>
    </form>
  `
};

export const ErrorMessageSizes: StoryObj = {
  render: () => {
    setTimeout(() => document.querySelector('form')?.reportValidity());

    return html`
      <style>
        form {
          display: flex;
          flex-direction: column;
        }
        sl-text-field:first-of-type {
          margin-block-end: 0.5rem;
        }
      </style>
      <form>
        <sl-label for="input2">Medium</sl-label>
        <sl-text-field id="input2" name="input" required size="md"></sl-text-field>

        <sl-label for="input3">Large</sl-label>
        <sl-text-field id="input3" name="input" required size="lg"></sl-text-field>
      </form>
    `;
  }
};

export const InputTypes: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
      sl-text-field {
        margin-block-end: 0.5rem;
      }
    </style>
    <form>
      <sl-label for="inputNumber">Number</sl-label>
      <sl-text-field id="inputNumber" type="number" min="0" max="6" step="2"></sl-text-field>

      <sl-label for="inputEmail">Email</sl-label>
      <sl-text-field id="inputEmail" type="email"></sl-text-field>

      <sl-label for="inputTel">Tel</sl-label>
      <sl-text-field id="inputTel" type="tel"></sl-text-field>

      <sl-label for="inputUrl">Url</sl-label>
      <sl-text-field id="inputUrl" type="url"></sl-text-field>
    </form>
  `
};

export const PrefixSuffix: StoryObj = {
  render: () => html`
    <style>
      .wrapper {
        display: flex;
        gap: 1rem;
      }
      sl-text-field {
        width: 400px;
      }
    </style>
    <div class="wrapper">
      <sl-text-field>
        <span slot="prefix">prefix</span>
        <span slot="suffix">suffix</span>
      </sl-text-field>
      <sl-text-field>
        <sl-icon slot="prefix" name="face-smile"></sl-icon>
        <sl-icon slot="suffix" name="face-smile"></sl-icon>
      </sl-text-field>
    </div>
  `
};

export const MinMaxLength: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as TextField)?.reportValidity();
    };

    return html`
      <style>
        sl-text-field {
          width: 300px;
          margin-block-end: 0.5rem;
        }
      </style>
      <sl-text-field minlength="3" maxlength="5" placeholder="Min 3 and max 5 chars" required></sl-text-field>
      <sl-button @click=${onClick} fill="outline">Validate</sl-button>
    `;
  }
};

export const Pattern: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as TextField)?.reportValidity();
    };

    return html`
      <style>
        sl-text-field {
          width: 300px;
          margin-bottom: 8px;
        }
      </style>
      <sl-text-field pattern=".{3,5}" placeholder="Min 3 and max 5 chars using pattern" required></sl-text-field>
      <sl-button @click=${onClick} fill="outline">Validate</sl-button>
    `;
  }
};

export const CustomInput: StoryObj = {
  render: () => html`
    <sl-label for="custom">Custom input with datalist</sl-label>
    <sl-text-field id="custom">
      <input slot="input" list="list" />
      <datalist id="list">
        <option value="123"></option>
        <option value="456"></option>
        <option value="789"></option>
      </datalist>
    </sl-text-field>
  `
};

export const ValidInput: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.parentElement as HTMLFormElement).reportValidity();
    };

    const onInput = (event: Event & { target: TextField }): void => {
      const email = document.querySelector<TextField>('#input1')?.value;

      event.target.setCustomValidity(event.target.value !== email ? 'Enter the same email address' : '');
    };

    return html`
      <style>
        form {
          display: flex;
          flex-direction: column;
          align-items: start;
        }
        sl-text-field {
          width: 400px;
          margin-block-end: 1rem;
        }
      </style>
      <form>
        <sl-label for="input1">Email</sl-label>
        <sl-text-field id="input1" placeholder="email" required type="email"></sl-text-field>

        <sl-label for="input2">Confirm email</sl-label>
        <sl-text-field
          @sl-input=${onInput}
          id="input2"
          placeholder="confirm email"
          required
          show-valid
          type="email"
        ></sl-text-field>

        <sl-button @click=${onClick} fill="outline">Validate</sl-button>
      </form>
    `;
  }
};

export const CustomValidation: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as TextField)?.reportValidity();
    };

    const onInput = (event: Event & { target: TextField }): void => {
      const value = event.target.value;

      event.target.setCustomValidity(!value || value === 'SLDS' ? '' : 'Enter "SLDS"');
    };

    return html`
      <style>
        sl-text-field {
          width: 300px;
          margin-block-end: 0.5rem;
        }
      </style>
      <sl-text-field @sl-input=${onInput} required></sl-text-field>
      <sl-button @click=${onClick} fill="outline">Validate</sl-button>
    `;
  }
};

export const CustomValidationWithHint: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as TextField)?.reportValidity();
    };

    const onInput = (event: Event & { target: TextField }): void => {
      const value = event.target.value;

      event.target.setCustomValidity(!value || value === 'SLDS' ? '' : 'Enter "SLDS"');
    };

    return html`
      <style>
        sl-text-field {
          width: 300px;
          margin-block-end: 0.5rem;
        }
      </style>
      <sl-text-field @sl-input=${onInput} hint-text="You need to enter 'SLDS'" required></sl-text-field>
      <sl-button @click=${onClick} fill="outline">Validate</sl-button>
    `;
  }
};
