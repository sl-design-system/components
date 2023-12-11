import type { Textarea, TextareaSize } from './textarea.js';
import type { LabelSize } from '@sl-design-system/form';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/form/register.js';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Textarea'
};

const sizes: TextareaSize[] = ['md', 'lg'],
  labelSizes: LabelSize[] = ['sm', 'md', 'lg'];

export const API: StoryObj = {
  args: {
    disabled: false,
    placeholder: 'Type here',
    required: false,
    size: 'md',
    value: '',
    resize: 'none',
    readonly: false
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    },
    resize: {
      control: 'inline-radio',
      options: ['none', 'vertical', 'auto']
    }
  },
  render: ({ disabled, placeholder, required, size, value, resize, readonly }) =>
    html`
      <sl-textarea
        ?readonly=${readonly}
        .disabled=${disabled}
        .placeholder=${placeholder}
        .required=${required}
        .resize=${resize}
        .size=${size}
        .value=${value}
      ></sl-textarea>
    `
};

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
            <sl-textarea size=${size} placeholder="Placeholder ${size}"></sl-textarea>
            <sl-textarea size=${size} value="I am ${size}"></sl-textarea>
            <sl-textarea readonly size=${size} value="${size} readonly"></sl-textarea>
            <sl-textarea disabled size=${size} value="${size} disabled"></sl-textarea>
            <sl-textarea disabled size=${size} placeholder="Placeholder ${size} disabled"></sl-textarea>
          </div>
          <div class="wrapper">
            <sl-textarea invalid size=${size} value="${size} invalid"></sl-textarea>
            <sl-textarea invalid size=${size} placeholder="Placeholder ${size} invalid"></sl-textarea>
            <sl-textarea disabled invalid size=${size} value="${size} invalid disabled"></sl-textarea>
            <sl-textarea disabled invalid size=${size} placeholder="Placeholder ${size} disabled invalid"></sl-textarea>
          </div>
          <div class="wrapper">
            <sl-textarea showValid valid size=${size} value="I am md valid"></sl-textarea>
            <sl-textarea disabled show-valid valid size=${size} value="${size} valid disabled"></sl-textarea>
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

        sl-textarea {
          width: 300px;
          --sl-textarea-rows: 5;
          margin-bottom: 1rem;
        }
      </style>
      <form>
        ${labelSizes.map((size, id) => {
          const textareaSize = size === 'lg' ? size : 'md';
          return html`
            <sl-label for="form-textarea-${id}" size=${size}>What is your name?</sl-label>
            <sl-textarea id="form-textarea-${id}" size=${textareaSize}></sl-textarea>
          `;
        })}
      </form>
    `;
  }
};

export const MinMaxLength: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as Textarea)?.reportValidity();
    };

    return html`
      <style>
        sl-textarea {
          width: 350px;
          margin-bottom: 8px;
        }
      </style>
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
      <style>
        sl-textarea {
          width: 350px;
          margin-bottom: 8px;
        }
      </style>
      <sl-textarea minlength="3" maxlength="5" required>
        <div slot="too-short">You need to enter at least 3 characters here; this is a custom message.</div>
        <div slot="value-missing">This is the custom value-missing message (for the required attribute).</div>
      </sl-textarea>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};
