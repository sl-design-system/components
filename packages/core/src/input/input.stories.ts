import type { ValidationValue, Validator } from '../utils/index.js';
import type { Input } from './index.js';
import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../button/register.js';
import '../label/register.js';
import './register.js';

export default {
  title: 'Input'
};

export const API: StoryObj = {
  args: {
    disabled: false,
    hint: '',
    placeholder: 'Type something here',
    prefix: '',
    required: false,
    suffix: '',
    value: ''
  },
  argTypes: {
    maxLength: { type: 'number' },
    minLength: { type: 'number' }
  },
  render: ({ disabled, hint, maxLength, minLength, placeholder, prefix, required, suffix, value }) => html`
    <sl-input
      ?disabled=${disabled}
      ?required=${required}
      .hint=${hint}
      .maxLength=${maxLength}
      .minLength=${minLength}
      .placeholder=${placeholder}
      .value=${value}
    >
      ${prefix ? html`<span slot="prefix">${prefix}</span>` : ''}
      ${suffix ? html`<span slot="suffix">${suffix}</span>` : ''}
    </sl-input>
  `
};

export const Disabled: StoryObj = {
  render: () => html`<sl-input disabled value="I am disabled"></sl-input>`
};

// TODO: all instead of sizes
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
    </style>
    <h2>Medium</h2>
    <div class="content-wrapper">
      <div class="wrapper">
        <sl-input size="md" placeholder="Placeholder md"></sl-input>
        <sl-input size="md" value="I am medium"></sl-input>
        <sl-input readonly size="md" value="I am md readonly"></sl-input>
        <sl-input disabled size="md" value="I am md disabled"></sl-input>
        <sl-input disabled size="md" placeholder="Placeholder md disabled"></sl-input>
      </div>
      <div class="wrapper">
        <sl-input invalid size="md" value="I am md invalid"></sl-input>
        <sl-input invalid size="md" placeholder="Placeholder md invalid"></sl-input>
        <sl-input disabled invalid size="md" value="I am md invalid disabled"></sl-input>
        <sl-input disabled invalid size="md" placeholder="Placeholder md disabled invalid"></sl-input>
      </div>
      <div class="wrapper">
        <sl-input showValid valid size="md" value="I am md valid"></sl-input>
        <sl-input disabled showValid valid size="md" value="I am md valid disabled"></sl-input>
      </div>
      <h2>Large</h2>
      <div class="wrapper">
        <sl-input size="lg" placeholder="Placeholder lg"></sl-input>
        <sl-input size="lg" value="I am large"></sl-input>
        <sl-input readonly size="lg" value="I am lg readonly"></sl-input>
        <sl-input disabled size="lg" value="I am lg disabled"></sl-input>
        <sl-input disabled size="lg" placeholder="Placeholder lg disabled"></sl-input>
      </div>
      <div class="wrapper">
        <sl-input invalid size="lg" value="I am lg invalid"></sl-input>
        <sl-input invalid size="lg" placeholder="Placeholder lg invalid"></sl-input>
        <sl-input disabled invalid size="lg" value="I am lg invalid disabled"></sl-input>
        <sl-input disabled invalid size="lg" placeholder="Placeholder lg disabled invalid"></sl-input>
      </div>
      <div class="wrapper">
        <sl-input showValid valid size="lg" value="I am lg valid"></sl-input>
        <sl-input disabled showValid valid size="lg" value="I am lg valid disabled"></sl-input>
      </div>
    </div>
  `
};

export const Label: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
    </style>
    <form>
      <sl-label for="input" size="sm">What is your name?</sl-label>
      <sl-input id="input"><span id="123a" slot="hint" hintSize="lg">test</span></sl-input>
      <sl-label for="input2" size="md">What is your name?</sl-label>
      <sl-input id="input2"></sl-input>
      <sl-label for="input3" size="lg">What is your name?</sl-label>
      <sl-input id="input3" size="lg"></sl-input>
    </form>
  `
};

