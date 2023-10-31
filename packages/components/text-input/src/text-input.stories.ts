import type { InputSize, TextInput } from './text-input';
import type { LabelSize } from '@sl-design-system/label';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/label/register.js';
import { html, nothing } from 'lit';
import '../register.js';

export default {
  title: 'Text Input'
};

const sizes: InputSize[] = ['md', 'lg'],
  labelSizes: LabelSize[] = ['sm', 'md', 'lg'];

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
      sl-text-input {
        width: 400px;
      }
    </style>
    <sl-text-input
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
    </sl-text-input>
  `
};

export const Disabled: StoryObj = {
  render: () => html`<sl-text-input disabled value="Input disabled"></sl-text-input>`
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
      sl-text-input {
        width: 300px;
      }
    </style>
    ${sizes.map(
      size => html`
        <h2>Size: ${size}</h2>
        <div class="content-wrapper">
          <div class="wrapper">
            <sl-text-input size=${size} placeholder="Placeholder ${size}"></sl-text-input>
            <sl-text-input size=${size} value="I am ${size}"></sl-text-input>
            <sl-text-input readonly size=${size} value="${size} readonly"></sl-text-input>
            <sl-text-input disabled size=${size} value="${size} disabled"></sl-text-input>
            <sl-text-input disabled size=${size} placeholder="Placeholder ${size} disabled"></sl-text-input>
          </div>
          <div class="wrapper">
            <sl-text-input
              minlength="30"
              show-validity="invalid"
              size=${size}
              value="I am ${size} invalid"
            ></sl-text-input>
            <sl-text-input
              minlength="3"
              placeholder="Placeholder ${size} invalid"
              show-validity="invalid"
              size=${size}
            ></sl-text-input>
            <sl-text-input
              disabled
              minlength="30"
              show-validity="invalid"
              size=${size}
              value="${size} invalid disabled"
            ></sl-text-input>
            <sl-text-input
              disabled
              minlength="3"
              placeholder="Placeholder ${size} disabled invalid"
              show-validity="invalid"
              size=${size}
            ></sl-text-input>
          </div>
          <div class="wrapper">
            <sl-text-input show-valid show-validity="valid" size=${size} value="I am ${size} valid"></sl-text-input>
            <sl-text-input
              disabled
              show-valid
              show-validity="valid"
              size=${size}
              value="${size} valid disabled"
            ></sl-text-input>
          </div>
        </div>
      `
    )}
  `
};

export const Label: StoryObj = {
  render: () => {
    return html`
      <style>
        form {
          display: flex;
          flex-direction: column;
        }

        sl-text-input {
          margin-block-end: 16px;
        }
      </style>
      <form>
        ${labelSizes.map((size, id) => {
          const inputSize = size === 'lg' ? size : 'md';

          return html`
            <sl-label for="form-text-input-${id}" size=${size}>What is your name?</sl-label>
            <sl-text-input id="form-text-input-${id}" size=${inputSize}></sl-text-input>
          `;
        })}
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
        sl-text-input {
          margin-block-end: 1rem;
        }
      </style>
      <form>
        ${sizes.map((size, id) => {
          return html`
            <sl-label for="form-text-input-${id}">Nickname</sl-label>
            <sl-text-input
              .id=${`form-text-input-${id}`}
              .size=${size}
              hint-text="What would you like people to call you?"
            ></sl-text-input>
          `;
        })}
        <sl-label for="input4">Nickname</sl-label>
        <sl-text-input
          id="input4"
          disabled
          hint-text="What would you like people to call you?"
          value="Disabled input"
        ></sl-text-input>
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
      <sl-text-input id="input">
        <div slot="hint-text">
          Hint is an accessible way to provide <strong>additional information</strong> that might help the user
        </div>
      </sl-text-input>
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
        sl-text-input:first-of-type {
          margin-block-end: 0.5rem;
        }
      </style>
      <form>
        <sl-label for="input2" size="md">Medium</sl-label>
        <sl-text-input id="input2" name="input" required size="md"></sl-text-input>

        <sl-label for="input3" size="lg">Large</sl-label>
        <sl-text-input id="input3" name="input" required size="lg"></sl-text-input>
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
      sl-text-input {
        margin-block-end: 0.5rem;
      }
    </style>
    <form>
      <sl-label for="inputNumber">Number</sl-label>
      <sl-text-input id="inputNumber" type="number" min="0" max="6" step="2"></sl-text-input>

      <sl-label for="inputEmail">Email</sl-label>
      <sl-text-input id="inputEmail" type="email"></sl-text-input>

      <sl-label for="inputTel">Tel</sl-label>
      <sl-text-input id="inputTel" type="tel"></sl-text-input>

      <sl-label for="inputUrl">Url</sl-label>
      <sl-text-input id="inputUrl" type="url"></sl-text-input>
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
      sl-text-input {
        width: 400px;
      }
    </style>
    <div class="wrapper">
      <sl-text-input>
        <span slot="prefix">prefix</span>
        <span slot="suffix">suffix</span>
      </sl-text-input>
      <sl-text-input>
        <sl-icon slot="prefix" name="face-smile"></sl-icon>
        <sl-icon slot="suffix" name="face-smile"></sl-icon>
      </sl-text-input>
    </div>
  `
};

export const MinMaxLength: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as TextInput)?.reportValidity();
    };

    return html`
      <style>
        sl-text-input {
          width: 300px;
          margin-block-end: 0.5rem;
        }
      </style>
      <sl-text-input minlength="3" maxlength="5" placeholder="Min 3 and max 5 chars" required></sl-text-input>
      <sl-button @click=${onClick} fill="outline">Validate</sl-button>
    `;
  }
};

