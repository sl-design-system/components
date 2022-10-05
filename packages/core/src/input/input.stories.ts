import { Story } from '@storybook/web-components';
import { html } from 'lit';
import '../button-bar/register.js';
import './register.js';
import Props from "@storybook/addon-links/dist/react";

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

export const InputTest: Story = {
  render: () => html`
    <form>
      <label for="test1">label</label>
      <sl-input id="test1"></sl-input>
    </form>
  `
};

export const InputTest3: Story = {
  render: () => html`
    <form id="formId">
      <label for="test3">label 3</label>
      <sl-input id="test3" placeholder="placeholder"></sl-input>
    </form>
  `
};

export const InputTest4: Story = {
  render: () => html`
    <form id="formId4">
      <label id="test4" for="test5">label 4</label>
      <sl-input id="test5" placeholder="placeholder"></sl-input>
    </form>
    <label for="my-input">Label</label>
    <input id="my-input">
    <label for='label_for'>Enter search text </label>
    <input type='text' id='label_for'>
  `
};

// export const Test: Story = {
export const Test: Story = (_: any, {loaded: {input}}: any) => {
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

  const message = () => {
    return document.querySelector('sl-input')?.validationMessage;
  };

  /*render: () =>*/return html/*template:*/ `
    <style>
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
      <sl-input id="my-input5"
                validate-on-change
                custom-error-display
                type="text"
                required
                minlength="5"
                data-tooShort="Type at least 5 characters, please"
                data-valueMissing="This field is required">
      </sl-input>
      <div class="error-message">test error message ${input?.validationMessage} ${message} ${document.querySelector('sl-input')?.validationMessage}</div>
      <div style="color: blue;">${document.querySelector('sl-input')?.validationMessage}</div>
      <!--<button type="submit" onClick="noRefCheck(){}">Send</button>-->
    </form>
    <label for="my-input6">Label</label>
    <sl-input id="my-input6"></sl-input>
  `//,
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
};

/*export const ExampleWithText = Test.bind({});
ExampleWithText.play = async () => {
  // The play function interacts with the component and looks for the text
  await document.querySelector('sl-input');
};*/

Test.loaders = [async () => ({input: await document.querySelector('sl-input')})];


/*Test.args = {
  form: document.querySelector('form'),
  input: HTMLElement, //document.querySelector('sl-input'),
  errorMessage: HTMLElement //document.querySelector('.error-message')
};*/

/*const withPreventDefault = ({action}: { action: any }) => (e: Event) => {
  e.preventDefault();
  return action(e);
};*/
