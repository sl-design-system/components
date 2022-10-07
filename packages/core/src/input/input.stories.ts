import { Story } from '@storybook/web-components';
import { html } from 'lit';
import '../button-bar/register.js';
import './register.js';
import { useArgs } from '@storybook/client-api';
import {Input} from "./input";

export default {
  title: 'Input'
};

export const API: Story = {
  args: {
    fill: 'solid',
    size: 'md',
    text: 'Button',
    variant: 'primary'
  },
  render: ({ /*fill, size, text, variant*/ }) => html`
    <form>
        <label id="input-1" for="input-2">label</label>
          <sl-input id="input-2" placeholder="placeholder"></sl-input>
    </form>
  `
};


// export const Test: Story = (_: any, {loaded: {input}}: any, {isInvalid}: boolean) => {
//   export const Test: Story = ({args: {isInvalid}}: any, test2: test2}) => {
//   export const Test = (args: { isInvalid: boolean}) => {
    export const InputInForm = ({ isInvalid, messageValidation }: { isInvalid: boolean, messageValidation: string }) => {
  // form: document.querySelector('form'),
  // input: document.querySelector('sl-input'),
  // errorMessage: document.querySelector('.error-message'),

  // (form as HTMLFormElement).addEventListener('submit', (e: Event) => {
  //   e.preventDefault();
  // });
  //
  // input.addEventListener('invalid', (e: Event) => {
  //   errorMessage.textContent = input.validationMessage;
  // });

  // const [_, updateArgs] = useArgs();

  const [_, updateArgs] = useArgs(),
    onInvalid = (event: Event) => {
    console.log('event in story', event, event.target, (event.target as Input).validationMessage);
    // event.target.addEventListener()
      updateArgs({isInvalid: true, messageValidation: (event.target as Input).validationMessage});
    },
    onChange = (event: Event) => {
    if ((event.target as Input).validity.valid) {
      updateArgs({isInvalid: false, messageValidation: ''});
    }
      console.log('event in story onchange', event, event.target, 'attribute invalid???', (event.target as Input).invalid, (event.target as HTMLInputElement).validity.valid, (event.target as Input).validationMessage, (event.target as Input).validity.valid);
    },
    onClone = (event: Event) => {
      console.log('event in story onclone', event, event.target, (event.target as Input).validationMessage);
    },
    onValidateEvent = (event: Event) => {
      console.log('event in story onValidateEvent', event, event.target, (event.target as Input).validationMessage);
    },
    onSubmit = (event: Event) => {
      event.preventDefault();
      console.log('event in story submittt', event, event.target, (event.target as Input).validationMessage);
    };

  const message = () => {
    return document.querySelector('sl-input')?.validationMessage;
  };

  /*render: () =>*/return html/*template:*/ `
    <style>
      label {
        font-size: 14px;
      }

      .error-message {
        display: none;
        border: 1px solid #ff0000;
        color: #ff0000;
        padding: 5px;
      }

      [invalid] ~ .error-message {
        display: inline-block;
        margin-top: 5px;
      }

      /*label + [invalid] {
        color: red;
      }*/
    </style>
    <form id="formId5">
      <label for="my-input5">Label in form</label>
      <div>${messageValidation}</div>
      <sl-input id="my-input5"
                @change="${onChange}"
                @invalid="${onInvalid}"
                @clone="${onClone}"
                @onValidate="${onValidateEvent}"
                custom-error-display
                type="text"
                required
                data-valueMissing="This field is required"
                minlength="5"
                data-tooShort="Type at least 5 characters, please">
      </sl-input>
      <!--<button type="submit" onClick="noRefCheck(){}">Send</button>-->
      <button type="submit" @submit="${onSubmit}">Send</button>
    </form>
    <form id="formId50">
    <label for="my-input6">Label</label>
    <sl-input id="my-input6" type="text" custom-error-display validate-on-change required data-valueMissing="This field is required..."></sl-input>
    </form>
  `//,

      //validate-on-change
      // ${input?.validationMessage}
  // props: { form, input, errorMessage },
  //
  // errorMessage: document.querySelector('.error-message'),
  //
  // form: document.querySelector('form')?.addEventListener('submit', (e: Event) => {
  //   e.preventDefault();
  // }),
  //
  // input: document.querySelector('sl-input')?.addEventListener('invalid', (e: Event) => {
  //   this.errorMessage.textContent = document.querySelector('sl-input')?.validationMessage;
  // })

  // on inValid = event => updateArgs();
};