export const Pattern: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as TextInput)?.reportValidity();
    };

    return html`
      <style>
        sl-text-input {
          width: 300px;
          margin-bottom: 8px;
        }
      </style>
      <sl-text-input pattern=".{3,5}" placeholder="Min 3 and max 5 chars using pattern" required></sl-text-input>
      <sl-button @click=${onClick} fill="outline">Validate</sl-button>
    `;
  }
};

export const CustomInput: StoryObj = {
  render: () => html`
    <sl-label for="custom">Custom input with datalist</sl-label>
    <sl-text-input id="custom">
      <input slot="input" list="list" />
      <datalist id="list">
        <option value="123"></option>
        <option value="456"></option>
        <option value="789"></option>
      </datalist>
    </sl-text-input>
  `
};

export const ValidInput: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.parentElement as HTMLFormElement).reportValidity();
    };

    const onInput = (event: Event & { target: HTMLInputElement }): void => {
      const email = document.querySelector<TextInput>('#input1')?.value;

      (event.target.parentElement as TextInput).setCustomValidity(
        event.target.value !== email ? 'Enter the same email address' : ''
      );
    };

    return html`
      <style>
        form {
          display: flex;
          flex-direction: column;
          align-items: start;
        }
        sl-text-input {
          width: 400px;
          margin-block-end: 1rem;
        }
      </style>
      <form>
        <sl-label for="input1">Email</sl-label>
        <sl-text-input id="input1" placeholder="email" required type="email"></sl-text-input>

        <sl-label for="input2">Confirm email</sl-label>
        <sl-text-input
          @input=${onInput}
          id="input2"
          placeholder="confirm email"
          required
          show-valid
          type="email"
        ></sl-text-input>

        <sl-button @click=${onClick} fill="outline">Validate</sl-button>
      </form>
    `;
  }
};

export const CustomValidation: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as TextInput)?.reportValidity();
    };

    const onInput = (event: Event & { target: HTMLInputElement }): void => {
      const { parentElement: textInput, value } = event.target;

      (textInput as TextInput).setCustomValidity(!value || value === 'SLDS' ? '' : 'Enter "SLDS"');
    };

    return html`
      <style>
        sl-text-input {
          width: 300px;
          margin-block-end: 0.5rem;
        }
      </style>
      <sl-text-input @input=${onInput} required></sl-text-input>
      <sl-button @click=${onClick} fill="outline">Validate</sl-button>
    `;
  }
};

export const CustomValidationWithHint: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as TextInput)?.reportValidity();
    };

    const onInput = (event: Event & { target: HTMLInputElement }): void => {
      const { parentElement: textInput, value } = event.target;

      (textInput as TextInput).setCustomValidity(!value || value === 'SLDS' ? '' : 'Enter "SLDS"');
    };

    return html`
      <style>
        sl-text-input {
          width: 300px;
          margin-block-end: 0.5rem;
        }
      </style>
      <sl-text-input @input=${onInput} hint-text="You need to enter 'SLDS'" required></sl-text-input>
      <sl-button @click=${onClick} fill="outline">Validate</sl-button>
    `;
  }
};