export const Hint: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
    </style>
    <form>
      <sl-label for="input">Nickname</sl-label>
      <sl-input id="input" hint="What would you like people to call you?"></sl-input>
      <sl-label for="input2">Nickname</sl-label>
      <sl-input id="input2" hint="What would you like people to call you?"></sl-input>
      <sl-label for="input3">Nickname</sl-label>
      <sl-input id="input3" hint="What would you like people to call you?" hintSize="lg"></sl-input>
      <sl-label for="input4">Nickname</sl-label>
      <sl-input
        id="input4"
        disabled
        hint="What would you like people to call you?"
        hintSize="lg"
        value="Disabled input"
      ></sl-input>
    </form>
  `
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
      <sl-input id="input">
        <div slot="hint">
          Hint is an accessible way to provide <strong>additional information</strong> that might help the user
        </div>
      </sl-input>
    </form>
  `
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
      <sl-input id="inputNumber" type="number" min="0" max="3" step="2"></sl-input>
      <sl-label for="custom2">Age</sl-label>
      <sl-input id="custom2" type="number">
        <input id="foo" slot="input" placeholder="I am a custom input" type="number" min="0" />
      </sl-input>
      <sl-label for="inputEmail">Email</sl-label>
      <sl-input id="inputEmail" type="email"> </sl-input>
      <sl-label for="inputTel">Tel</sl-label>
      <sl-input id="inputTel" type="tel"> </sl-input>
      <sl-label for="inputUrl">Url</sl-label>
      <sl-input id="inputUrl" type="url"> </sl-input>
    </form>
  `
};

export const PrefixSuffix: StoryObj = {
  render: () => html`
    <sl-input>
      <span slot="prefix">prefix</span>
      <span slot="suffix">suffix</span>
    </sl-input>
  `
};

export const MinMaxLength: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as Input)?.reportValidity();
    };

    return html`
      <style>
        sl-input {
          width: 300px;
          margin-right: 8px;
        }
      </style>
      <sl-input minlength="3" maxlength="5" placeholder="Min 3 and max 5 chars" required></sl-input>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};

export const Pattern: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as Input)?.reportValidity();
    };

    return html`
      <style>
        sl-input {
          width: 300px;
          margin-right: 8px;
        }
      </style>
      <sl-input pattern=".{3,5}" placeholder="Min 3 and max 5 chars using pattern" required></sl-input>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};

export const CustomInput: StoryObj = {
  render: () => html`
    <sl-label for="custom">Custom input</sl-label>
    <sl-input id="custom">
      <input id="foo" slot="input" placeholder="I am a custom input" />
    </sl-input>
  `
};

export const ValidInput: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as Input)?.reportValidity();
    };

    const inputToConfirm = document.querySelector('#input1') as HTMLInputElement;

    const validator: Validator = {
      message: 'Enter the same email address',
      isValid: (_: HTMLElement, value: ValidationValue): boolean => value === inputToConfirm?.value
    };

    return html`
      <style>
        .wrapper {
          display: flex;
          flex-direction: column;
        }
        sl-input {
          width: 400px;
          margin-bottom: 8px;
        }
        sl-button {
          width: fit-content;
        }
      </style>
      <div class="wrapper">
        <sl-label for="input1">Email</sl-label>
        <sl-input showValid id="input1" placeholder="email" type="email"></sl-input>
        <sl-label for="input2">Confirm email</sl-label>
        <sl-input
          id="input2"
          showValid
          .validators=${[validator]}
          placeholder="confirm email"
          @blur="${onClick}"
          type="email"
        ></sl-input>
        <sl-button @click=${onClick}>Validate</sl-button>
      </div>
    `;
  }
};

export const CustomValidation: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as Input)?.reportValidity();
    };

    const validator: Validator = {
      message: 'Enter "SLDS"',
      isValid: (_: HTMLElement, value: ValidationValue): boolean => value === 'SLDS'
    };

    return html`
      <style>
        sl-input {
          width: 300px;
        }
      </style>
      <sl-input required="true" .validators=${[validator]} error-size="sm"></sl-input>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};

export const CustomValidationWithHint: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as Input)?.reportValidity();
    };

    const validator: Validator = {
      message: 'Enter "SLDS"',
      isValid: (_: HTMLElement, value: ValidationValue): boolean => value === 'SLDS'
    };

    return html`
      <style>
        sl-input {
          width: 300px;
        }
      </style>
      <sl-input showValid required="true" .validators=${[validator]} hint="You need to enter 'SLDS'"></sl-input>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};