InputInForm.args = {
  isInvalid: false,
  messageValidation: ''
};

export const InputValidation = ({ isInvalid, messageValidation }: { isInvalid: boolean, messageValidation: string }) => {
  const [_, updateArgs] = useArgs(),
    onInvalid = (event: Event) => {
      console.log('event in story', event, event.target, (event.target as Input).validationMessage);
      updateArgs({isInvalid: true, messageValidation: (event.target as Input).validationMessage});
    },
    onChange = (event: Event) => {
      console.log('(event.target as Input). checkvalidity in onchange event story', (event.target as Input).checkValidity());
      if ((event.target as Input).validity.valid) {
        updateArgs({isInvalid: false, messageValidation: ''});
      }
      console.log('event in story onchange', event, event.target, 'attribute invalid???', (event.target as Input).invalid, (event.target as HTMLInputElement).validity.valid, (event.target as Input).validationMessage, (event.target as Input).validity.valid);
    },
    onClone = (event: Event) => {
      console.log('event in story onclone', event, event.target, (event.target as Input).validationMessage);
    },
    onValidateEvent = (event: Event) => {
      console.log('event in story onValidateEvent', event, event.target, (event.target as Input).validationMessage);
    },
    onBlur = (event: Event) => {
      console.log('event in story onBlur', event, event.target, (event.target as Input).validationMessage);
      updateArgs({isInvalid: true, messageValidation: (event.target as Input).validationMessage})
    };

  return html`
    <style>
      label {
        font-size: 14px;
      }

      .error-message {
        display: none;
        border: 1px solid #ff0000;
        color: #ff0000;
        padding: 5px;
      }

      [invalid] ~ .error-message {
        display: inline-block;
        margin-top: 5px;
      }
    </style>
    <form id="formId7">
      <label for="my-input7">Label in form</label>
      <sl-input id="my-input7"
                @change="${onChange}"
                @invalid="${onInvalid}"
                @clone="${onClone}"
                @onValidate="${onValidateEvent}"
                @blur="${onBlur}"
                validate-on-change
                custom-error-display
                type="text"
                required
                minlength="5"
                data-tooShort="Type at least 5 characters, please"
                data-valueMissing="This field is required">
      </sl-input>
      <div>${messageValidation}</div>
    </form>
  `//,
};

InputValidation.args = {
  isInvalid: false,
  messageValidation: ''
};


export const InputWithErrorMessageOutsideOfTheSLInput = ({ isInvalid, messageValidation }: { isInvalid: boolean, messageValidation: string }) => {
  const [_, updateArgs] = useArgs(),
      onBlur = (event: Event) => {
        console.log('event in story onBlur', event, event.target, (event.target as Input).validationMessage);
        updateArgs({isInvalid: true, messageValidation: (event.target as Input).validationMessage})
      };

  return html`
    <style>
      label {
        font-size: 14px;
      }

      .validation-message {
        display: none;
        color: #ed1d23;
        font-size: 14px;
        padding: 0;
      }

      [invalid] ~ .validation-message {
        display: inline-block;
      }
    </style>
    <p>Input without form</p>
    <p>Checking validation on blur with validation message outside the shadow DOM</p>
    <label for="my-input-6">Label</label>
    <sl-input id="my-input-6" type="text" @blur="${onBlur}" custom-error-display validate-on-change required data-valueMissing="This field is required..."></sl-input>
    <div class="validation-message">${messageValidation}</div>
  `
};

InputWithErrorMessageOutsideOfTheSLInput.args = {
  isInvalid: false,
  messageValidation: ''
};
