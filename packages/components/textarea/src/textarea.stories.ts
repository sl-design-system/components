import type { ResizeType, Textarea, TextareaSize } from './textarea.js';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/label/register.js';
import type { HintSize } from '@sl-design-system/shared';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Textarea'
};

const generateIds = (form: HTMLFormElement): void => {
  const slLabels = form.querySelectorAll('sl-label');

  slLabels?.forEach((label, idx) => {
    const id = `form-textarea-${idx}`;
    label.setAttribute('for', id);
    (label.nextElementSibling as HTMLElement).setAttribute('id', id);
  });
};

const resizeTypes: ResizeType[] = ['none', 'vertical', 'auto'],
  sizes: TextareaSize[] = ['md', 'lg'],
  hintSizes: HintSize[] = ['sm', 'md', 'lg'];

export const API: StoryObj = {
  args: {
    disabled: false,
    placeholder: 'Type here',
    required: false,
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
  render: ({ disabled, placeholder, required, size, value, resize, hint }) =>
    html`
      <sl-textarea
        .disabled=${disabled}
        .placeholder=${placeholder}
        .required=${required}
        .size=${size}
        .value=${value}
        .resize=${resize}
        .hint=${hint}
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
            <sl-textarea disabled showValid valid size=${size} value="${size} valid disabled"></sl-textarea>
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

        sl-textarea {
          width: 300px;
          --sl-textarea-min-height-md: 100px;
          --sl-textarea-min-height-lg: 150px;
          margin-bottom: 1rem;
        }
      </style>
      <form>
        <sl-label>What is your name?</sl-label>
        <sl-textarea></sl-textarea>
        ${sizes.map(size => {
          const textareaSize = size === 'lg' ? size : 'md';
          return html`
            <sl-label size=${size}>What is your name?</sl-label>
            <sl-textarea size=${textareaSize}></sl-textarea>
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

        sl-textarea {
          margin-bottom: 1rem;
        }
      </style>
      <form>
        ${hintSizes.map(hintSize => {
          return html`
            <sl-label>Nickname</sl-label>
            <sl-textarea hint="What would you like people to call you?" hintSize=${hintSize}></sl-textarea>
          `;
        })}
        <sl-label for="textarea4">Nickname</sl-label>
        <sl-textarea
          id="textarea4"
          disabled
          hint="What would you like people to call you?"
          hintSize="lg"
          value="Disabled textarea"
        ></sl-textarea>
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
      <sl-textarea minlength="3" maxlength="5" required="true">
        <div slot="too-short">You need to enter at least 3 characters here; this is a custom message.</div>
        <div slot="value-missing">This is the custom value-missing message (for the required attribute).</div>
      </sl-textarea>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};
