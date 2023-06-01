import type { InputSize, TextInput } from './text-input';
import type { HintSize, ValidationValue, Validator } from '@sl-design-system/shared';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/label/register.js';
import type { LabelSize } from '@sl-design-system/label';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Text Input'
};

const generateIds = (form: HTMLFormElement): void => {
  const slLabels = form.querySelectorAll('sl-label');

  slLabels?.forEach((label, idx) => {
    const id = `form-textarea-${idx}`;
    label.setAttribute('for', id);
    (label.nextElementSibling as HTMLElement).setAttribute('id', id);
  });
};

const sizes: InputSize[] = ['md', 'lg'],
  labelSizes: LabelSize[] = ['sm', 'md', 'lg'],
  hintSizes: HintSize[] = ['sm', 'md', 'lg'];

export const API: StoryObj = {
  args: {
    disabled: false,
    hint: '',
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
    hint,
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
      .hint=${hint}
      .size=${size}
      .min=${min}
      .max=${max}
      .step=${step}
      .maxLength=${maxLength}
      .minLength=${minLength}
      .placeholder=${placeholder}
      .value=${value}
      .type=${type}
    >
      ${prefix ? html`<span slot="prefix">${prefix}</span>` : ''}
      ${suffix ? html`<span slot="suffix">${suffix}</span>` : ''}
    </sl-text-input>
  `
};

export const Disabled: StoryObj = {
  render: () => html`
    <style>
      sl-text-input {
        width: 400px;
      }
      </style>
    </style><sl-text-input disabled value="Input disabled"></sl-text-input>`
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
            <sl-text-input invalid size=${size} value="I am ${size} invalid"></sl-text-input>
            <sl-text-input invalid size=${size} placeholder="Placeholder ${size} invalid"></sl-text-input>
            <sl-text-input disabled invalid size=${size} value="${size} invalid disabled"></sl-text-input>
            <sl-text-input
              disabled
              invalid
              size=${size}
              placeholder="Placeholder ${size} disabled invalid"
            ></sl-text-input>
          </div>
          <div class="wrapper">
            <sl-text-input showValid valid size=${size} value="I am ${size} valid"></sl-text-input>
            <sl-text-input disabled showValid valid size=${size} value="${size} valid disabled"></sl-text-input>
          </div>
        </div>
      `
    )}
  `
};

export const Label: StoryObj = {
  render: () => {
    requestAnimationFrame(() => {
      const form = document.querySelector('form') as HTMLFormElement;
      generateIds(form);
    });

    return html`
      <style>
        form {
          display: flex;
          flex-direction: column;
        }

        sl-text-input {
          margin-bottom: 16px;
        }
      </style>
      <form>
        ${labelSizes.map(size => {
          const inputSize = size === 'lg' ? size : 'md';
          return html`
            <sl-label size=${size}>What is your name?</sl-label>
            <sl-text-input size=${inputSize}></sl-text-input>
          `;
        })}
      </form>
    `;
  }
};

export const Hint: StoryObj = {
  render: () => {
    requestAnimationFrame(() => {
      const form = document.querySelector('form') as HTMLFormElement;
      generateIds(form);
    });
    return html`
      <style>
        form {
          display: flex;
          flex-direction: column;
        }

        sl-text-input {
          margin-bottom: 16px;
        }
      </style>
      <form>
        ${hintSizes.map(hintSize => {
          return html`
            <sl-label>Nickname</sl-label>
            <sl-text-input hint="What would you like people to call you?" hintSize=${hintSize}></sl-text-input>
          `;
        })}
        <sl-label for="input4">Nickname</sl-label>
        <sl-text-input
          id="input4"
          disabled
          hint="What would you like people to call you?"
          hintSize="lg"
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

      div {
        gap: 0.25rem;
      }
    </style>
    <form>
      <sl-label for="input">
        <label slot="label">Custom <i>label</i></label>
      </sl-label>
      <sl-text-input id="input">
        <div slot="hint">
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
          align-items: start;
          display: flex;
          flex-direction: column;
        }
        sl-label {
          margin-block-start: 0.5rem;
        }
        sl-label:first-of-type {
          margin-block-start: 0;
        }
        sl-text-input {
          align-self: stretch;
        }
      </style>
      <form>
        <sl-label for="input" size="sm">Small</sl-label>
        <sl-text-input id="input" name="input" required error-size="sm"></sl-text-input>

        <sl-label for="input2" size="md">Medium</sl-label>
        <sl-text-input id="input2" name="input" required error-size="md"></sl-text-input>

        <sl-label for="input3" size="lg">Large</sl-label>
        <sl-text-input id="input3" name="input" required error-size="lg"></sl-text-input>
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
    </style>
    <form>
      <sl-label for="inputNumber">Number</sl-label>
      <sl-text-input id="inputNumber" type="number" min="0" max="6" step="2"></sl-text-input>
      <sl-label for="inputEmail">Email</sl-label>
      <sl-text-input id="inputEmail" type="email"> </sl-text-input>
      <sl-label for="inputTel">Tel</sl-label>
      <sl-text-input id="inputTel" type="tel"> </sl-text-input>
      <sl-label for="inputUrl">Url</sl-label>
      <sl-text-input id="inputUrl" type="url"> </sl-text-input>
    </form>
  `
};

export const PrefixSuffix: StoryObj = {
  render: () => html`
    <style>
      .wrapper {
        display: flex;
        gap: 16px;
      }
      sl-text-input {
        width: 400px;
      }
      sl-icon {
        display: flex;
        align-self: center;
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
          margin-bottom: 8px;
        }
      </style>
      <sl-text-input minlength="3" maxlength="5" placeholder="Min 3 and max 5 chars" required></sl-text-input>
      <sl-button @click=${onClick}>Validate</sl-button>
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
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};

