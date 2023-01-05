import type { Textarea } from './textarea.js';
import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../label/register.js';
import './register.js';

export default {
  title: 'Textarea'
};

export const API: StoryObj = {
  args: {
    disabled: false,
    placeholder: 'Type here',
    required: false,
    value: ''
  },
  render: ({ disabled, placeholder, required, value }) =>
    html`
      <sl-textarea
        .disabled=${disabled}
        .placeholder=${placeholder}
        .required=${required}
        .value=${value}
      ></sl-textarea>
    `
};

export const Disabled: StoryObj = {
  render: () => html`<sl-textarea disabled value="I am disabled"></sl-textarea>`
};

export const Label: StoryObj = {
  render: () => html`
    <style>
      div {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    </style>
    <div>
      <sl-label for="textarea">What is your name?</sl-label>
      <sl-textarea id="textarea"></sl-textarea>
    </div>
  `
};

export const Hint: StoryObj = {
  render: () => html`
    <style>
      div {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    </style>
    <div>
      <sl-label for="textarea">Nickname</sl-label>
      <sl-textarea id="textarea" hint="What would you like people to call you?"></sl-textarea>
    </div>
  `
};

export const RichLabelHint: StoryObj = {
  render: () => html`
    <style>
      div:not([slot]) {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    </style>
    <div>
      <sl-label for="textarea">
        <label slot="label">Custom <i>label</i></label>
      </sl-label>
      <sl-textarea id="textarea">
        <div slot="hint">
          Hint is an accessible way to provide <strong>additional information</strong> that might help the user
        </div>
      </sl-textarea>
    </div>
  `
};

export const MinMaxLength: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as Textarea)?.reportValidity();
    };

    return html`
      <sl-textarea minlength="3" maxlength="5" placeholder="Min 3 and max 5 chars" required></sl-textarea>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};

export const CustomValidation: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as Textarea)?.reportValidity();
    };

    return html`
      <sl-textarea minlength="3" maxlength="5" required="true">
        <div slot="too-short">You need to enter at least 3 characters here; this is a custom message.</div>
        <div slot="value-missing">This is the custom value-missing message (for the required attribute).</div>
      </sl-textarea>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};
