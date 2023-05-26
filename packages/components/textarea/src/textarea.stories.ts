import type { ResizeType, Textarea, TextareaSize } from './textarea.js';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/label/register.js';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Textarea'
};

const resizeTypes: ResizeType[] = ['none', 'vertical', 'auto'];

const sizes: TextareaSize[] = ['md', 'lg'];

export const API: StoryObj = {
  args: {
    disabled: false,
    placeholder: 'Type here',
    required: false,
    autofocus: false,
    size: 'md',
    value: '',
    resize: 'none',
    hint: ''
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    },
    resize: {
      control: 'inline-radio',
      options: resizeTypes
    }
  },
  render: ({ disabled, placeholder, required, autofocus, size, value, resize, hint }) =>
    html`
      <style>
        /*sl-textarea {*/
        /*  width: 500px;*/
        /*}*/
      </style>
      <sl-textarea
        .disabled=${disabled}
        .placeholder=${placeholder}
        .required=${required}
        .autofocus=${autofocus}
        .size=${size}
        .value=${value}
        .resize=${resize}
        .hint=${hint}
      ></sl-textarea>
    `
}; // TODO: add hint as well?

export const Disabled: StoryObj = {
  render: () => html`<sl-textarea disabled value="Textarea disabled"></sl-textarea>`
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
            <sl-textarea size="md" placeholder="Placeholder md"></sl-textarea>
            <sl-textarea size="md" value="I am medium"></sl-textarea>
            <sl-textarea readonly size="md" value="I am md readonly"></sl-textarea>
            <sl-textarea disabled size="md" value="I am md disabled"></sl-textarea>
            <sl-textarea disabled size="md" placeholder="Placeholder md disabled"></sl-textarea>
          </div>
          <div class="wrapper">
            <sl-textarea invalid size="md" value="I am md invalid"></sl-textarea>
            <sl-textarea invalid size="md" placeholder="Placeholder md invalid"></sl-textarea>
            <sl-textarea disabled invalid size="md" value="I am md invalid disabled"></sl-textarea>
            <sl-textarea disabled invalid size="md" placeholder="Placeholder md disabled invalid"></sl-textarea>
          </div>
          <div class="wrapper">
            <sl-textarea showValid valid size="md" value="I am md valid"></sl-textarea>
            <sl-textarea disabled showValid valid size="md" value="I am md valid disabled"></sl-textarea>
          </div>
        </div>
      `
    )}

    <h2>Medium</h2>
    <div class="content-wrapper">
      <div class="wrapper">
        <sl-textarea size="md" placeholder="Placeholder md"></sl-textarea>
        <sl-textarea size="md" value="I am medium"></sl-textarea>
        <sl-textarea readonly size="md" value="I am md readonly"></sl-textarea>
        <sl-textarea disabled size="md" value="I am md disabled"></sl-textarea>
        <sl-textarea disabled size="md" placeholder="Placeholder md disabled"></sl-textarea>
      </div>
      <div class="wrapper">
        <sl-textarea invalid size="md" value="I am md invalid"></sl-textarea>
        <sl-textarea invalid size="md" placeholder="Placeholder md invalid"></sl-textarea>
        <sl-textarea disabled invalid size="md" value="I am md invalid disabled"></sl-textarea>
        <sl-textarea disabled invalid size="md" placeholder="Placeholder md disabled invalid"></sl-textarea>
      </div>
      <div class="wrapper">
        <sl-textarea showValid valid size="md" value="I am md valid"></sl-textarea>
        <sl-textarea disabled showValid valid size="md" value="I am md valid disabled"></sl-textarea>
      </div>
      <h2>Large</h2>
      <div class="wrapper">
        <sl-textarea size="lg" placeholder="Placeholder lg"></sl-textarea>
        <sl-textarea size="lg" value="I am large"></sl-textarea>
        <sl-textarea readonly size="lg" value="I am lg readonly"></sl-textarea>
        <sl-textarea disabled size="lg" value="I am lg disabled"></sl-textarea>
        <sl-textarea disabled size="lg" placeholder="Placeholder lg disabled"></sl-textarea>
      </div>
      <div class="wrapper">
        <sl-textarea invalid size="lg" value="I am lg invalid"></sl-textarea>
        <sl-textarea invalid size="lg" placeholder="Placeholder lg invalid"></sl-textarea>
        <sl-textarea disabled invalid size="lg" value="I am lg invalid disabled"></sl-textarea>
        <sl-textarea disabled invalid size="lg" placeholder="Placeholder lg disabled invalid"></sl-textarea>
      </div>
      <div class="wrapper">
        <sl-textarea showValid valid size="lg" value="I am lg valid"></sl-textarea>
        <sl-textarea disabled showValid valid size="lg" value="I am lg valid disabled"></sl-textarea>
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
      sl-textarea {
        width: 300px;
        --sl-textarea-min-height-md: 100px;
      }
    </style>
    <form>
      <sl-label for="textarea">What is your name?</sl-label>
      <sl-textarea id="textarea"></sl-textarea>
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
      <sl-label for="textarea">Nickname</sl-label>
      <sl-textarea id="textarea" hint="What would you like people to call you?"></sl-textarea>
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
      <sl-label for="textarea">
        <label slot="label">Custom <i>label</i></label>
      </sl-label>
      <sl-textarea id="textarea">
        <div slot="hint">
          Hint is an accessible way to provide <strong>additional information</strong> that might help the user
        </div>
      </sl-textarea>
    </form>
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