export const CustomInput: StoryObj = {
  render: () => html`
    <sl-label for="custom">Custom input</sl-label>
    <sl-text-input id="custom">
      <input id="foo" slot="input" placeholder="I am a custom input" />
    </sl-text-input>
  `
};

export const ValidInput: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      const secondInput = event.target.previousElementSibling as TextInput;
      secondInput.reportValidity();
    };

    const validator: Validator = {
      message: 'Enter the same email address',
      isValid: (_: HTMLElement, value: ValidationValue): boolean => {
        return value?.toString() === document.querySelectorAll('sl-text-input')[0].value;
      }
    };

    return html`
      <style>
        .wrapper {
          display: flex;
          flex-direction: column;
        }
        sl-text-input {
          width: 400px;
          margin-bottom: 16px;
        }
        sl-button {
          width: fit-content;
        }
      </style>
      <div class="wrapper">
        <sl-label for="input1">Email</sl-label>
        <sl-text-input
          showValid
          .validators=${[validator]}
          id="input1"
          placeholder="email"
          type="email"
        ></sl-text-input>
        <sl-label for="input2">Confirm email</sl-label>
        <sl-text-input
          id="input2"
          showValid
          .validators=${[validator]}
          placeholder="confirm email"
          type="email"
        ></sl-text-input>
        <sl-button @click=${onClick}>Validate</sl-button>
      </div>
    `;
  }
};

export const CustomValidation: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as TextInput)?.reportValidity();
    };

    const validator: Validator = {
      message: 'Enter "SLDS"',
      isValid: (_: HTMLElement, value: ValidationValue): boolean => value === 'SLDS'
    };

    return html`
      <style>
        sl-text-input {
          width: 300px;
          margin-bottom: 8px;
        }
      </style>
      <sl-text-input required="true" .validators=${[validator]} error-size="sm"></sl-text-input>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};

export const CustomValidationWithHint: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as TextInput)?.reportValidity();
    };

    const validator: Validator = {
      message: 'Enter "SLDS"',
      isValid: (_: HTMLElement, value: ValidationValue): boolean => value === 'SLDS'
    };

    return html`
      <style>
        sl-text-input {
          width: 300px;
          margin-bottom: 8px;
        }
      </style>
      <sl-text-input required="true" .validators=${[validator]} hint="You need to enter 'SLDS'"></sl-text-input>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};
